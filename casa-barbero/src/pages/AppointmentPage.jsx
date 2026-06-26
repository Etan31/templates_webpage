import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import styles from './AppointmentPage.module.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ── Static data ─────────────────────────────────────────────────────────────

const SERVICES = [
  {
    id: 'haircut',
    name: 'Haircut',
    price: 300,
    duration: 30,
    desc: 'Clean scissor cut shaped to your face — includes neckline and ear cleanup.',
  },
  {
    id: 'fade',
    name: 'Fade',
    price: 350,
    duration: 30,
    desc: 'Seamless fade from skin to length — high, mid, or low. Sharp every time.',
  },
  {
    id: 'shave',
    name: 'Shave',
    price: 200,
    duration: 20,
    desc: 'Classic hot-towel straight-razor shave for a smooth, close finish.',
  },
  {
    id: 'haircut-shave',
    name: 'Haircut + Shave',
    price: 450,
    duration: 45,
    desc: 'The full treatment — haircut, hot-towel, straight-razor shave. The works.',
  },
]

const BARBERS = [
  { id: 'john',    name: 'John'    },
  { id: 'patrick', name: 'Patrick' },
]

// PayMongo test cards — these only work in sandbox mode
const TEST_CARDS = [
  { label: 'Visa — instant approval (no 3DS)', num: '4343434343434345', exp: '12/28', cvc: '123' },
  { label: 'Visa — triggers 3DS popup',        num: '4120000000000007', exp: '12/28', cvc: '123' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function next7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const value = d.toISOString().slice(0, 10)
    const label = i === 0
      ? 'Today'
      : d.toLocaleDateString('en-PH', { weekday: 'short', month: 'short', day: 'numeric' })
    return { value, label }
  })
}

function fmt12h(t) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function fmtCard(raw) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

const DAYS = next7Days()
const STEPS = ['Service', 'Schedule', 'Details', 'Payment', 'Done']

// ── Component ────────────────────────────────────────────────────────────────

