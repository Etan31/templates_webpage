import crypto from "node:crypto";
import { Router } from "express";
import { services } from "../../../shared/data/casaData.js";
import { addBooking, getBarbers, getBookings, updateBooking } from "../data/store.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const bookingsRoutes = Router();

bookingsRoutes.get("/bookings", requireAdmin, (_req, res) => {
  res.json({ bookings: getBookings() });
});

bookingsRoutes.post("/bookings", requireAdmin, (req, res) => {
  const service = services.find((item) => item.id === req.body.serviceId) || services[0];
  const barbers = getBarbers();
  const barber = barbers.find((item) => item.id === req.body.barberId) || barbers[0];
  const booking = addBooking({
    id: `bk_${crypto.randomBytes(4).toString("hex")}`,
    number: getBookings().length + 1,
    client: req.body.client,
    phone: req.body.phone,
    serviceId: service.id,
    service: service.name,
    barberId: barber.id,
    barber: barber.name,
    barberInitials: barber.initials,
    barberColor: barber.color,
    date: req.body.date,
    time: req.body.time,
    duration: Number(req.body.duration || service.duration),
    price: Number(req.body.price || service.price),
    paymentStatus: req.body.paymentStatus || "unpaid",
    status: "pending",
    notes: req.body.notes || ""
  });

  res.status(201).json({ booking });
});

bookingsRoutes.patch("/bookings/:id", requireAdmin, (req, res) => {
  res.json({ booking: updateBooking(req.params.id, req.body) });
});

bookingsRoutes.delete("/bookings/:id", requireAdmin, (req, res) => {
  updateBooking(req.params.id, { status: "cancelled" });
  res.json({ ok: true });
});
