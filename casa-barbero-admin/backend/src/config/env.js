import "dotenv/config";

export const env = {
  port: Number(process.env.PORT || 4174),
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD || "barbero2026"
};
