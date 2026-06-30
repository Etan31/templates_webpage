import crypto from "node:crypto";
import { owner } from "../../../shared/data/casaData.js";

const sessions = new Map();

export function createSession(remember) {
  const now = Date.now();
  const maxAge = remember ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
  const token = crypto.randomBytes(24).toString("hex");
  const session = { token, user: owner, expiresAt: now + maxAge * 1000, maxAge };
  sessions.set(token, session);
  return session;
}

export function getSession(token) {
  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) return null;
  return session;
}

export function deleteSession(token) {
  sessions.delete(token);
}
