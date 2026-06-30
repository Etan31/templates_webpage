import { Router } from "express";
import { getTransactions } from "../data/store.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getDashboardSummary } from "../services/dashboardService.js";

export const paymentsRoutes = Router();

paymentsRoutes.get("/payments", requireAdmin, (_req, res) => {
  res.json({
    transactions: getTransactions(),
    dailyRevenue: getDashboardSummary().dailyRevenue
  });
});
