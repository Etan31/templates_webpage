import "../assets/styles/bookings.css";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AlertTriangle, Calendar, Check, Clock3, Download, Edit3, List, MoreHorizontal, RefreshCw, X } from "lucide-react";
import { barbers as seedBarbers, formatPeso } from "../../../shared/data/casaData.js";
import { Badge, BulkBar, EmptyState, Input, Modal, PageHeader, Payment, Pill, SlidePanel } from "../components/ui/index.jsx";
import { prettyDate, toDisplayTime } from "../utils/formatters.js";

export default function Bookings({ bookings, setBookings }) {
  const [status, setStatus] = useState("All");
  const [payment, setPayment] = useState("All");
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const filtered = bookings.filter((booking) => (status === "All" || booking.status === status.toLowerCase()) && (payment === "All" || booking.paymentStatus === payment.toLowerCase()));
  return (
    <section>
      <PageHeader title="Bookings" meta={`${bookings.length} total`} />
      <div className="filter-bar">
        <button type="button"><Calendar size={15} /> Jun 1 – Jun 30, 2026</button>
        <select><option>All Barbers</option>{seedBarbers.map((barber) => <option key={barber.id}>{barber.name}</option>)}</select>
        <ChipGroup label="Status" values={["All", "Pending", "Confirmed", "Completed", "Cancelled"]} active={status} onChange={setStatus} />
        <ChipGroup label="Payment" values={["All", "Paid", "Unpaid", "Refunded"]} active={payment} onChange={setPayment} />
        <button className="ghost-button push-right" type="button"><Download size={15} /> Export CSV</button>
      </div>
      {filtered.length ? <BookingsTable bookings={filtered} selected={selected} setSelected={setSelected} onDetail={setDetail} onCancel={setCancelTarget} /> : <EmptyState onClear={() => { setStatus("All"); setPayment("All"); }} />}
      <AnimatePresence>{selected.length ? <BulkBar count={selected.length} onClear={() => setSelected([])} /> : null}</AnimatePresence>
      <AnimatePresence>{detail ? <BookingDetail booking={detail} onClose={() => setDetail(null)} onCancel={() => setCancelTarget(detail)} onConfirm={() => { setBookings(bookings.map((b) => b.id === detail.id ? { ...b, status: "confirmed" } : b)); setDetail(null); }} /> : null}</AnimatePresence>
      <AnimatePresence>{cancelTarget ? <CancelModal booking={cancelTarget} onClose={() => setCancelTarget(null)} onConfirm={() => {
        setBookings(bookings.map((booking) => booking.id === cancelTarget.id ? { ...booking, status: "cancelled" } : booking));
        setCancelTarget(null);
      }} /> : null}</AnimatePresence>
    </section>
  );
}

function ChipGroup({ label, values, active, onChange }) {
  return <div className="chip-group"><span>{label}</span>{values.map((value) => <button className={active === value ? "selected" : ""} key={value} type="button" onClick={() => onChange(value)}>{value}</button>)}</div>;
}

function BookingsTable({ bookings, selected, setSelected, onDetail, onCancel }) {
  function toggle(id) {
    setSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  }
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead><tr><th><input type="checkbox" aria-label="Select all visible rows" /></th><th>#</th><th>Client</th><th>Service</th><th>Barber</th><th>Date & Time</th><th>Dur.</th><th>Price</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{bookings.slice(0, 18).map((booking) => (
          <tr key={booking.id} onClick={() => onDetail(booking)}>
            <td data-label="Select" onClick={(event) => event.stopPropagation()}><input type="checkbox" checked={selected.includes(booking.id)} onChange={() => toggle(booking.id)} /></td>
            <td data-label="#">{String(booking.number).padStart(2, "0")}</td>
            <td data-label="Client"><strong>{booking.client}</strong></td>
            <td data-label="Service">{booking.service}</td>
            <td data-label="Barber"><Badge label={booking.barberInitials} style={{ "--badge": booking.barberColor }} /> {booking.barber}</td>
            <td data-label="Date & Time">{prettyDate(booking.date)} · {toDisplayTime(booking.time)}</td>
            <td data-label="Duration">{booking.duration}m</td>
            <td data-label="Price"><strong>{formatPeso(booking.price)}</strong></td>
            <td data-label="Payment"><Payment payment={booking.paymentStatus} /></td>
            <td data-label="Status"><Pill value={booking.status} /></td>
            <td data-label="Actions" className="row-actions" onClick={(event) => event.stopPropagation()}><button aria-label="Edit booking" onClick={() => onDetail(booking)}><Edit3 size={16} /></button><button aria-label="Cancel booking" onClick={() => onCancel(booking)}><X size={16} /></button><button aria-label="More actions"><MoreHorizontal size={16} /></button></td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  );
}

function BookingDetail({ booking, onClose, onCancel, onConfirm }) {
  const isRefunded = booking.paymentStatus === "refunded";
  return (
    <SlidePanel title={booking.client} eyebrow="Booking Detail" onClose={onClose} status={<Pill value={booking.status} />}>
      <dl className="detail-list">
        <div><dt>Phone</dt><dd>{booking.phone}</dd></div>
        <div><dt>Service</dt><dd>{booking.service}</dd></div>
        <div><dt>Barber</dt><dd><Badge label={booking.barberInitials} style={{ "--badge": booking.barberColor }} /> {booking.barber}</dd></div>
        <div><dt>Date & Time</dt><dd>{prettyDate(booking.date)} · {toDisplayTime(booking.time)}</dd></div>
        <div><dt>Duration</dt><dd>{booking.duration} min</dd></div>
        <div><dt>Price</dt><dd>{formatPeso(booking.price)}</dd></div>
        <div><dt>Payment</dt><dd><Pill value={booking.paymentStatus} /></dd></div>
      </dl>
      {isRefunded ? (
        <div className="panel-actions">
          <button className="outline-gold" type="button" onClick={onConfirm}><Check size={15} /> Confirm Booking</button>
          <button className="danger-outline" type="button" onClick={onCancel}>Cancel Booking</button>
        </div>
      ) : (
        <>
          <div className="panel-actions">
            <button className="ghost-button" type="button"><RefreshCw size={15} /> Reschedule</button>
            <button className="ghost-button" type="button"><Check size={15} /> Mark Complete</button>
            <button className="ghost-button" type="button"><List size={15} /> Message</button>
            <button className="ghost-button" type="button"><Clock3 size={15} /> Call</button>
          </div>
          <button className="danger-outline booking-cancel-btn" type="button" onClick={onCancel}>Cancel Booking</button>
        </>
      )}
    </SlidePanel>
  );
}

function CancelModal({ booking, onClose, onConfirm }) {
  return (
    <Modal onClose={onClose}>
      <div className="modal-card warning-card">
        <div className="warning-title"><AlertTriangle size={22} /><h2>Cancel this booking?</h2></div>
        <p>This will cancel <strong>{booking.client}</strong>'s {booking.service} on {prettyDate(booking.date)}. You can include a message that will be sent to the client.</p>
        <Input label="Message to client (optional)"><textarea rows="4" placeholder="e.g. Apologies, your barber is unavailable. Please rebook at your convenience." /></Input>
        <div className="modal-actions"><button className="ghost-button" type="button" onClick={onClose}>Keep Booking</button><button className="danger-button" type="button" onClick={onConfirm}>Confirm Cancel</button></div>
      </div>
    </Modal>
  );
}
