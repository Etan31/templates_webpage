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

**Next steps:**
1. Admin backend — replace mock store with Supabase queries
2. Client backend — update routes to write to new columns (booked_at, client_name, etc.)
3. Admin frontend — remove mock data imports, consume live API
4. Cleanup migration — drop old transitional columns once backend is updated

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

**Pending:**
- Client frontend (AppointmentPage.jsx) — fetch barbers/services from live catalog API
- Add Barber modal not yet wired to POST /api/admin/barbers
- Cleanup migration — drop old transitional columns

## 2026-06-30 — Client Frontend Phase 5: Live barbers in AppointmentPage

Summary: AppointmentPage now fetches real barbers from the DB instead of hardcoded "john"/"patrick".

**Files changed:**
- `casa-barbero/backend/routes/catalog.js` (new) — public GET /api/catalog returning active barbers and services; no auth required; uses anon key / RLS public-read policies
- `casa-barbero/backend/server.js` — registered /api/catalog route
- `casa-barbero/src/pages/AppointmentPage.jsx` — removed BARBERS constant; fetches catalog on mount; allBarbers = [ANY_BARBER, ...catalog.barbers]; slot queries use real UUIDs; booking POST sends real barber name/id so barber_id_new FK now resolves correctly; slot fetch for "any" mode guards against empty catalog (waits until barbers load)

**Data flow change:**
- Before: barber_id sent as "john"/"patrick" (non-existent slugs) → barber_id_new = null
- After: barber_id sent as UUID → barber_id_new = correct FK reference

**Pending:**
- Cleanup migration — drop old transitional columns, rename *_new columns
- BookingPage services still hardcoded (different from DB services) — a future content alignment task

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

**Next:** End-to-end testing

## 2026-07-01 — Deployment prep: Google Calendar token moved off local disk

Summary: Planned AWS deployment (Amplify for both frontends, App Runner for both Express backends, subdomains of tristanehron.xyz via GoDaddy DNS). Found that `casa-barbero/backend/google-calendar.js` stored the Google OAuth token in a local `token.json` file and read credentials from a local `client_secret.json` — both gitignored, never committed, and would not survive App Runner's ephemeral filesystem (wiped on every redeploy).

**Decision:** Keep both Express backends as-is (no rewrite to Supabase Edge Functions) and deploy on AWS App Runner; fix the token persistence to use Supabase instead.

**SQL migration 006 applied:** New `google_oauth_tokens` table (single row, id='default'), RLS enabled with no policies — only the service-role key can read/write it.

**Backend code changes:**
- `google-calendar.js` — replaced `readFileSync`/`writeFileSync` token I/O with a dedicated service-role Supabase client reading/writing `google_oauth_tokens`; OAuth client id/secret/redirect now come from `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` env vars instead of `client_secret.json`
- `server.js` — updated stale comment referencing hardcoded `localhost:3001` redirect

**New required env vars for `casa-barbero/backend`:** `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`

