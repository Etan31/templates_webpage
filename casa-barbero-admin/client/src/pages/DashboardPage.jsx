import "../assets/styles/dashboard.css";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { CalendarClock } from "lucide-react";
import { formatPeso, relativeDay, toDisplayTime } from "../utils/formatters.js";
import { Badge, PageHeader, PanelTitle, Payment, Pill } from "../components/ui/index.jsx";
import { lineData, lineOptions } from "../lib/charts.js";
import { navigate } from "../services/navigation.js";

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
  const todayLabel = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  // Real upcoming list: future, non-cancelled, chronological. Falls back to server data when bookings unloaded.
  const upcoming = useMemo(() => {
    const nowMs = Date.now();
    const derived = (bookings || [])
      .filter((b) => b.status !== "cancelled" && b.date && b.time && new Date(`${b.date}T${b.time}`).getTime() >= nowMs)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    const list = derived.length ? derived : (data?.upcoming || []);
    return list.slice(0, 6);
  }, [bookings, data]);

  return (
    <section>
      <PageHeader title="Dashboard" meta={todayLabel} />
      <div className="kpi-grid">
        <Kpi title="Today's Bookings" value={kpis.todayBookings} detail="across all barbers" trend="+12%" tone="up" />
        <Kpi title="This Week's Revenue" value={formatPeso(kpis.weekRevenue)} detail="vs ₱45,030 last week" trend="+8%" tone="up" />
        <Kpi title="Pending Confirmations" value={kpis.pending} detail="awaiting client response" trend="amber" dot />
        <Kpi title="Cancellations (MTD)" value={kpis.cancellationsMtd} detail="this month" trend="-3%" tone="down" />
      </div>
      <div className="dashboard-grid">
        <MiniCalendar bookings={bookings} />
        <UpcomingList items={upcoming} />
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
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const todayDate = now.getDate();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Non-cancelled booking counts keyed by day-of-month, for the current month only.
  const counts = useMemo(() => {
    const prefix = `${year}-${String(month + 1).padStart(2, "0")}-`;
    return (bookings || []).reduce((map, b) => {
      if (b.status !== "cancelled" && typeof b.date === "string" && b.date.startsWith(prefix)) {
        const day = Number(b.date.slice(8, 10));
        map[day] = (map[day] || 0) + 1;
      }
      return map;
    }, {});
  }, [bookings, year, month]);

  // 6-week grid aligned Monday-first, with muted spillover days from adjacent months.
  const cells = useMemo(() => {
    const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    return Array.from({ length: 42 }, (_, index) => {
      const dayNum = index - firstDow + 1;
      const inMonth = dayNum >= 1 && dayNum <= daysInMonth;
      const label = dayNum < 1 ? daysInPrev + dayNum : dayNum > daysInMonth ? dayNum - daysInMonth : dayNum;
      return { dayNum, label, inMonth };
    });
  }, [year, month]);

  return (
    <section className="panel mini-calendar">
      <PanelTitle title={monthLabel} value={<span className="legend-dot">has bookings</span>} />
      <div className="weekdays">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="month-dots">
        {cells.map((cell, index) => {
          const count = cell.inMonth ? counts[cell.dayNum] : 0;
          const isToday = cell.inMonth && cell.dayNum === todayDate;
          return (
            <button className={`${isToday ? "today" : ""} ${cell.inMonth ? "" : "muted"}`} key={index} type="button">
              <span>{cell.label}</span>
              {count ? <i /> : null}
              {count ? <em>{count} booking{count > 1 ? "s" : ""}</em> : null}
            </button>
          );
        })}
      </div>
      <button className="panel-link" type="button" onClick={() => navigate("/admin/schedule")}>View full calendar →</button>
    </section>
  );
}

function UpcomingList({ items }) {
  const expected = useMemo(() => items.reduce((sum, b) => sum + (b.price || 0), 0), [items]);
  const groups = useMemo(() => {
    const map = new Map();
    for (const b of items) {
      if (!map.has(b.date)) map.set(b.date, []);
      map.get(b.date).push(b);
    }
    return [...map.entries()].map(([date, list]) => ({ date, list }));
  }, [items]);

  return (
    <section className="panel upcoming">
      <PanelTitle title="Upcoming Bookings" value={items.length ? `${items.length} · ${formatPeso(expected)}` : null} />
      {items.length ? (
        <div className="upcoming-list">
          {groups.map((group) => (
            <div className="day-group" key={group.date}>
              <div className="day-label"><span>{relativeDay(group.date)}</span><i>{group.list.length}</i></div>
              {group.list.map((booking) => <BookingLine key={booking.id} booking={booking} />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="upcoming-empty">
          <CalendarClock size={34} strokeWidth={1.5} />
          <p>No upcoming bookings</p>
          <span>New appointments will appear here.</span>
        </div>
      )}
      <button className="panel-link" type="button" onClick={() => navigate("/admin/bookings")}>View all bookings →</button>
    </section>
  );
}

function BookingLine({ booking }) {
  return (
    <article className="booking-line">
      <div className="bl-time">
        <time>{toDisplayTime(booking.time)}</time>
        {booking.duration ? <span>{booking.duration} min</span> : null}
      </div>
      <div className="bl-main">
        <strong>{booking.client}</strong>
        <div className="bl-sub">
          <span className="bl-service">{booking.service}</span>
          {booking.barberInitials ? <Badge label={booking.barberInitials} style={{ "--badge": booking.barberColor }} /> : null}
        </div>
      </div>
      <div className="bl-right">
        {booking.price != null ? <b>{formatPeso(booking.price)}</b> : null}
        <div className="bl-tags">
          {booking.paymentStatus ? <Payment payment={booking.paymentStatus} /> : null}
          <Pill value={booking.status} />
        </div>
      </div>
    </article>
  );
}
