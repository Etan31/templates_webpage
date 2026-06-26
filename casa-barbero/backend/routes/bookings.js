import { Router } from 'express'
import supabase from '../database.js'

const router = Router()

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

// POST /api/bookings — reserve a slot (status = "pending" until payment)
router.post('/', async (req, res) => {
  const {
    customer_name, phone,
    service_id, service_name,
    barber_id, barber_name,
    date, time_slot, duration_min, amount,
  } = req.body

  // Validate required fields
  const missing = ['customer_name','phone','service_id','service_name',
                   'barber_id','barber_name','date','time_slot','duration_min','amount']
    .filter(k => !req.body[k])
  if (missing.length) {
    return res.status(400).json({ error: `Missing: ${missing.join(', ')}` })
  }

  // Conflict check — prevent double-booking the same slot
  const { data: existing } = await supabase
    .from('bookings')
    .select('time_slot, duration_min')
    .eq('barber_id', barber_id)
    .eq('date', date)
    .neq('status', 'cancelled')

  const newStart = timeToMin(time_slot)
  const newEnd   = newStart + parseInt(duration_min, 10)

  const conflict = (existing || []).some(b => {
    const bStart = timeToMin(b.time_slot)
    const bEnd   = bStart + b.duration_min
    return newStart < bEnd && newEnd > bStart
  })

  if (conflict) {
    return res.status(409).json({
      error: 'This slot was just taken. Please choose a different time.',
    })
  }

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      customer_name,
      phone,
      service_id,
      service_name,
      barber_id,
      barber_name,
      date,
      time_slot,
      duration_min: parseInt(duration_min, 10),
      amount:       parseInt(amount, 10),
      status:       'pending',
    })
    .select()
    .single()

  if (error) return res.status(500).json({ error: error.message })

  res.status(201).json({ booking })
})

// GET /api/bookings/:id — fetch a booking with its payment log
router.get('/:id', async (req, res) => {
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*, payment_logs(*)')
    .eq('id', req.params.id)
    .single()

  if (error || !booking) return res.status(404).json({ error: 'Booking not found' })
  res.json({ booking })
})

export default router
