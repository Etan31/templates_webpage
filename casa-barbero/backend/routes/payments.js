import { Router } from 'express'
import supabase from '../database.js'
import { createCalendarEvent } from '../google-calendar.js'

const router = Router()
const PM_BASE = 'https://api.paymongo.com/v1'

// PayMongo uses HTTP Basic auth: base64(secretKey + ":")
function pmAuth() {
  return 'Basic ' + Buffer.from(process.env.PAYMONGO_SECRET_KEY + ':').toString('base64')
}

async function pmFetch(endpoint, options = {}) {
  const res = await fetch(PM_BASE + endpoint, {
    ...options,
    headers: {
      Authorization:  pmAuth(),
      'Content-Type': 'application/json',
      Accept:         'application/json',
      ...options.headers,
    },
  })
  const json = await res.json()
  if (!res.ok) {
    const msg = json.errors?.[0]?.detail || json.errors?.[0]?.code || 'PayMongo error'
    throw new Error(msg)
  }
  return json
}

// Confirm payment on a booking and optionally create a Google Calendar event
async function confirmBooking(bookingId, intentId) {
  await supabase.from('bookings').update({ status: 'paid' }).eq('id', bookingId)
  await supabase.from('payment_logs')
    .update({ status: 'paid' })
    .eq('paymongo_intent_id', intentId)

  const { data: booking } = await supabase
    .from('bookings').select('*').eq('id', bookingId).single()

  if (booking) {
    const eventId = await createCalendarEvent(booking)
    if (eventId) {
      await supabase.from('bookings').update({ google_event_id: eventId }).eq('id', bookingId)
    }
  }
}

// ── POST /api/payments ──────────────────────────────────
// Accepts card details + booking_id. Creates a PayMongo Payment Intent,
// attaches the card, and either confirms immediately or triggers 3DS.
router.post('/', async (req, res) => {
  const { booking_id, card_number, exp_month, exp_year, cvc } = req.body

  if (!booking_id || !card_number || !exp_month || !exp_year || !cvc) {
    return res.status(400).json({ error: 'booking_id, card_number, exp_month, exp_year, and cvc are required' })
  }

  // Look up the booking
  const { data: booking, error: bErr } = await supabase
    .from('bookings').select('*').eq('id', booking_id).single()

  if (bErr || !booking) return res.status(404).json({ error: 'Booking not found' })
  if (booking.status === 'paid') return res.status(400).json({ error: 'This booking is already paid' })

  // Normalize year: "25" → 2025, "2025" stays as-is
  const year4 = parseInt(exp_year, 10) < 100
    ? 2000 + parseInt(exp_year, 10)
    : parseInt(exp_year, 10)

  try {
    // Step 1: Tokenize the card (create a payment method)
    const pmMethod = await pmFetch('/payment_methods', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          attributes: {
            type: 'card',
            details: {
              card_number: String(card_number).replace(/\s/g, ''),
              exp_month:   parseInt(exp_month, 10),
              exp_year:    year4,
              cvc:         String(cvc),
            },
            billing: {
              name:  booking.customer_name,
              phone: booking.phone,
            },
          },
        },
      }),
    })
    const paymentMethodId = pmMethod.data.id

    // Step 2: Create the payment intent (amount in centavos)
    const pmIntent = await pmFetch('/payment_intents', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          attributes: {
            amount:                 booking.amount * 100,
            payment_method_allowed: ['card'],
            payment_method_options: { card: { request_three_d_secure: 'any' } },
            currency:               'PHP',
            capture_type:           'automatic',
            description:            `${booking.service_name} — Casa Barbero (${booking.id.slice(0, 8)})`,
          },
        },
      }),
    })
    const intentId  = pmIntent.data.id
    const clientKey = pmIntent.data.attributes.client_key

    // Step 3: Attach the card to the intent
    const pmAttach = await pmFetch(`/payment_intents/${intentId}/attach`, {
      method: 'POST',
      body: JSON.stringify({
        data: {
          attributes: {
            payment_method: paymentMethodId,
            client_key:     clientKey,
          },
        },
      }),
    })

    const { status, next_action, payments } = pmAttach.data.attributes
    const paymentId = payments?.[0]?.id ?? null

    // Persist a payment log row (status will be updated by webhook or poll)
    await supabase.from('payment_logs').insert({
      booking_id,
      paymongo_payment_id: paymentId,
      paymongo_intent_id:  intentId,
      status:              status === 'succeeded' ? 'paid' : 'pending',
      amount:              booking.amount,
    })

    // ── Immediate success (most test cards with no 3DS) ──
    if (status === 'succeeded') {
      await confirmBooking(booking_id, intentId)
      return res.json({ status: 'paid', booking_id, intent_id: intentId })
    }

    // ── 3DS redirect required ────────────────────────────
    if (next_action?.type === 'redirect' && next_action.redirect?.url) {
      return res.json({
        status:       'requires_action',
        redirect_url: next_action.redirect.url,
        intent_id:    intentId,
        booking_id,
      })
    }

    res.json({ status, booking_id, intent_id: intentId })
  } catch (err) {
    console.error('[PayMongo]', err.message)
    res.status(502).json({ error: err.message })
  }
})

// ── GET /api/payments/status/:intentId ─────────────────
// Frontend polls this after a 3DS redirect to check if payment succeeded.
router.get('/status/:intentId', async (req, res) => {
  try {
    const data   = await pmFetch(`/payment_intents/${req.params.intentId}`)
    const status = data.data.attributes.status // succeeded | awaiting_payment_method | processing

    // If payment just succeeded via 3DS, confirm the booking now
    if (status === 'succeeded') {
      const { data: logs } = await supabase
        .from('payment_logs')
        .select('booking_id')
        .eq('paymongo_intent_id', req.params.intentId)
        .limit(1)

      if (logs?.[0]?.booking_id) {
        const { data: bk } = await supabase
          .from('bookings').select('status').eq('id', logs[0].booking_id).single()
        if (bk && bk.status !== 'paid') {
          await confirmBooking(logs[0].booking_id, req.params.intentId)
        }
      }
    }

    res.json({ status })
  } catch (err) {
    res.status(502).json({ error: err.message })
  }
})

// ── POST /api/webhooks/paymongo ─────────────────────────
// Exported so server.js can register it before express.json() middleware.
export async function webhookHandler(req, res) {
  try {
    const raw   = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body)
    const event = JSON.parse(raw)
    const type  = event.data?.attributes?.type

    if (type === 'payment.paid') {
      const paymentData = event.data.attributes.data
      const intentId    = paymentData?.attributes?.payment_intent_id

      if (intentId) {
        const { data: logs } = await supabase
          .from('payment_logs')
          .select('booking_id')
          .eq('paymongo_intent_id', intentId)
          .limit(1)

        if (logs?.[0]?.booking_id) {
          const { data: bk } = await supabase
            .from('bookings').select('status').eq('id', logs[0].booking_id).single()
          if (bk && bk.status !== 'paid') {
            await confirmBooking(logs[0].booking_id, intentId)
          }
        }
      }
    }

    res.json({ received: true })
  } catch (err) {
    console.error('[Webhook]', err.message)
    res.status(400).json({ error: err.message })
  }
}

export default router
