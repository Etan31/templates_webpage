import { google } from 'googleapis'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname   = path.dirname(fileURLToPath(import.meta.url))
const TOKEN_PATH  = path.join(__dirname, 'token.json')
const CREDS_PATH  = path.join(__dirname, '../client_secret.json')
const REDIRECT    = 'http://localhost:3001/api/auth/google/callback'
const SCOPES      = ['https://www.googleapis.com/auth/calendar']

function buildClient() {
  const { web } = JSON.parse(readFileSync(CREDS_PATH, 'utf8'))
  return new google.auth.OAuth2(web.client_id, web.client_secret, REDIRECT)
}

// Returns the URL the user must visit to authorize access
export function getAuthUrl() {
  return buildClient().generateAuthUrl({
    access_type: 'offline',
    scope:       SCOPES,
    prompt:      'consent',
  })
}

// Called by the OAuth callback route — exchanges code for tokens and saves them
export async function handleCallback(code) {
  const client = buildClient()
  const { tokens } = await client.getToken(code)
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2))
  return tokens
}

async function getAuthorizedClient() {
  if (!existsSync(TOKEN_PATH)) return null
  const client = buildClient()
  const saved  = JSON.parse(readFileSync(TOKEN_PATH, 'utf8'))
  client.setCredentials(saved)
  // Persist refreshed tokens automatically
  client.on('tokens', (fresh) => {
    const merged = { ...JSON.parse(readFileSync(TOKEN_PATH, 'utf8')), ...fresh }
    writeFileSync(TOKEN_PATH, JSON.stringify(merged, null, 2))
  })
  return client
}

export async function createCalendarEvent(booking) {
  const auth = await getAuthorizedClient()
  if (!auth) {
    console.warn('[Google Calendar] token.json not found — skipping calendar event.')
    console.warn('[Google Calendar] Visit http://localhost:3001/api/auth/google to set up.')
    return null
  }

  const calendar   = google.calendar({ version: 'v3', auth })
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary'

  const clientName  = booking.client_name   || 'Unknown'
  const clientPhone = booking.client_phone  || ''
  const svcName     = booking.service?.name || 'Service'
  const barberName  = booking.barber?.name  || 'Staff'

  const start = new Date(booking.booked_at)
  const end   = new Date(start.getTime() + booking.duration_min * 60_000)

  const event = {
    summary:     `${svcName} — ${clientName}`,
    description: [
      `Service : ${svcName}`,
      `Barber  : ${barberName}`,
      `Customer: ${clientName}`,
      `Phone   : ${clientPhone}`,
      `Amount  : ₱${booking.amount}`,
      `Booking : ${booking.id}`,
    ].join('\n'),
    start: { dateTime: start.toISOString(), timeZone: 'Asia/Manila' },
    end:   { dateTime: end.toISOString(),   timeZone: 'Asia/Manila' },
    colorId: '6', // tangerine — matches the barbershop accent
  }

  try {
    const response = await calendar.events.insert({ calendarId, resource: event })
    console.log(`[Google Calendar] Event created: ${response.data.id}`)
    return response.data.id
  } catch (err) {
    console.error('[Google Calendar] Failed to create event:', err.message)
    return null
  }
}
