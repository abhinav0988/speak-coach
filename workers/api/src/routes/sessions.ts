import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { createId, nowIso, todayDate } from "../utils";
import { SESSION_STEPS } from "@speak-coach/shared";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

async function ensureSessionOwner(db: D1Database, sessionId: string, userId: string): Promise<boolean> {
  const row = await db
    .prepare(`SELECT id FROM sessions WHERE id = ? AND user_id = ?`)
    .bind(sessionId, userId)
    .first<{ id: string }>();
  return !!row;
}

app.post("/", async (c) => {
  const userId = c.get("userId");
  const user = await c.env.DB.prepare(`SELECT start_date FROM users WHERE id = ?`)
    .bind(userId)
    .first<{
      start_date: string;
    }>();
  const startDate = user?.start_date ? new Date(user.start_date) : new Date();
  const dayNumber = Math.floor((Date.now() - startDate.getTime()) / 86400000) + 1;
  const today = todayDate();

  const existing = await c.env.DB.prepare(
    `SELECT id FROM sessions WHERE user_id = ? AND date = ?`
  )
    .bind(userId, today)
    .first<{ id: string }>();

  if (existing) return c.json({ id: existing.id, dayNumber, existing: true });

  const id = createId();
  const now = nowIso();
  await c.env.DB.prepare(
    `INSERT INTO sessions (id, user_id, day_number, date, created_at) VALUES (?, ?, ?, ?, ?)`
  )
    .bind(id, userId, dayNumber, today, now)
    .run();

  for (let i = 1; i <= SESSION_STEPS.length; i++) {
    await c.env.DB.prepare(
      `INSERT INTO session_steps (id, session_id, step_number, status) VALUES (?, ?, ?, 'pending')`
    )
      .bind(createId(), id, i)
      .run();
  }

  return c.json({ id, dayNumber, existing: false });
});

app.get("/today", async (c) => {
  const userId = c.get("userId");
  const today = todayDate();
  const session = await c.env.DB.prepare(
    `SELECT * FROM sessions WHERE user_id = ? AND date = ?`
  )
    .bind(userId, today)
    .first();

  if (!session) return c.json({ session: null, steps: [] });

  const steps = await c.env.DB.prepare(
    `SELECT step_number, status, duration_sec, data_json FROM session_steps WHERE session_id = ? ORDER BY step_number`
  )
    .bind(session.id)
    .all();

  return c.json({ session, steps: steps.results ?? [] });
});

app.patch("/:id/step", async (c) => {
  const userId = c.get("userId");
  const sessionId = c.req.param("id");
  if (!(await ensureSessionOwner(c.env.DB, sessionId, userId))) {
    return c.json({ error: "Session not found" }, 404);
  }
  const body = await c.req.json<{
    stepNumber: number;
    status: "done" | "skipped";
    durationSec?: number;
    data?: unknown;
  }>();

  await c.env.DB.prepare(
    `UPDATE session_steps SET status = ?, duration_sec = ?, data_json = ? WHERE session_id = ? AND step_number = ?`
  )
    .bind(
      body.status,
      body.durationSec ?? null,
      body.data ? JSON.stringify(body.data) : null,
      sessionId,
      body.stepNumber
    )
    .run();

  const done = await c.env.DB.prepare(
    `SELECT COUNT(*) as count FROM session_steps WHERE session_id = ? AND status = 'done'`
  )
    .bind(sessionId)
    .first<{ count: number }>();

  await c.env.DB.prepare(`UPDATE sessions SET completed_steps = ? WHERE id = ?`)
    .bind(done?.count ?? 0, sessionId)
    .run();

  return c.json({ ok: true, completedSteps: done?.count ?? 0 });
});

app.patch("/:id/scores", async (c) => {
  const userId = c.get("userId");
  const sessionId = c.req.param("id");
  if (!(await ensureSessionOwner(c.env.DB, sessionId, userId))) {
    return c.json({ error: "Session not found" }, 404);
  }
  const body = await c.req.json<{
    motivation?: number;
    pronunciation?: number;
    romanHindi?: number;
    spokenEn?: number;
    spokenHi?: number;
    loudness?: number;
    clarity?: number;
    notes?: string;
  }>();

  await c.env.DB.prepare(
    `UPDATE sessions SET
      motivation_score = COALESCE(?, motivation_score),
      pronunciation_score = COALESCE(?, pronunciation_score),
      roman_hindi_score = COALESCE(?, roman_hindi_score),
      spoken_en_score = COALESCE(?, spoken_en_score),
      spoken_hi_score = COALESCE(?, spoken_hi_score),
      loudness_score = COALESCE(?, loudness_score),
      clarity_score = COALESCE(?, clarity_score),
      notes = COALESCE(?, notes)
    WHERE id = ?`
  )
    .bind(
      body.motivation ?? null,
      body.pronunciation ?? null,
      body.romanHindi ?? null,
      body.spokenEn ?? null,
      body.spokenHi ?? null,
      body.loudness ?? null,
      body.clarity ?? null,
      body.notes ?? null,
      sessionId
    )
    .run();

  return c.json({ ok: true });
});

app.post("/:id/homework", async (c) => {
  const userId = c.get("userId");
  const sessionId = c.req.param("id");
  if (!(await ensureSessionOwner(c.env.DB, sessionId, userId))) {
    return c.json({ error: "Session not found" }, 404);
  }
  const body = await c.req.json<{
    dayNumber: number;
    scores?: { romanHindi?: number; loudness?: number; pronunciation?: number };
  }>();

  const tasks: string[] = [];
  const scores = body.scores ?? {};

  tasks.push("Do voice warm-up for 5 minutes before tomorrow's session");
  tasks.push("Practice 10 Hindi sentences aloud twice");

  if ((scores.romanHindi ?? 10) < 7) {
    tasks.push("Write 3 Roman Hindi sentences and submit for correction");
  }
  if ((scores.loudness ?? 10) < 7) {
    tasks.push("Record yourself speaking for 60 seconds — focus on speaking LOUDER");
  }
  if ((scores.pronunciation ?? 10) < 7) {
    tasks.push("Complete 1 Sound Gym drill (TH or V/W sound)");
  }
  tasks.push("Review top 5 mistakes from your dictionary");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dueDate = tomorrow.toISOString().slice(0, 10);
  const id = createId();

  await c.env.DB.prepare(
    `INSERT INTO homework (id, session_id, day_number, tasks_json, due_date, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(id, sessionId, body.dayNumber, JSON.stringify(tasks), dueDate, nowIso())
    .run();

  return c.json({ id, tasks, dueDate });
});

export default app;
