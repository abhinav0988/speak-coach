import { Hono } from "hono";
import type { Env } from "../env";
import { analyzeCodeSwitch } from "../services/codeSwitch";
import { createId, nowIso } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.post("/analyze", async (c) => {
  const body = await c.req.json<{ text: string; sessionId?: string }>();
  if (!body.text?.trim()) return c.json({ error: "text required" }, 400);

  const analysis = analyzeCodeSwitch(body.text);
  const id = createId();

  await c.env.DB.prepare(
    `INSERT INTO code_switch_logs (id, text_sample, english_ratio, hindi_ratio, mixed_score, word_count, session_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      body.text.slice(0, 500),
      analysis.englishRatio,
      analysis.hindiRatio,
      analysis.mixedScore,
      analysis.wordCount,
      body.sessionId ?? null,
      nowIso()
    )
    .run();

  return c.json({ id, ...analysis });
});

app.get("/history", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, text_sample, english_ratio, hindi_ratio, mixed_score, word_count, created_at
     FROM code_switch_logs ORDER BY created_at DESC LIMIT 30`
  ).all();

  return c.json({
    logs: (rows.results ?? []).map((r) => ({
      id: String(r.id),
      textSample: String(r.text_sample),
      englishRatio: Number(r.english_ratio),
      hindiRatio: Number(r.hindi_ratio),
      mixedScore: Number(r.mixed_score),
      wordCount: Number(r.word_count),
      createdAt: String(r.created_at),
    })),
  });
});

app.get("/stats", async (c) => {
  const avg = await c.env.DB.prepare(
    `SELECT AVG(english_ratio) as en, AVG(hindi_ratio) as hi, AVG(mixed_score) as mixed, COUNT(*) as total
     FROM code_switch_logs`
  ).first<{ en: number; hi: number; mixed: number; total: number }>();

  return c.json({
    totalSamples: avg?.total ?? 0,
    avgEnglishRatio: Math.round((avg?.en ?? 0) * 100),
    avgHindiRatio: Math.round((avg?.hi ?? 0) * 100),
    avgMixedScore: Math.round((avg?.mixed ?? 0) * 100),
  });
});

export default app;
