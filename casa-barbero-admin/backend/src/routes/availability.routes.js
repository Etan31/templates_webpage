import crypto from "node:crypto";
import { Router } from "express";
import { workingHours } from "../../../shared/data/casaData.js";
import { addBlockedTime, getBlockedTimes } from "../data/store.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const availabilityRoutes = Router();

availabilityRoutes.get("/availability", requireAdmin, (_req, res) => {
  res.json({ workingHours, blockedTimes: getBlockedTimes() });
});

availabilityRoutes.post("/availability/block", requireAdmin, (req, res) => {
  const block = addBlockedTime({ id: `bl_${crypto.randomBytes(4).toString("hex")}`, ...req.body });
  res.status(201).json({ block });
});
