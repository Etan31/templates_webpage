import "../assets/styles/barbers.css";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { blockedTimes, formatPeso, services, tokens, workingHours } from "../../../shared/data/casaData.js";
import { Badge, Modal, PageHeader, Segmented, Toggle } from "../components/ui/index.jsx";
import { prettyDate } from "../utils/formatters.js";

const BADGE_COLORS = ["#C9A84C", "#5B9BD5", "#4CAF7D", "#E05555", "#E5A443", "#9B5BA5"];

export default function Barbers({ barbers, setBarbers }) {
  const [selected, setSelected] = useState(barbers[0]?.id || "ms");
  const [tab, setTab] = useState("Working Hours");
  const [addOpen, setAddOpen] = useState(false);
  const barber = barbers.find((item) => item.id === selected) || barbers[0];

  function handleAddBarber(data) {
    setBarbers([...barbers, data]);
    setSelected(data.id);
    setAddOpen(false);
  }

  return (
    <section>
      <PageHeader title="Manage Availability" />
      <div className="availability-layout">
        <aside className="barber-list panel">
          <p>Team · {barbers.length} Barbers</p>
          {barbers.map((item) => (
            <button className={selected === item.id ? "selected" : ""} key={item.id} type="button" onClick={() => setSelected(item.id)}>
              <Badge label={item.initials} style={{ "--badge": item.color }} />
              <span><strong>{item.name}</strong><em>{item.role}</em></span>
              <Toggle checked={item.active} onChange={() => setBarbers(barbers.map((b) => b.id === item.id ? { ...b, active: !b.active } : b))} />
            </button>
          ))}
          <button className="dashed-button" type="button" onClick={() => setAddOpen(true)}><Plus size={16} /> Add Barber</button>
        </aside>
        <section className="panel barber-detail">
          <header className="barber-header">
            <Badge label={barber?.initials || "MS"} style={{ "--badge": barber?.color || tokens.gold }} />
            <div><h2>{barber?.name}</h2><p>{barber?.role}</p></div>
          </header>
          <Segmented options={["Working Hours", "Blocked Time", "Services"]} value={tab} onChange={setTab} />
          {tab === "Working Hours" ? <WorkingHours /> : tab === "Blocked Time" ? <BlockedTime /> : <ServiceGrid />}
        </section>
      </div>
      <AnimatePresence>
        {addOpen ? <AddBarberModal onClose={() => setAddOpen(false)} onAdd={handleAddBarber} /> : null}
      </AnimatePresence>
    </section>
  );
}

function AddBarberModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: "", role: "", color: BADGE_COLORS[0] });

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const words = form.name.trim().split(" ");
    const initials = (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
    onAdd({
      id: `barber_${Date.now()}`,
      name: form.name.trim(),
      role: form.role.trim() || "Barber",
      initials,
      color: form.color,
      active: true
    });
  }

  return (
    <Modal onClose={onClose}>
      <div className="modal-card">
        <h2>Add Barber</h2>
        <span className="signature-divider" />
        <form className="panel-form" onSubmit={handleSubmit}>
          <label className="input-field">
            <span>Full Name</span>
            <input type="text" placeholder="e.g. Miguel Santos" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
          </label>
          <label className="input-field">
            <span>Role / Position</span>
            <input type="text" placeholder="e.g. Senior Barber" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </label>
          <div className="input-field">
            <span>Badge Color</span>
            <div className="color-swatch-row">
              {BADGE_COLORS.map((color) => (
                <button key={color} type="button" className={`color-swatch${form.color === color ? " active" : ""}`} style={{ background: color }} onClick={() => setForm({ ...form, color })} aria-label={`Select color ${color}`} />
              ))}
            </div>
          </div>
          <div className="modal-actions">
            <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
            <button className="gold-button" type="submit">Add Barber</button>
          </div>
        </form>
      </div>
    </Modal>
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
  const [items, setItems] = useState(services);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", duration: "" });

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;
    setItems([...items, { id: `s${Date.now()}`, name: form.name.trim(), price: Number(form.price), duration: Number(form.duration) || 30 }]);
    setForm({ name: "", price: "", duration: "" });
    setShowForm(false);
  }

  function handleCancel() {
    setShowForm(false);
    setForm({ name: "", price: "", duration: "" });
  }

  return (
    <div className="hours-grid">
      <header><strong>Services · {items.length}</strong></header>
      <div className="service-grid">
        {items.map((service, index) => (
          <article key={service.id}>
            <div><h3>{service.name}</h3><strong>{formatPeso(service.price)}</strong><time>{service.duration} min</time></div>
            <Toggle checked={index !== items.length - 1} />
            <button type="button">Edit pricing</button>
          </article>
        ))}
      </div>
      {showForm ? (
        <form className="add-service-form" onSubmit={handleAdd}>
          <label className="input-field">
            <span>Service Name</span>
            <input type="text" placeholder="e.g. Hot Towel Shave" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoFocus />
          </label>
          <div className="add-service-row">
            <label className="input-field">
              <span>Price (₱)</span>
              <input type="number" min="0" placeholder="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </label>
            <label className="input-field">
              <span>Duration (min)</span>
              <input type="number" min="5" placeholder="30" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            </label>
          </div>
          <div className="modal-actions">
            <button className="ghost-button" type="button" onClick={handleCancel}>Cancel</button>
            <button className="gold-button" type="submit">Add Service</button>
          </div>
        </form>
      ) : (
        <button className="outline-gold service-add-btn" type="button" onClick={() => setShowForm(true)}><Plus size={15} /> Add Service</button>
      )}
    </div>
  );
}
