import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import Sidebar from "../components/layout/Sidebar.jsx";
import { api } from "../services/api.js";
import { sessionStorage } from "../services/sessionStorage.js";
import BarbersPage from "../pages/BarbersPage.jsx";
import BookingsPage from "../pages/BookingsPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import PaymentsPage from "../pages/PaymentsPage.jsx";
import SchedulePage from "../pages/SchedulePage.jsx";
import SettingsPage from "../pages/SettingsPage.jsx";
import SyncPage from "../pages/SyncPage.jsx";

export default function AdminApp({ path, onLogout }) {
  const [drawer, setDrawer] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [barbers, setBarbers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dailyRevenue, setDailyRevenue] = useState([]);
  const [catalog, setCatalog] = useState({ services: [], workingHours: [], blockedTimes: [] });
  const [settings, setSettings] = useState(null);
  const [sync, setSync] = useState(null);
  const user = sessionStorage.get()?.user ?? null;

  useEffect(() => {
    Promise.allSettled([
      api("/api/admin/bookings"),
      api("/api/admin/dashboard"),
      api("/api/admin/barbers"),
      api("/api/admin/payments"),
      api("/api/admin/settings"),
      api("/api/admin/sync")
    ]).then(([bookingRes, dashRes, barberRes, paymentRes, settingsRes, syncRes]) => {
      if (bookingRes.status === "fulfilled") setBookings(bookingRes.value.bookings);
      if (dashRes.status === "fulfilled") setDashboard(dashRes.value);
      if (barberRes.status === "fulfilled") {
        const { barbers: b, workingHours, services, blockedTimes } = barberRes.value;
        setBarbers(b);
        setCatalog({ services, workingHours, blockedTimes });
      }
      if (paymentRes.status === "fulfilled") {
        setPayments(paymentRes.value.transactions);
        setDailyRevenue(paymentRes.value.dailyRevenue);
      }
      if (settingsRes.status === "fulfilled") setSettings(settingsRes.value);
      if (syncRes.status === "fulfilled") setSync(syncRes.value);
    });
  }, []);

  const page = path.split("/").pop();
  return (
    <div className="admin-shell">
      <button className="hamburger" type="button" onClick={() => setDrawer(true)} aria-label="Open navigation"><Menu size={20} /></button>
      <Sidebar path={path} onLogout={onLogout} drawer={drawer} onClose={() => setDrawer(false)} user={user} />
      <main className="main-area">
        <AnimatePresence mode="wait">
          <motion.div key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
            {page === "dashboard" && <DashboardPage data={dashboard} bookings={bookings} />}
            {page === "schedule" && <SchedulePage bookings={bookings} barbers={barbers} catalog={catalog} setBookings={setBookings} />}
            {page === "bookings" && <BookingsPage bookings={bookings} barbers={barbers} setBookings={setBookings} />}
            {page === "barbers" && <BarbersPage barbers={barbers} catalog={catalog} setBarbers={setBarbers} />}
            {page === "payments" && <PaymentsPage transactions={payments} dailyRevenue={dailyRevenue} barbers={barbers} />}
            {page === "sync" && <SyncPage sync={sync} user={user} />}
            {page === "settings" && <SettingsPage settings={settings} user={user} onLogout={onLogout} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
