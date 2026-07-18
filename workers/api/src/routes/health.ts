import { Hono } from "hono";
import type { Env } from "../env";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const checks = {
    database: false,
    authTables: false,
    tableCount: 0,
    jwtConfigured: !!c.env.JWT_SECRET,
    durableObjects: !!c.env.COACH_ROOM,
    aiBinding: !!c.env.AI,
    voiceBucket: !!c.env.VOICE,
    emailConfigured: !!c.env.RESEND_API_KEY,
  };

  try {
    const tables = await c.env.DB.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`
    ).all<{ name: string }>();
    checks.database = true;
    checks.tableCount = tables.results?.length ?? 0;
    const names = new Set((tables.results ?? []).map((t) => t.name));
    checks.authTables =
      names.has("auth_sessions") &&
      names.has("email_verifications") &&
      names.has("password_resets");
  } catch {
    checks.database = false;
  }

  const healthy = checks.database && checks.authTables && checks.jwtConfigured && checks.tableCount >= 10;

  return c.json({
    status: healthy ? "ok" : "degraded",
    service: "speak-coach-api",
    version: "16.0.0",
    phase: 16,
    checks,
    timestamp: new Date().toISOString(),
  });
});

export default app;
