import { Router } from "express";
import { owner, shopProfile, syncLog } from "../../../shared/data/casaData.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

export const systemRoutes = Router();

systemRoutes.get("/sync", requireAdmin, (_req, res) => {
  res.json({ log: syncLog, account: owner.email, lastSynced: new Date().toISOString() });
});

systemRoutes.get("/settings", requireAdmin, (_req, res) => {
  res.json({ shopProfile, owner });
});
