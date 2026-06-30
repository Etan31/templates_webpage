import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, MoreHorizontal, Plus, Slash } from "lucide-react";
import { barbers as seedBarbers, blockedTimes, services } from "../../../shared/data/casaData.js";
import { Badge, Input, Modal, PageHeader, Segmented, SlidePanel, Toggle } from "../components/ui/index.jsx";
import { api } from "../services/api.js";
import { blockSchema, manualBookingSchema } from "../validation/schemas.js";
import { shortName } from "../utils/formatters.js";

export default function Schedule({ bookings, barbers, setBookings }) {
  const [view, setView] = useState("month");
  const [blockOpen, setBlockOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [blocks, setBlocks] = useState(blockedTimes);
  return (
    <section>
      <PageHeader title="Schedule" />
      <div className="controls-bar">
        <button className="icon-btn" type="button" aria-label="Previous month"><ChevronLeft size={18} /></button>
        <strong>June 2026</strong>
        <button className="icon-btn" type="button" aria-label="Next month"><ChevronRight size={18} /></button>
        <Segmented options={["month", "week", "day"]} value={view} onChange={setView} />
        <select aria-label="Filter barbers"><option>All Barbers</option>{barbers.map((barber) => <option key={barber.id}>{barber.name}</option>)}</select>
        <div className="legend-row">{barbers.map((barber) => <span key={barber.id}><i style={{ background: barber.color }} />{barber.name}</span>)}</div>
        <button className="outline-gold" type="button" onClick={() => setBlockOpen(true)}><Plus size={16} /> Block Time</button>
        <button className="gold-button" type="button" onClick={() => setManualOpen(true)}><Plus size={16} /> Manual Booking</button>
      </div>
      {view === "month" ? <MonthView bookings={bookings} blocks={blocks} /> : <WeekView bookings={bookings} barbers={barbers} day={view === "day"} />}
      <AnimatePresence>{blockOpen ? <BlockModal onClose={() => setBlockOpen(false)} onCreate={(block) => setBlocks([block, ...blocks])} /> : null}</AnimatePresence>
      <AnimatePresence>{manualOpen ? <ManualBookingPanel onClose={() => setManualOpen(false)} onCreate={(booking) => setBookings([booking, ...bookings])} barbers={barbers} /> : null}</AnimatePresence>
    </section>
  );
}

function MonthView({ bookings, blocks }) {
  const byDay = useMemo(() => bookings.reduce((map, booking) => {
    const day = Number(booking.date.slice(-2));
    map[day] = [...(map[day] || []), booking];
    return map;
  }, {}), [bookings]);
  return (
    <div className="schedule-month">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span className="month-heading" key={d}>{d}</span>)}
      {Array.from({ length: 42 }, (_, index) => {
        const day = index < 30 ? index + 1 : index - 29;
        const dayBookings = byDay[day] || [];
        const blocked = blocks.find((block) => Number(block.date.slice(-2)) === day);
        return (
          <article className={`day-cell ${index >= 30 ? "out" : ""}`} key={`${day}-${index}`}>
            <strong>{day}{day === 27 && index < 30 ? <span>27</span> : null}</strong>
            {blocked && index < 30 ? <div className="blocked"><Slash size={14} />{blocked.reason}</div> : null}
            {dayBookings.slice(0, 3).map((booking) => <BookingChip booking={booking} key={booking.id} />)}
            {dayBookings.length > 3 ? <button type="button" className="more-link">+{dayBookings.length - 3} more</button> : null}
          </article>
        );
      })}
    </div>
  );
}

