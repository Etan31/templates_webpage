import "../assets/styles/barbers.css";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { blockedTimes, formatPeso, services, tokens, workingHours } from "../../../shared/data/casaData.js";
import { Badge, PageHeader, Segmented, Toggle } from "../components/ui/index.jsx";
import { prettyDate } from "../utils/formatters.js";

export default function Barbers({ barbers, setBarbers }) {
  const [selected, setSelected] = useState(barbers[0]?.id || "ms");
  const [tab, setTab] = useState("Working Hours");
  const barber = barbers.find((item) => item.id === selected) || barbers[0];
  return (
    <section>
      <PageHeader title="Manage Availability" />
      <div className="availability-layout">
        <aside className="barber-list panel">
          <p>Team · {barbers.length} Barbers</p>
          {barbers.map((item) => <button className={selected === item.id ? "selected" : ""} key={item.id} type="button" onClick={() => setSelected(item.id)}><Badge label={item.initials} style={{ "--badge": item.color }} /><span><strong>{item.name}</strong><em>{item.role}</em></span><Toggle checked={item.active} onChange={() => setBarbers(barbers.map((barberItem) => barberItem.id === item.id ? { ...barberItem, active: !barberItem.active } : barberItem))} /></button>)}
          <button className="dashed-button" type="button"><Plus size={16} /> Add Barber</button>
        </aside>
        <section className="panel barber-detail">
          <header className="barber-header"><Badge label={barber?.initials || "MS"} style={{ "--badge": barber?.color || tokens.gold }} /><div><h2>{barber?.name}</h2><p>{barber?.role}</p></div></header>
          <Segmented options={["Working Hours", "Blocked Time", "Services"]} value={tab} onChange={setTab} />
          {tab === "Working Hours" ? <WorkingHours /> : tab === "Blocked Time" ? <BlockedTime /> : <ServiceGrid />}
        </section>
      </div>
    </section>
  );
}

function WorkingHours() {
  return (
    <div className="hours-grid">
      <header><strong>Weekly schedule</strong><button type="button">Apply Mon hours to all days</button></header>
      <div className="hours-row head"><span>Day</span><span>Open</span><span>Start</span><span>End</span><span>Break Start</span><span>Break End</span></div>
      {workingHours.map((row) => <div className="hours-row" key={row.day}><strong>{row.day}</strong><Toggle checked={row.open} /><button>{row.start}</button><button>{row.end}</button><button>{row.breakStart}</button><button>{row.breakEnd}</button></div>)}
    </div>
  );
}

function BlockedTime() {
  return (
    <div className="block-list">
      {blockedTimes.map((block) => <article key={block.id}><div><strong>{prettyDate(block.date)}</strong><span>{block.reason} · {block.allDay ? "All day" : `${block.start}–${block.end}`}</span></div><button aria-label="Delete block"><Trash2 size={16} /></button></article>)}
      <button className="outline-gold" type="button"><Plus size={16} /> Block Time</button>
    </div>
  );
}

function ServiceGrid() {
  return (
    <div className="service-grid">{services.map((service, index) => <article key={service.id}><div><h3>{service.name}</h3><strong>{formatPeso(service.price)}</strong><time>{service.duration} min</time></div><Toggle checked={index !== 5} /><button type="button">Edit pricing</button></article>)}</div>
  );
}
