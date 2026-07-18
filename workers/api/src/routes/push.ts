import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { upsertPushToken } from "../services/push";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/status", async (c) => {
  const userId = c.get("userId");
  const settings = await c.env.DB.prepare(
    `SELECT reminder_enabled, reminder_time, last_reminder_sent_date FROM user_settings WHERE user_id = ?`
  )
    .bind(userId)
    .first<{
      reminder_enabled: number;
      reminder_time: string;
      last_reminder_sent_date: string | null;
    }>();

  const tokens = await c.env.DB.prepare(
    `SELECT COUNT(*) as c FROM push_tokens WHERE user_id = ?`
  )
    .bind(userId)
    .first<{ c: number }>();

  return c.json({
    reminderEnabled: !!settings?.reminder_enabled,
    reminderTime: settings?.reminder_time ?? "09:00",
    lastReminderSentDate: settings?.last_reminder_sent_date ?? null,
    pushTokenCount: tokens?.c ?? 0,
    webPushConfigured: !!c.env.VAPID_PUBLIC_KEY,
    serverPushReady: (tokens?.c ?? 0) > 0 && !!settings?.reminder_enabled,
  });
});

app.get("/vapid-public-key", (c) => {
  return c.json({ publicKey: c.env.VAPID_PUBLIC_KEY ?? null });
});

app.post("/register", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{
    token?: string;
    subscription?: unknown;
    platform?: string;
  }>();

  if (body.subscription) {
    const token = JSON.stringify(body.subscription);
    const id = await upsertPushToken(c.env.DB, userId, token, "web");
    return c.json({ ok: true, id, platform: "web" });
  }

  if (!body.token?.startsWith("ExponentPushToken")) {
    return c.json({ error: "Invalid push token or subscription" }, 400);
  }

  const id = await upsertPushToken(c.env.DB, userId, body.token, body.platform);
  return c.json({ ok: true, id });
});

app.delete("/register", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ token?: string }>();
  if (!body.token) return c.json({ error: "token required" }, 400);

  await c.env.DB.prepare(`DELETE FROM push_tokens WHERE token = ? AND user_id = ?`)
    .bind(body.token, userId)
    .run();
  return c.json({ ok: true });
});

export default app;
