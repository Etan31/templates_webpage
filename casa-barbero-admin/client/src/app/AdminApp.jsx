import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { barbers as seedBarbers, bookings as seedBookings, transactions as seedTransactions } from "../../../shared/data/casaData.js";
import Sidebar from "../components/layout/Sidebar.jsx";
import { api } from "../services/api.js";
import BarbersPage from "../pages/BarbersPage.jsx";
import BookingsPage from "../pages/BookingsPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import PaymentsPage from "../pages/PaymentsPage.jsx";
import SchedulePage from "../pages/SchedulePage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import SyncPage from "../pages/SyncPage.jsx";

export default function AdminApp({ path, onLogout }) {
  const [drawer, setDrawer] = useState(false);
  const [bookings, setBookings] = useState(seedBookings);
  const [dashboard, setDashboard] = useState(null);
  const [barbers, setBarbers] = useState(seedBarbers);
  const [payments, setPayments] = useState(seedTransactions);

  useEffect(() => {
    Promise.allSettled([
      api("/api/admin/bookings"),
      api("/api/admin/dashboard"),
      api("/api/admin/barbers"),
      api("/api/admin/payments")
    ]).then(([bookingRes, dashRes, barberRes, paymentRes]) => {
      if (bookingRes.status === "fulfilled") setBookings(bookingRes.value.bookings);
      if (dashRes.status === "fulfilled") setDashboard(dashRes.value);
      if (barberRes.status === "fulfilled") setBarbers(barberRes.value.barbers);
      if (paymentRes.status === "fulfilled") setPayments(paymentRes.value.transactions);
    });
  }, []);

  const page = path.split("/").pop();
  return (
    <div className="admin-shell">
      <button className="hamburger" type="button" onClick={() => setDrawer(true)} aria-label="Open navigation"><Menu size={20} /></button>
      <Sidebar path={path} onLogout={onLogout} drawer={drawer} onClose={() => setDrawer(false)} />
      <main className="main-area">
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            {page === "dashboard" && <DashboardPage data={dashboard} bookings={bookings} />}
            {page === "schedule" && <SchedulePage bookings={bookings} barbers={barbers} setBookings={setBookings} />}
            {page === "bookings" && <BookingsPage bookings={bookings} setBookings={setBookings} />}
            {page === "barbers" && <BarbersPage barbers={barbers} setBarbers={setBarbers} />}
            {page === "payments" && <PaymentsPage transactions={payments} />}
            {page === "sync" && <SyncPage />}
            {page === "settings" && <SettingsPage onLogout={onLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
