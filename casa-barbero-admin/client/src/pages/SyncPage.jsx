import "../assets/styles/sync.css";
import { useState } from "react";
import { Calendar, RefreshCw } from "lucide-react";
import { owner, syncLog } from "../../../shared/data/casaData.js";
import { Badge, PageHeader, PanelTitle, Pill, Toggle } from "../components/ui/index.jsx";

export default function Sync() {
  const [syncing, setSyncing] = useState(false);
  const [last, setLast] = useState("3 minutes ago");
  const [toggles, setToggles] = useState([true, true, true, false, true]);
  const rows = ["New Bookings", "Cancellations", "Reschedules", "Barber Events", "Reminders"];
  return (
    <section className="center-page">
      <PageHeader title="Google Calendar Sync" />
      <section className="panel connection-card">
        <div className="google-icon"><Calendar size={28} /></div>
        <div><h2>Google Calendar <Pill value="Connected" /></h2><p className="mono">{owner.email}</p><span><RefreshCw size={14} /> Last synced {last}</span></div>
        <button className="gold-button" type="button" onClick={() => { setSyncing(true); setTimeout(() => { setSyncing(false); setLast("just now"); }, 1500); }}>{syncing ? <span className="spinner" /> : <RefreshCw size={16} />} Sync Now</button>
        <button className="ghost-danger" type="button">Disconnect</button>
      </section>
      <section className="sync-settings"><PanelTitle title="What gets synced" />{rows.map((row, index) => <label className="toggle-row sync-row" key={row}><span><strong>{row}</strong><em>{["Automatically add confirmed bookings to Google Calendar", "Remove cancelled bookings from the calendar", "Update event time when a booking is rescheduled", "Create separate calendar entries per barber", "Sync 24-hour reminder notifications"][index]}</em></span><Toggle checked={toggles[index]} onChange={() => setToggles(toggles.map((value, idx) => idx === index ? !value : value))} /></label>)}</section>
      <section className="sync-log"><PanelTitle title="Recent sync activity" />{syncLog.map((item) => <article className={!item.ok ? "failed" : ""} key={`${item.time}-${item.type}`}><time>{item.time}</time><Badge label={item.type} /><span>{item.description}</span>{item.ok ? <strong>✓ Success</strong> : <button className="danger-outline">Retry</button>}</article>)}</section>
    </section>
  );
}