export default function AppointmentPage() {
  const [step, setStep] = useState(1)

  // Step 1
  const [service, setService] = useState(null)

  // Step 2
  const [barber,        setBarber]        = useState(null)
  const [date,          setDate]          = useState(null)
  const [slot,          setSlot]          = useState(null)
  const [slots,         setSlots]         = useState([])
  const [slotsLoading,  setSlotsLoading]  = useState(false)
  const [slotsError,    setSlotsError]    = useState('')

  // Step 3
  const [name,         setName]         = useState('')
  const [phone,        setPhone]        = useState('')
  const [bookingId,    setBookingId]    = useState(null)
  const [bookingBusy,  setBookingBusy]  = useState(false)
  const [bookingError, setBookingError] = useState('')

  // Step 4
  const [cardNum,   setCardNum]   = useState('')
  const [expMonth,  setExpMonth]  = useState('')
  const [expYear,   setExpYear]   = useState('')
  const [cvc,       setCvc]       = useState('')
  const [payBusy,   setPayBusy]   = useState(false)
  const [payError,  setPayError]  = useState('')
  const [intentId,  setIntentId]  = useState(null)
  const [polling,   setPolling]   = useState(false)

  // Scroll to top on step change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  // Fetch available slots whenever barber, date, or service changes
  useEffect(() => {
    if (!barber || !date || !service) return
    setSlots([])
    setSlot(null)
    setSlotsError('')
    setSlotsLoading(true)

    const url = `${API}/api/available-slots?barber=${barber.id}&date=${date}&duration=${service.duration}`
    fetch(url)
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error)
        setSlots(d.slots || [])
      })
      .catch(e => setSlotsError(e.message))
      .finally(() => setSlotsLoading(false))
  }, [barber, date, service])

  // ── Step 3 → 4: create the booking record ──
  async function reserveSlot() {
    setBookingBusy(true)
    setBookingError('')
    try {
      const res = await fetch(`${API}/api/bookings`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name.trim(),
          phone:         phone.trim(),
          service_id:    service.id,
          service_name:  service.name,
          barber_id:     barber.id,
          barber_name:   barber.name,
          date,
          time_slot:     slot,
          duration_min:  service.duration,
          amount:        service.price,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not reserve slot')
      setBookingId(data.booking.id)
      setStep(4)
    } catch (e) {
      setBookingError(e.message)
    } finally {
      setBookingBusy(false)
    }
  }

  // Poll the backend until the payment intent resolves (used after 3DS redirect)
  const pollIntent = useCallback(async (id) => {
    setPolling(true)
    for (let i = 0; i < 24; i++) {
      await new Promise(r => setTimeout(r, 3000))
      try {
        const res    = await fetch(`${API}/api/payments/status/${id}`)
        const { status } = await res.json()
        if (status === 'succeeded') { setStep(5); setPolling(false); return }
        if (status === 'awaiting_payment_method') {
          setPayError('Payment was not completed. Please try a different card.')
          setPolling(false)
          return
        }
      } catch { /* keep polling */ }
    }
    setPayError('Verification timed out. Contact us if your card was charged.')
    setPolling(false)
  }, [])

  // ── Step 4 → 5: process payment ──
  async function pay() {
    setPayBusy(true)
    setPayError('')
    try {
      const res = await fetch(`${API}/api/payments`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          card_number: cardNum.replace(/\s/g, ''),
          exp_month:   parseInt(expMonth, 10),
          exp_year:    parseInt(expYear, 10),
          cvc,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment failed')

      if (data.status === 'paid') {
        setStep(5)
      } else if (data.status === 'requires_action' && data.redirect_url) {
        setIntentId(data.intent_id)
        // Open 3DS popup in a new window so the user can verify
        window.open(data.redirect_url, 'paymongo_3ds', 'width=600,height=700,resizable=yes')
        pollIntent(data.intent_id)
      } else {
        setPayError(`Payment status: ${data.status}. Please try again.`)
      }
    } catch (e) {
      setPayError(e.message)
    } finally {
      setPayBusy(false)
    }
  }

  function fillTestCard({ num, exp, cvc: c }) {
    const [m, y] = exp.split('/')
    setCardNum(fmtCard(num))
    setExpMonth(m)
    setExpYear(y)
    setCvc(c)
  }

  const canPay = cardNum.replace(/\s/g, '').length === 16
    && expMonth && expYear && cvc.length >= 3
    && !payBusy && !polling

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Header ─────────────────────────────────────────── */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          Casa <span className={styles.logoAccent}>Barbero</span>
        </Link>
        <Link to="/" className={styles.back}>← Back</Link>
      </header>

      {/* ── Progress ───────────────────────────────────────── */}
      <nav className={styles.progress} aria-label="Booking steps">
        {STEPS.map((label, i) => {
          const n      = i + 1
          const active = step === n
          const done   = step > n
          return (
            <div
              key={n}
              className={`${styles.stepItem} ${active ? styles.stepActive : ''} ${done ? styles.stepDone : ''}`}
            >
              <div className={styles.stepCircle} aria-current={active ? 'step' : undefined}>
                {done ? '✓' : n}
              </div>
              <span className={styles.stepLabel}>{label}</span>
              {i < STEPS.length - 1 && <div className={styles.stepLine} />}
            </div>
          )
        })}
      </nav>

      <main className={styles.main}>

        {/* ════════════════════════════════════════════════════
            STEP 1 — Choose a service
        ════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className={styles.panel}>
            <span className={styles.eyebrow}>Step 1 of 4</span>
            <h1 className={styles.panelTitle}>Choose a Service</h1>
            <p className={styles.panelSub}>Select what you'd like done today.</p>

            <div className={styles.serviceGrid}>
              {SERVICES.map(s => (
                <button
                  key={s.id}
                  className={`${styles.serviceCard} ${service?.id === s.id ? styles.selected : ''}`}
                  onClick={() => setService(s)}
                >
                  <div className={styles.scTop}>
                    <span className={styles.scName}>{s.name}</span>
                    <span className={styles.scPrice}>₱{s.price}</span>
                  </div>
                  <p className={styles.scDesc}>{s.desc}</p>
                  <span className={styles.scDuration}>{s.duration} min</span>
                </button>
              ))}
            </div>

            <div className={styles.navRow}>
              <span />
              <button
                className={styles.btnPrimary}
                disabled={!service}
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 2 — Pick barber, date & time
        ════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className={styles.panel}>
            <span className={styles.eyebrow}>Step 2 of 4</span>
            <h1 className={styles.panelTitle}>Pick Your Schedule</h1>
            <p className={styles.panelSub}>Choose your barber, date, and a time that works.</p>

            {/* Barber */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.fieldLabel}>Select Barber</legend>
              <div className={styles.barberGrid}>
                {BARBERS.map(b => (
                  <button
                    key={b.id}
                    className={`${styles.barberCard} ${barber?.id === b.id ? styles.selected : ''}`}
                    onClick={() => setBarber(b)}
                  >
                    <div className={styles.barberAvatar}>{b.name[0]}</div>
                    <span className={styles.barberName}>{b.name}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Date */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.fieldLabel}>Select Date</legend>
              <div className={styles.dateGrid}>
                {DAYS.map(d => (
                  <button
                    key={d.value}
                    className={`${styles.dateCard} ${date === d.value ? styles.selected : ''}`}
                    onClick={() => setDate(d.value)}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Time slots (only shown when barber + date are chosen) */}
            {barber && date && (
              <fieldset className={styles.fieldset}>
                <legend className={styles.fieldLabel}>
                  Available Times
                  {slotsLoading && <span className={styles.loadingTag}> Loading…</span>}
                </legend>

                {!slotsLoading && slotsError && (
                  <p className={styles.errorMsg}>{slotsError}</p>
                )}
                {!slotsLoading && !slotsError && slots.length === 0 && (
                  <p className={styles.noSlots}>No slots available for this date. Try another day.</p>
                )}

                <div className={styles.timeGrid}>
                  {slots.map(t => (
                    <button
                      key={t}
                      className={`${styles.timeCard} ${slot === t ? styles.selected : ''}`}
                      onClick={() => setSlot(t)}
                    >
                      {fmt12h(t)}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className={styles.navRow}>
              <button className={styles.btnGhost} onClick={() => setStep(1)}>← Back</button>
              <button
                className={styles.btnPrimary}
                disabled={!barber || !date || !slot}
                onClick={() => setStep(3)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 3 — Customer details
        ════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className={styles.panel}>
            <span className={styles.eyebrow}>Step 3 of 4</span>
            <h1 className={styles.panelTitle}>Your Details</h1>
            <p className={styles.panelSub}>We'll use this to confirm your appointment.</p>

            <div className={styles.summaryBox}>
              <SummaryRow label="Service"  value={service?.name} />
              <SummaryRow label="Barber"   value={barber?.name} />
              <SummaryRow label="Date"     value={date} />
              <SummaryRow label="Time"     value={slot && fmt12h(slot)} />
              <SummaryRow label="Total"    value={`₱${service?.price}`} total />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="fn">Full Name</label>
              <input
                id="fn"
                type="text"
                className={styles.input}
                placeholder="Juan dela Cruz"
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="ph">Phone Number</label>
              <input
                id="ph"
                type="tel"
                className={styles.input}
                placeholder="09171234567"
                autoComplete="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            {bookingError && <p className={styles.errorMsg}>{bookingError}</p>}

            <div className={styles.navRow}>
              <button className={styles.btnGhost} onClick={() => setStep(2)}>← Back</button>
              <button
                className={styles.btnPrimary}
                disabled={!name.trim() || !phone.trim() || bookingBusy}
                onClick={reserveSlot}
              >
                {bookingBusy ? 'Reserving…' : 'Proceed to Payment →'}
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 4 — Payment
        ════════════════════════════════════════════════════ */}
        {step === 4 && (
          <div className={styles.panel}>
            <span className={styles.eyebrow}>Step 4 of 4</span>
            <h1 className={styles.panelTitle}>Payment</h1>
            <p className={styles.panelSub}>Enter your card to confirm and pay.</p>

            {/* Test card helper */}
            <div className={styles.testBox}>
              <p className={styles.testTitle}>Sandbox Mode — Use a test card</p>
              <div className={styles.testCards}>
                {TEST_CARDS.map(c => (
                  <button key={c.num} className={styles.testCard} onClick={() => fillTestCard(c)}>
                    <span className={styles.testLabel}>{c.label}</span>
                    <code className={styles.testNum}>{c.num.replace(/(.{4})/g, '$1 ').trim()}</code>
                    <span className={styles.testFill}>↓ Fill</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.summaryBox}>
              <SummaryRow label="Service" value={service?.name} />
              <SummaryRow label="Barber"  value={barber?.name} />
              <SummaryRow label="When"    value={`${date}  ${slot && fmt12h(slot)}`} />
              <SummaryRow label="Total"   value={`₱${service?.price}`} total />
            </div>

            {/* Card form */}
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor="cn">Card Number</label>
              <input
                id="cn"
                type="text"
                inputMode="numeric"
                className={styles.input}
                placeholder="4343 4343 4343 4345"
                maxLength={19}
                value={cardNum}
                onChange={e => setCardNum(fmtCard(e.target.value))}
              />
            </div>

            <div className={styles.row3}>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="em">Month (MM)</label>
                <input
                  id="em"
                  type="text"
                  inputMode="numeric"
                  className={styles.input}
                  placeholder="12"
                  maxLength={2}
                  value={expMonth}
                  onChange={e => setExpMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="ey">Year (YY)</label>
                <input
                  id="ey"
                  type="text"
                  inputMode="numeric"
                  className={styles.input}
                  placeholder="28"
                  maxLength={2}
                  value={expYear}
                  onChange={e => setExpYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.fieldLabel} htmlFor="cv">CVC</label>
                <input
                  id="cv"
                  type="text"
                  inputMode="numeric"
                  className={styles.input}
                  placeholder="123"
                  maxLength={4}
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                />
              </div>
            </div>

            {payError && <p className={styles.errorMsg}>{payError}</p>}

            {polling && (
              <p className={styles.waitMsg}>
                Waiting for 3DS verification in the popup window…
              </p>
            )}

            <div className={styles.navRow}>
              <button className={styles.btnGhost} onClick={() => setStep(3)} disabled={payBusy || polling}>
                ← Back
              </button>
              <button className={styles.btnPrimary} disabled={!canPay} onClick={pay}>
                {payBusy ? 'Processing…' : `Pay ₱${service?.price}`}
              </button>
            </div>

            <p className={styles.secureNote}>
              Secured by <strong>PayMongo</strong> · Sandbox / Test Mode
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════════════════
            STEP 5 — Confirmation
        ════════════════════════════════════════════════════ */}
        {step === 5 && (
          <div className={`${styles.panel} ${styles.confirmPanel}`}>
            <div className={styles.confirmIcon} aria-hidden="true">✓</div>
            <span className={styles.eyebrow}>Booking Confirmed</span>
            <h1 className={styles.panelTitle}>You&rsquo;re all set!</h1>
            <p className={styles.panelSub}>
              Payment received and your slot is reserved. See you soon.
            </p>

            <div className={styles.summaryBox}>
              <SummaryRow label="Booking ID" value={bookingId?.slice(0, 8).toUpperCase()} mono />
              <SummaryRow label="Service"    value={service?.name} />
              <SummaryRow label="Barber"     value={barber?.name} />
              <SummaryRow label="Date"       value={date} />
              <SummaryRow label="Time"       value={slot && fmt12h(slot)} />
              <SummaryRow label="Customer"   value={name} />
              <SummaryRow label="Amount Paid" value={`₱${service?.price}`} total />
            </div>

            <p className={styles.confirmNote}>
              A Google Calendar event has been added to your barber's schedule.<br />
              Walk in at: <strong>123 Rizal St., Poblacion, Manila</strong>
            </p>

            <div className={styles.confirmActions}>
              <Link to="/" className={styles.btnPrimary}>← Back to Home</Link>
              <button
                className={styles.btnGhost}
                onClick={() => {
                  setStep(1); setService(null); setBarber(null); setDate(null)
                  setSlot(null); setName(''); setPhone(''); setBookingId(null)
                  setCardNum(''); setExpMonth(''); setExpYear(''); setCvc('')
                  setIntentId(null)
                }}
              >
                Book Again
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

// Small presentational helper
function SummaryRow({ label, value, total, mono }) {
  return (
    <div className={`${styles.sRow} ${total ? styles.sTotal : ''}`}>
      <span className={styles.sLabel}>{label}</span>
      <strong className={`${styles.sValue} ${mono ? styles.sMono : ''}`}>{value}</strong>
    </div>
  )
}
