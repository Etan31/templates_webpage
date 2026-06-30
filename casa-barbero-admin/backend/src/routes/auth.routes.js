import { Router } from "express";
import { owner } from "../../../shared/data/casaData.js";
import { env } from "../config/env.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { createSession, deleteSession } from "../services/sessionService.js";

export const authRoutes = Router();

authRoutes.post("/auth/login", (req, res) => {
  const { email, password, remember } = req.body;
  const adminEmail = env.adminEmail || owner.email;

  if (email !== adminEmail || password !== env.adminPassword) {
    return res.status(401).json({ error: "Email or password does not match the owner account." });
  }

  res.json(createSession(Boolean(remember)));
});

authRoutes.post("/auth/logout", requireAdmin, (req, res) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  deleteSession(token);
  res.json({ ok: true });
});

authRoutes.get("/me", requireAdmin, (_req, res) => {
  res.json({ user: owner });
});
