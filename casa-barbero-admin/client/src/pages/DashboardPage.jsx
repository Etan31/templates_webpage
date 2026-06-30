import "../assets/styles/dashboard.css";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { formatPeso } from "../../../shared/data/casaData.js";
import { Badge, PageHeader, PanelTitle, Pill } from "../components/ui/index.jsx";
import { lineData, lineOptions } from "../lib/charts.js";
import { navigate } from "../services/navigation.js";
import { toDisplayTime } from "../utils/formatters.js";

export default function Dashboard({ data, bookings }) {
  const sparkline = data?.sparkline || [
    { day: "Mon", date: "Jun 22", amount: 6200 },
    { day: "Tue", date: "Jun 23", amount: 8200 },
    { day: "Wed", date: "Jun 24", amount: 5200 },
    { day: "Thu", date: "Jun 25", amount: 10650 },
    { day: "Fri", date: "Jun 26", amount: 12400 },
    { day: "Sat", date: "Jun 27", amount: 15800 },
    { day: "Sun", date: "Jun 28", amount: 11800 }
  ];
  const kpis = data?.kpis || { todayBookings: 18, weekRevenue: 48650, pending: 5, cancellationsMtd: 7 };
  return (
    <section>
      <PageHeader title="Dashboard" meta="Saturday, June 27, 2026" />
      <div className="kpi-grid">
        <Kpi title="Today's Bookings" value={kpis.todayBookings} detail="across all barbers" trend="+12%" tone="up" />
        <Kpi title="This Week's Revenue" value={formatPeso(kpis.weekRevenue)} detail="vs ₱45,030 last week" trend="+8%" tone="up" />
        <Kpi title="Pending Confirmations" value={kpis.pending} detail="awaiting client response" trend="amber" dot />
        <Kpi title="Cancellations (MTD)" value={kpis.cancellationsMtd} detail="this month" trend="-3%" tone="down" />
      </div>
      <div className="dashboard-grid">
        <MiniCalendar bookings={bookings} />
        <UpcomingList bookings={bookings.slice(0, 6)} />
      </div>
      <section className="panel chart-panel">
        <PanelTitle title="Revenue · Last 7 Days" value={formatPeso(kpis.weekRevenue)} />
        <Line data={lineData(sparkline)} options={lineOptions} />
      </section>
    </section>
  );
}

function Kpi({ title, value, detail, trend, tone, dot }) {
  return (
    <article className="kpi-card">
      <p>{dot ? <span className="amber-dot" /> : null}{title}</p>
      <div>
        <strong>{value}</strong>
        {trend !== "amber" ? <span className={`trend ${tone}`}>{tone === "down" ? "↓" : "↑"} {trend.replace(/[+-]/, "")}</span> : null}
      </div>
      <small>{detail}</small>
    </article>
  );
}

function MiniCalendar({ bookings }) {
  const counts = useMemo(() => bookings.reduce((map, booking) => {
    const day = Number(booking.date.slice(-2));
    map[day] = (map[day] || 0) + 1;
    return map;
  }, {}), [bookings]);
  const days = Array.from({ length: 42 }, (_, index) => index < 30 ? index + 1 : index - 29);
  return (
    <section className="panel mini-calendar">
      <PanelTitle title="June 2026" value={<span className="legend-dot">has bookings</span>} />
      <div className="weekdays">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="month-dots">
        {days.map((day, index) => (
          <button className={`${day === 27 && index < 30 ? "today" : ""} ${index >= 30 ? "muted" : ""}`} key={`${day}-${index}`} type="button">
            <span>{day}</span>
            {counts[day] && index < 30 ? <i /> : null}
            {counts[day] && index < 30 ? <em>{counts[day]} bookings · MS RC</em> : null}
          </button>
        ))}
      </div>
      <button className="panel-link" type="button" onClick={() => navigate("/admin/schedule")}>View full calendar →</button>
    </section>
  );
}

function UpcomingList({ bookings }) {
  return (
    <section className="panel upcoming">
      <PanelTitle title="Upcoming Bookings" />
      {bookings.map((booking) => <BookingLine key={booking.id} booking={booking} />)}
      <button className="panel-link" type="button" onClick={() => navigate("/admin/bookings")}>View all bookings →</button>
    </section>
  );
}

function BookingLine({ booking }) {
  return (
    <article className="booking-line">
      <time>{toDisplayTime(booking.time)}</time>
      <div>
        <strong>{booking.client}</strong>
        <span>{booking.service}</span>
      </div>
      <Badge label={booking.barberInitials} style={{ "--badge": booking.barberColor }} />
      <Pill value={booking.status} />
    </article>
  );
}
