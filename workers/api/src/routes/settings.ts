import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { nowIso } from "../utils";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const row = await c.env.DB.prepare(`SELECT * FROM user_settings WHERE user_id = ?`)
    .bind(userId)
    .first();
  return c.json({ settings: row ?? { reminder_enabled: 0, reminder_time: "09:00", devanagari_preferred: 0 } });
});

app.patch("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{
    reminderEnabled?: boolean;
    reminderTime?: string;
    devanagariPreferred?: boolean;
    dailyGoalMinutes?: number;
    weeklyReportEmail?: boolean;
  }>();

  await c.env.DB.prepare(
    `UPDATE user_settings SET
      reminder_enabled = COALESCE(?, reminder_enabled),
      reminder_time = COALESCE(?, reminder_time),
      devanagari_preferred = COALESCE(?, devanagari_preferred),
      daily_goal_minutes = COALESCE(?, daily_goal_minutes),
      weekly_report_email = COALESCE(?, weekly_report_email),
      updated_at = ?
    WHERE user_id = ?`
  )
    .bind(
      body.reminderEnabled !== undefined ? (body.reminderEnabled ? 1 : 0) : null,
      body.reminderTime ?? null,
      body.devanagariPreferred !== undefined ? (body.devanagariPreferred ? 1 : 0) : null,
      body.dailyGoalMinutes ?? null,
      body.weeklyReportEmail !== undefined ? (body.weeklyReportEmail ? 1 : 0) : null,
      nowIso(),
      userId
    )
    .run();

  const row = await c.env.DB.prepare(`SELECT * FROM user_settings WHERE user_id = ?`)
    .bind(userId)
    .first();
  return c.json({ settings: row });
});

export default app;
