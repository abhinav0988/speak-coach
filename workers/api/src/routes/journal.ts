import { Hono } from "hono";
import type { Env } from "../env";
import { createId, nowIso, todayDate } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT * FROM journal_entries ORDER BY date DESC LIMIT 14`
  ).all();
  return c.json({ entries: rows.results ?? [] });
});

app.get("/today", async (c) => {
  const today = todayDate();
  const entry = await c.env.DB.prepare(`SELECT * FROM journal_entries WHERE date = ?`)
    .bind(today)
    .first();
  return c.json({ entry: entry ?? null });
});

app.post("/", async (c) => {
  const body = await c.req.json<{
    moodBefore?: number;
    moodAfter?: number;
    reflection?: string;
  }>();
  const today = todayDate();
  const existing = await c.env.DB.prepare(`SELECT id FROM journal_entries WHERE date = ?`)
    .bind(today)
    .first();

  if (existing) {
    await c.env.DB.prepare(
      `UPDATE journal_entries SET mood_before = COALESCE(?, mood_before), mood_after = COALESCE(?, mood_after), reflection = COALESCE(?, reflection) WHERE date = ?`
    )
      .bind(body.moodBefore ?? null, body.moodAfter ?? null, body.reflection ?? null, today)
      .run();
    return c.json({ ok: true, updated: true });
  }

  await c.env.DB.prepare(
    `INSERT INTO journal_entries (id, date, mood_before, mood_after, reflection, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(createId(), today, body.moodBefore ?? null, body.moodAfter ?? null, body.reflection ?? null, nowIso())
    .run();

  return c.json({ ok: true, created: true });
});

export default app;
