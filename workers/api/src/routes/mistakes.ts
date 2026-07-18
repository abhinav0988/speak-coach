import { Hono } from "hono";
import type { Env } from "../env";
import { createId } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, wrong_form, correct_form, category, repeat_count, last_seen_at, mastered_at
     FROM mistakes ORDER BY repeat_count DESC`
  ).all();
  return c.json({ mistakes: rows.results ?? [] });
});

app.post("/", async (c) => {
  const body = await c.req.json<{ wrong: string; correct: string; category?: string }>();
  const id = createId();
  await c.env.DB.prepare(
    `INSERT INTO mistakes (id, wrong_form, correct_form, category, repeat_count)
     VALUES (?, ?, ?, ?, 0)
     ON CONFLICT(wrong_form) DO UPDATE SET correct_form = excluded.correct_form`
  )
    .bind(id, body.wrong.toLowerCase(), body.correct, body.category ?? "roman_hindi")
    .run();
  return c.json({ ok: true });
});

export default app;
