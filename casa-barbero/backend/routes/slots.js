import { Router } from 'express'
import supabase from '../database.js'

const router = Router()

function timeToMin(t) {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function minToTime(total) {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

// Build every possible start time for a given service duration.
// Schedule: 9 AM – 7 PM with lunch off 1 PM – 2 PM.
function generateAllSlots(durationMin) {
  const OPEN       = 9  * 60  // 09:00
  const CLOSE      = 19 * 60  // 19:00
  const LUNCH_S    = 13 * 60  // 13:00
  const LUNCH_E    = 14 * 60  // 14:00

  const slots = []
  for (let t = OPEN; t + durationMin <= CLOSE; t += durationMin) {
    const end = t + durationMin
    // Skip if this slot overlaps the lunch break at all
    if (t < LUNCH_E && end > LUNCH_S) continue
    slots.push(minToTime(t))
  }
  return slots
}

// GET /api/available-slots?barber=john&date=2026-06-26&duration=30
router.get('/', async (req, res) => {
  const { barber, date, duration } = req.query

  if (!barber || !date || !duration) {
    return res.status(400).json({ error: 'barber, date, and duration query params are required' })
  }

  const durationMin = parseInt(duration, 10)
  if (![20, 30, 45].includes(durationMin)) {
    return res.status(400).json({ error: 'duration must be 20, 30, or 45' })
  }

  // Fetch the barber's existing (non-cancelled) bookings on this date
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('time_slot, duration_min')
    .eq('barber_id', barber)
    .eq('date', date)
    .neq('status', 'cancelled')

  if (error) return res.status(500).json({ error: error.message })

  const allSlots = generateAllSlots(durationMin)

  // Remove slots that conflict with an existing booking
  const available = allSlots.filter(slot => {
    const newStart = timeToMin(slot)
    const newEnd   = newStart + durationMin

    return !bookings.some(b => {
      const bStart = timeToMin(b.time_slot)
      const bEnd   = bStart + b.duration_min
      return newStart < bEnd && newEnd > bStart
    })
  })

  res.json({ slots: available, date, barber, duration: durationMin })
})

export default router
