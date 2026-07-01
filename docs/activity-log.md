# Activity Log

## 2026-07-01 — Deployment prep: Google Calendar token moved off local disk

Summary: Planned AWS deployment (Amplify for both frontends, App Runner for both Express backends, subdomains of tristanehron.xyz via GoDaddy DNS). Found that `casa-barbero/backend/google-calendar.js` stored the Google OAuth token in a local `token.json` file and read credentials from a local `client_secret.json` — both gitignored, never committed, and would not survive App Runner's ephemeral filesystem (wiped on every redeploy).

**Decision:** Keep both Express backends as-is (no rewrite to Supabase Edge Functions) and deploy on AWS App Runner; fix the token persistence to use Supabase instead.

**SQL migration 006 applied:** New `google_oauth_tokens` table (single row, id='default'), RLS enabled with no policies — only the service-role key can read/write it.

**Backend code changes:**
- `google-calendar.js` — replaced `readFileSync`/`writeFileSync` token I/O with a dedicated service-role Supabase client reading/writing `google_oauth_tokens`; OAuth client id/secret/redirect now come from `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` env vars instead of `client_secret.json`
- `server.js` — updated stale comment referencing hardcoded `localhost:3001` redirect

**New required env vars for `casa-barbero/backend`:** `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

**Next:** Manual AWS console setup (Amplify x2, App Runner x2) and GoDaddy DNS records — see plan for full steps. Must re-run the Google OAuth consent flow once against production after deploy (old local token doesn't transfer).

## 2026-07-01 — Phase 6: Cleanup migration (bookings schema finalized)

Summary: Dropped all transitional/legacy columns from `bookings`, renamed `*_new` UUID FK columns to canonical names.

**SQL migration 005 applied:**
- DROP old text columns: `service_id`, `barber_id` (were text slugs)
- RENAME `service_id_new` → `service_id`, `barber_id_new` → `barber_id`
- DROP legacy text columns: `customer_name`, `phone`, `service_name`, `barber_name`, `date`, `time_slot`, `status`

**Final `bookings` columns:** `id`, `booked_at`, `service_id` (uuid FK), `barber_id` (uuid FK), `duration_min`, `amount`, `booking_status`, `payment_status`, `payment_method`, `client_name`, `client_phone`, `client_email`, `notes`, `google_event_id`, `created_at`

**Backend code changes (removed all old column references):**
- `bookings.js` — removed dual-write; conflict check uses `booked_at` range + `barber_id` UUID; INSERT writes clean schema only; SELECT includes service/barber join for calendar
- `slots.js` — removed dual-mode query; now single `barber_id` (UUID) query only; returns empty for non-UUID barbers
- `payments.js` — removed `status: 'paid'` from confirmBooking; booking fetch includes service join; dedup checks use only `payment_status`; calendar sync log uses new columns
- `google-calendar.js` — removed legacy fallbacks; uses `booking.service?.name`, `booking.barber?.name`, `booking.client_name`, `booking.booked_at` only
- `bookings.routes.js` (admin) — updated BOOKING_SELECT and transformBooking; POST INSERT uses `service_id`/`barber_id`
- `payments.routes.js` (admin) — updated nested select; removed `customer_name`/`service_name`/`barber_name` fallbacks
- `dashboardService.js` — updated upcoming bookings select and map transform

**Next: End-to-end testing**

## 2026-06-30 — Client Frontend Phase 5: Live barbers in AppointmentPage

Summary: AppointmentPage now fetches real barbers from the DB instead of hardcoded "john"/"patrick".

**Files changed:**
- `casa-barbero/backend/routes/catalog.js` (new) — public GET /api/catalog returning active barbers and services; no auth required; uses anon key / RLS public-read policies
- `casa-barbero/backend/server.js` — registered /api/catalog route
- `casa-barbero/src/pages/AppointmentPage.jsx` — removed BARBERS constant; fetches catalog on mount; allBarbers = [ANY_BARBER, ...catalog.barbers]; slot queries use real UUIDs; booking POST sends real barber name/id so barber_id_new FK now resolves correctly; slot fetch for "any" mode guards against empty catalog (waits until barbers load)

**Data flow change:**
- Before: barber_id sent as "john"/"patrick" (non-existent slugs) → barber_id_new = null
- After: barber_id sent as UUID → barber_id_new = correct FK reference

**Pending (Phase 6):**
- Cleanup migration (005) — drop old transitional columns, rename *_new columns
- BookingPage services still hardcoded (different from DB services) — a future content alignment task

## 2026-06-30 — Admin Frontend Phase 4: Remove casaData mock imports

Summary: All admin frontend pages now consume live API data. Zero casaData.js imports remain.

**Files changed:**
- `utils/formatters.js` — added `formatPeso` (moved from casaData)
- `lib/charts.js` — removed casaData; hardcoded GOLD color token; `barData()` now accepts barbers as 3rd param
- `app/AdminApp.jsx` — removed all casaData seed state; added `catalog`, `dailyRevenue`, `settings`, `sync` states; loads all 6 endpoints on mount; passes `user` from session to Sidebar, SettingsPage, SyncPage
- `pages/DashboardPage.jsx` — import only change
- `pages/BookingsPage.jsx` — added `barbers` prop for filter dropdown; cancel/confirm now call PATCH API before updating local state
- `pages/BarbersPage.jsx` — accepts `catalog` prop; WorkingHours/BlockedTime/ServiceGrid receive data as props; blocked times filtered by selected barber
- `pages/PaymentsPage.jsx` — KPIs computed from live transactions; chart uses `dailyRevenue` prop with ISO→readable date format; TopServices computed from transaction data
- `pages/SchedulePage.jsx` — BlockModal and ManualBookingPanel receive barbers/services props; ManualBookingPanel API payload now matches backend field names (clientName, bookedAt, durationMin, amount)
- `pages/SettingsPage.jsx` — displays `settings.shopProfile` and `user` from session; form key resets on load
- `pages/SyncPage.jsx` — displays `sync.log`, `sync.account`, formatted lastSynced timestamp
- `pages/LoginPage.jsx` — removed owner.email pre-fill
- `components/layout/Sidebar.jsx` — displays user name/role/initials from `user` prop

**Pending (Phase 5+):**
- Client frontend (AppointmentPage.jsx) — fetch barbers/services from live catalog API
- Add Barber modal not yet wired to POST /api/admin/barbers
- Cleanup migration (005) — drop old transitional columns

## 2026-06-30 — Full-Stack Schema Migration (Supabase)

Summary: Designed and applied complete production database schema for Casa Barbero.

**Schema applied (16 tables total):**
- New: `tag_colors`, `services`, `barbers`, `barber_services`, `barber_working_hours`,
  `blocked_dates`, `booking_statuses`, `payment_statuses`, `payment_method_types`,
  `transactions`, `shop_profile`, `notification_settings`, `admin_users`, `calendar_sync_log`
- Altered: `bookings` (added new columns, kept old ones during transition),
  `payment_logs` (added payment_method column)

**Key design decisions:**
- `bookings.status` (single field) → `booking_status` + `payment_status` (two separate FK columns)
- `date` + `time_slot` (text) → `booked_at` (timestamptz, Asia/Manila)
- `service_id`/`barber_id` text slugs → `service_id_new`/`barber_id_new` UUID FKs (old columns kept)
- Admin backend will use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
- Client frontend uses SUPABASE_ANON_KEY (public read only for catalog tables)

**Seeded:** 4 barbers, 6 services, 17 barber-service assignments, 28 working-hour rows,
all lookup values, shop_profile, notification_settings.

**Migration files:** `supabase/migrations/001–004`
**Plan doc:** `docs/fullstack-migration-plan.md`

**Next steps (not yet done):**
1. ~~Admin backend~~ DONE (see 2026-06-30 Phase 2 entry)
2. Client backend — update routes to write to new columns (booked_at, client_name, etc.)
3. Admin frontend — remove mock data imports, consume live API
4. Cleanup migration (005) — drop old transitional columns once backend is updated

## 2026-06-30 — Admin Backend Phase 2: Replace mock store with Supabase

Summary: All admin backend routes now hit Supabase instead of in-memory mock data.

**Auth change:** Replaced hardcoded session auth (sessionService.js) with Supabase Auth.
- Login uses raw fetch to Supabase Auth REST API (avoids service role client session contamination)
- requireAdmin middleware validates Bearer JWT via supabase.auth.getUser(token) then checks admin_users table
- Admin user created via `backend/scripts/create-admin.js` (one-time, run already)
- sessionService.js deleted

**Routes rewritten (all now async Supabase queries):**
- barbers.routes.js — barbers + tag_colors + barber_services + barber_working_hours
- bookings.routes.js — bookings JOIN services/barbers; transformBooking() normalizes shape for frontend
- payments.routes.js — transactions table + 30-day daily revenue aggregation
- availability.routes.js — blocked_dates + barber_working_hours; new DELETE and PATCH endpoints added
- dashboard.routes.js + dashboardService.js — real KPIs from Supabase count/aggregate queries
- system.routes.js — shop_profile, notification_settings, calendar_sync_log

**RLS fix:** Added admin_users_read_own policy (auth.uid() = id) to allow authenticated admin user
to read their own record after login. Service role client session contamination was the root cause.

**Verified:** All endpoints return live Supabase data. Dashboard: pending=4, barbers=4, bookings=9.

## 2026-06-30 — Casa Barbero: counter payment, concierge banner, staff login

Summary: Customer-site changes in `casa-barbero/` per request.

- Appointment page (`/appointment`): added a "Pay at the Counter" button on the
  Details step alongside the existing "Pay Online Now" (PayMongo) flow. Counter
  bookings reserve the slot and jump straight to the confirmation step with
  pay-at-counter messaging; online flow is unchanged.
- Backend (`backend/routes/bookings.js`): bookings POST now accepts an optional
  `payment_method`. When `counter`, the Google Calendar event is created at
  reservation time (online bookings still get theirs on payment confirmation).
  Counter bookings stay `status: pending` (reserved, unpaid).
- Concierge banner: new reusable `components/ConciergeBanner.jsx` ("Prefer to book
  by phone? Call our concierge at +63 917 123 4567"). Shown on the home page
  (below the hero), the booking page, and the appointment page.
- Staff login: new `Login` link pointing to the admin app's `/admin/login`. Added
  to the home nav (desktop + mobile drawer) and the booking/appointment headers.
  Target is configurable via `VITE_ADMIN_URL` (default
  `http://localhost:5174/admin/login`); centralized in new `src/config.js`.
- Ports made deterministic to fix a collision (both apps defaulted to 5173, so the
  login link resolved to the customer app and React Router threw "No routes matched
  /admin/login"): customer site locked to 5173, admin client moved to 5174, both
  with `strictPort`. Admin backend CORS already reflects any origin.

Decisions:
- User chose to keep online payment AND add counter payment (not replace), and to
  surface the banner + login across the whole site.
- Pre-existing ESLint errors in `AppointmentPage.jsx` (setState-in-effect, empty
  catch blocks, conditional useCallback) were left as-is — out of scope.