**Next:** Manual AWS console setup (Amplify x2, App Runner x2) and GoDaddy DNS records — see plan for full steps. Must re-run the Google OAuth consent flow once against production after deploy (old local token doesn't transfer).

## 2026-07-02 — Phase 1 complete: Amplify frontends live on custom domains

Summary: Both React frontends deployed to AWS Amplify and live on tristanehron.xyz subdomains with auto HTTPS.

**Amplify setup:**
- Customer app (`casa-barbero`): Deployed to `https://barbero.tristanehron.xyz/` — booking page fully functional
- Admin app (`casa-barbero-admin`): Deployed to `https://barbero-admin.tristanehron.xyz/admin/login` — admin dashboard ready

**DNS configuration:**
- GoDaddy DNS: Added CNAME records for `barbero` and `barbero-admin` subdomains pointing to Amplify
- SSL/TLS: Auto-issued by AWS ACM (Amplify managed)
- Propagation: Complete, both domains resolve and load with green SSL checkmarks

**Environment variables (build-time):**
- Customer: `VITE_API_URL`, `VITE_ADMIN_URL` → currently point to localhost; will update to Fly.io URLs post-deployment
- Admin: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` → configured, Supabase auth working

**Docker & Fly.io prep (code-ready, deployment pending):**
- Created Dockerfiles + .dockerignore for both backends
- Created fly.toml config for both (Singapore region, auto HTTPS)
- Pushed to main, awaiting Fly.io account card verification (~$7 hold) before deployment

**Next:** Deploy backends to Fly.io (waiting on card verification), then update env vars to point frontends to production API URLs.

## 2026-07-02 — Fly.io backends deployed to production (SIN region)

Summary: Both Express backends (casa-barbero-api, casa-barbero-admin-api) now live on Fly.io with Supabase realtime.

**Deployment:**
- Fly.io regions: Singapore (SIN) for both backends with auto HTTPS
- Secrets set via flyctl: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, etc.
- Root cause of prior admin login failures: Amplify apps were building stale `casa-barbero-admin`/`casa-barbero-client` branches, not main — branches synced, apps reconnected to main

**Backend updates:**
- Added `ws` package to both backends for Node 18 + Supabase realtime
- Google Calendar OAuth re-authorized against fly.dev redirect URI
- Admin credentials reset (demo@example.com)

**Next:** Smoke-test all admin actions in production, end-to-end booking test. Note: casa-barbero-admin-api needs redeploy via flyctl after schema/route changes from earlier date entries.

## 2026-07-03 — Admin made fully dynamic against Supabase + polish/perf pass

Summary: Audited the admin app and found backend routes were already Supabase-backed but most client pages mutated local state only. Wired everything end-to-end, plus performance and UX work on both apps.

**Decisions:**
- Services model: card toggle on Barbers page = "offered by this barber" (per-barber assignment via barber_services); global pricing/retire edits live in the Edit form. New barbers get all active services by default; new services auto-assign to the barber they were added under.
- Shop-wide `workingHours` kept in GET /barbers response as fallback, but each barber now carries own `hours` (barber_working_hours is per-barber in schema).
- Booking cancel note saved to bookings.notes (no messaging integration yet).
- Deleted dead code: backend `data/store.js` mock, client `lib/supabase.js` (admin client talks only to the backend API).

**Found bugs fixed:**
- Block modal sent `{allDay,start,end}` but backend expects `{isAllDay,startTime,endTime}` — all blocks silently became all-day.
- Schedule calendar was hardcoded to June 2026 (static weekday math, dead nav buttons).
- Admin had no favicon (the recurring /favicon.ico 404); customer favicon was an off-brand purple template leftover.

**Next:** Smoke-test all admin actions in production, end-to-end booking test.

## 2026-07-03 — Customer mobile navigation, favicon, and barber picker

Summary: Fixed customer-facing responsive navigation and appointment layout issues.

- Registered the existing Casa Barbero SVG favicon explicitly for standard and shortcut icon handling in both customer and admin HTML entry points.
- Grouped the mobile drawer and backdrop into one controlled stacking context so the backdrop cannot cover drawer links; hidden drawers no longer accept pointer input, and menu controls now meet the 44px touch-target minimum.
- Changed the appointment barber picker from a fixed flex row to an auto-fitting grid so any number of dynamic barbers wraps within the panel on desktop and mobile.
- Added explicit button types and selected-state semantics to barber options.

## 2026-07-03 — Admin mobile sidebar layering and z-index polish

Summary: Fixed the admin mobile navigation overlay blocking sidebar tabs and improved stacking contexts across both apps.

- Raised the mobile sidebar above the `mobile-scrim` layer while keeping the scrim above page content for click-outside dismissal.
- Increased admin sidebar z-index to prevent stacking context conflicts with other overlays.
- Applied consistent z-index layering strategy across both customer and admin frontends.

## 2026-07-04 — Admin app full responsive overhaul (orchestrated, 7 workstreams)

Summary: Made the entire admin app responsive from 360px phones to 1920px+ monitors via parallel subagent workstreams with strict file ownership. Layout/spacing/touch pass only; brand (gold, Playfair/Inter, dark palette) untouched.

**Decisions:**
- Breakpoint ladder kept max-width idiom: 479 (new) / 767 / 1023 (new) / 1279, plus min-width 1600 large-monitor containment and pointer:coarse touch queries.
- Fluid type/spacing tokens added to global.css (clamp-based: --fs-page-title, --fs-kpi, --pad-card, --gap-grid, etc.); only responsive-relevant roles tokenized, body stays 14px.
- Mobile tables stay stacked-cards via td data-label; mobile month calendar keeps 7 columns with barber-colored dots (tap opens day view) instead of collapsing to a 1-col list.

**Bugs found and fixed along the way:**
- Payments `.compact { min-width: 900px }` beat the mobile stacked-card reset (lazy chunk load order) AND leaked onto BarbersPage `.toggle-row.compact` — now scoped under `.page-payments` and min-width 768.
- Payments transaction table had zero data-label attrs — mobile cards showed unlabeled values.
- Week view hardcoded 4 barber columns while barbers are dynamic — now `repeat(var(--cols))` from barbers.length.
- Dual `.badge` (layout.css vs ui.css) and dual `.filter-bar` (bookings.css vs ui.css) definitions consolidated into ui.css.
- Stale `.hours-row button` rules targeted elements removed in the time-input refactor; time inputs were unlabeled on mobile — new labeled `.hours-field` pattern.
- Form controls under 16px triggered iOS auto-zoom on focus — 16px at <=767.
- Modal overlays clipped tall forms on short phones — overflow-y auto + align-items start.

**Verified:** production build passes (vite build client, 2089 modules); selector-level diff review of all 17 changed files. Note: ui-ux-pro-max skill install was blocked by sandbox (external npm exec); its published guidelines were fetched read-only and applied instead.
