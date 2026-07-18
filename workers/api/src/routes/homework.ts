import { Hono } from "hono";
import type { Env } from "../env";
import { createId, nowIso, todayDate } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.get("/today", async (c) => {
  const today = todayDate();
  const hw = await c.env.DB.prepare(
    `SELECT * FROM homework WHERE due_date >= ? ORDER BY created_at DESC LIMIT 1`
  )
    .bind(today)
    .first();

  if (!hw) return c.json({ homework: null });

  return c.json({
    homework: {
      id: hw.id,
      tasks: JSON.parse(String(hw.tasks_json)),
      dueDate: hw.due_date,
      completed: Boolean(hw.completed),
    },
  });
});

app.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, day_number, tasks_json, due_date, completed, created_at FROM homework ORDER BY created_at DESC LIMIT 14`
  ).all();
  return c.json({
    homework: (rows.results ?? []).map((h) => ({
      id: h.id,
      dayNumber: h.day_number,
      tasks: JSON.parse(String(h.tasks_json)),
      dueDate: h.due_date,
      completed: Boolean(h.completed),
      createdAt: h.created_at,
    })),
  });
});

app.post("/assign", async (c) => {
  const body = await c.req.json<{
    sessionId?: string;
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
    .bind(id, body.sessionId ?? null, body.dayNumber, JSON.stringify(tasks), dueDate, nowIso())
    .run();

  return c.json({ id, tasks, dueDate });
});

app.patch("/:id/complete", async (c) => {
  await c.env.DB.prepare(`UPDATE homework SET completed = 1 WHERE id = ?`)
    .bind(c.req.param("id"))
    .run();
  return c.json({ ok: true });
});

export default app;
