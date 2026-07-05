import { Router } from "express";
import { supabase } from "../config/supabase.js";
import { env } from "../config/env.js";

export const keepaliveRoutes = Router();

// Hit on a schedule by .github/workflows/keepalive.yml so the Supabase free-tier
// project doesn't auto-pause after 7 days without an API request.
keepaliveRoutes.get("/keepalive", async (req, res) => {
  if (env.keepaliveSecret && req.headers["x-keepalive-secret"] !== env.keepaliveSecret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase
    .from("keepalive_log")
    .update({ pinged_at: new Date().toISOString() })
    .eq("id", "default")
    .select("pinged_at")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true, pingedAt: data.pinged_at });
});