function WeekView({ bookings, barbers, day }) {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  return (
    <div className="week-view">
      <div className="time-col"><strong>{day ? "Saturday, June 27" : "Week of June 22-28"}</strong>{hours.map((hour) => <span key={hour}>{hour > 12 ? hour - 12 : hour} {hour >= 12 ? "PM" : "AM"}</span>)}</div>
      {barbers.map((barber) => (
        <div className="barber-col" key={barber.id}>
          <header><Badge label={barber.initials} style={{ "--badge": barber.color }} /><strong>{barber.name}</strong></header>
          <div className="time-grid">
            {hours.map((hour) => <span key={hour} />)}
            {bookings.filter((booking) => booking.barberId === barber.id).slice(0, day ? 3 : 4).map((booking, index) => {
              const hour = Number(booking.time.slice(0, 2));
              return <div className="booking-block" key={booking.id} style={{ top: `${(hour - 8) * 58 + 28}px`, height: `${Math.max(36, booking.duration)}px`, "--barber": barber.color, transform: `translateX(${index % 2 ? 6 : 0}px)` }}><MoreHorizontal size={13} /> <strong>{booking.client}</strong><span>{booking.service}</span></div>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function BookingChip({ booking }) {
  return <div className="booking-chip" style={{ "--barber": booking.barberColor }}>{shortName(booking.client)} · {booking.service}</div>;
}

function ManualBookingPanel({ onClose, onCreate, barbers }) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: { serviceId: services[0].id, barberId: barbers[0]?.id || "ms", date: "2026-06-27", time: "10:00", duration: services[0].duration, price: services[0].price, paymentStatus: "unpaid" }
  });
  const selectedService = services.find((service) => service.id === watch("serviceId")) || services[0];
  useEffect(() => {
    // Defaults are visible even if the user never touches the service dropdown.
  }, [selectedService]);
  return (
    <SlidePanel title="Manual Booking" eyebrow="Create booking" onClose={onClose}>
      <form className="panel-form" onSubmit={handleSubmit(async (values) => {
        const barber = barbers.find((item) => item.id === values.barberId) || barbers[0];
        const booking = {
          ...values,
          id: `bk_local_${Date.now()}`,
          number: 999,
          service: selectedService.name,
          barber: barber.name,
          barberInitials: barber.initials,
          barberColor: barber.color,
          status: "pending"
        };
        try {
          const response = await api("/api/admin/bookings", { method: "POST", body: JSON.stringify(values) });
          onCreate(response.booking);
        } catch {
          onCreate(booking);
        }
        onClose();
      })}>
        <Input label="Client Name" error={errors.client?.message}><input {...register("client")} /></Input>
        <Input label="Phone" error={errors.phone?.message}><input type="tel" {...register("phone")} /></Input>
        <Input label="Service"><select {...register("serviceId")}>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></Input>
        <Input label="Barber"><select {...register("barberId")}>{barbers.map((barber) => <option key={barber.id} value={barber.id}>{barber.name}</option>)}</select></Input>
        <Input label="Date"><input type="date" {...register("date")} /></Input>
        <Input label="Time"><input type="time" {...register("time")} /></Input>
        <Input label="Duration"><input type="number" {...register("duration")} /></Input>
        <Input label="Price"><input type="number" {...register("price")} /></Input>
        <Input label="Payment status"><select {...register("paymentStatus")}><option value="paid">Paid</option><option value="unpaid">Unpaid</option><option value="refunded">Refunded</option></select></Input>
        <button className="gold-button full bottom-cta" disabled={isSubmitting} type="submit">Create Booking</button>
      </form>
    </SlidePanel>
  );
}

function BlockModal({ onClose, onCreate }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(blockSchema),
    defaultValues: { barberId: "ms", date: "2026-06-27", allDay: true, range: false, reason: "" }
  });
  return (
    <Modal onClose={onClose}>
      <form className="modal-card" onSubmit={handleSubmit(async (values) => {
        const block = { id: `bl_local_${Date.now()}`, ...values };
        try {
          const response = await api("/api/admin/availability/block", { method: "POST", body: JSON.stringify(values) });
          onCreate(response.block);
        } catch {
          onCreate(block);
        }
        onClose();
      })}>
        <h2>Block Date</h2>
        <span className="signature-divider" />
        <Input label="Barber"><select {...register("barberId")}>{seedBarbers.map((barber) => <option key={barber.id} value={barber.id}>{barber.name}</option>)}</select></Input>
        <div className="two-col">
          <Input label="Date"><input type="date" {...register("date")} /></Input>
          <label className="toggle-row compact"><span>Range</span><Toggle checked={watch("range")} register={register("range")} /></label>
        </div>
        <label className="toggle-row"><span>All-day</span><Toggle checked={watch("allDay")} register={register("allDay")} /></label>
        {!watch("allDay") ? <div className="two-col"><Input label="Start"><input type="time" {...register("start")} /></Input><Input label="End"><input type="time" {...register("end")} /></Input></div> : null}
        <Input label="Reason" error={errors.reason?.message}><input {...register("reason")} /></Input>
        <Input label="Optional notes"><textarea rows="4" {...register("notes")} /></Input>
        <div className="modal-actions"><button className="ghost-button" type="button" onClick={onClose}>Cancel</button><button className="gold-button" type="submit">Block Date</button></div>
      </form>
    </Modal>
  );
}
