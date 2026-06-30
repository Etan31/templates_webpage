import crypto from "node:crypto";
import { Router } from "express";
import { services, workingHours } from "../../../shared/data/casaData.js";
import { addBarber, getBarbers, getBlockedTimes, updateBarber } from "../data/store.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const barbersRoutes = Router();

barbersRoutes.get("/barbers", requireAdmin, (_req, res) => {
  res.json({ barbers: getBarbers(), workingHours, services, blockedTimes: getBlockedTimes() });
});

barbersRoutes.post("/barbers", requireAdmin, (req, res) => {
  const barber = addBarber({
    id: crypto.randomBytes(3).toString("hex"),
    active: true,
    color: "#C9A84C",
    ...req.body
  });
  res.status(201).json({ barber });
});

barbersRoutes.patch("/barbers/:id", requireAdmin, (req, res) => {
  res.json({ barber: updateBarber(req.params.id, req.body) });
});
