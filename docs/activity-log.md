# Activity Log

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
