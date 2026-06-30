# Activity Log

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
1. Admin backend — replace `store.js` in-memory with Supabase queries + Supabase Auth
2. Client backend — update routes to write to new columns (booked_at, client_name, etc.)
3. Admin frontend — remove mock data imports, consume live API
4. Cleanup migration (005) — drop old transitional columns once backend is updated

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
