import { Hono } from "hono";
import type { Env } from "../env";
import { createId, nowIso } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.get("/", async (c) => {
  const category = c.req.query("category");
  let query = `SELECT * FROM phrase_library ORDER BY created_at DESC LIMIT 50`;
  const rows = category
    ? await c.env.DB.prepare(`SELECT * FROM phrase_library WHERE category = ? ORDER BY created_at DESC LIMIT 50`)
        .bind(category)
        .all()
    : await c.env.DB.prepare(query).all();

  return c.json({ phrases: rows.results ?? [] });
});

app.post("/", async (c) => {
  const body = await c.req.json<{
    original: string;
    corrected: string;
    language: string;
    category?: string;
  }>();

  const id = createId();
  await c.env.DB.prepare(
    `INSERT INTO phrase_library (id, original, corrected, language, category, created_at) VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(id, body.original, body.corrected, body.language, body.category ?? "general", nowIso())
    .run();

  return c.json({ id, ok: true });
});

app.delete("/:id", async (c) => {
  await c.env.DB.prepare(`DELETE FROM phrase_library WHERE id = ?`).bind(c.req.param("id")).run();
  return c.json({ ok: true });
});

export default app;
