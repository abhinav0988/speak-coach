import { Hono } from "hono";
import type { Env } from "../env";
import {
  correctRomanHindiSync,
  enhanceWithAI,
  loadMistakeRules,
  updateMistakeCounts,
} from "../services/romanHindi";
import { correctEnglishSync } from "../services/englishFix";
import { bulkCorrect } from "../services/bulkCorrect";
import { createId, nowIso } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.post("/roman-hindi", async (c) => {
  const body = await c.req.json<{ text: string; sessionId?: string }>();
  const rules = await loadMistakeRules(c.env.DB);
  const result = correctRomanHindiSync(body.text, rules);

  const aiEnhance = await enhanceWithAI(c.env.AI, result.correctRomanHindi, "roman_hindi");
  if (aiEnhance) {
    if (aiEnhance.hindiScript) result.hindiScript = aiEnhance.hindiScript;
    if (aiEnhance.englishMeaning) result.englishMeaning = aiEnhance.englishMeaning;
    if (aiEnhance.natural) result.correctRomanHindi = aiEnhance.natural;
  }

  const now = nowIso();
  await updateMistakeCounts(c.env.DB, result.corrections, now);
  await c.env.DB.prepare(
    `INSERT INTO corrections (id, session_id, type, input_text, output_json, created_at) VALUES (?, ?, 'roman_hindi', ?, ?, ?)`
  )
    .bind(createId(), body.sessionId ?? null, body.text, JSON.stringify(result), now)
    .run();

  return c.json(result);
});

app.post("/english", async (c) => {
  const body = await c.req.json<{ text: string; sessionId?: string }>();
  const result = correctEnglishSync(body.text);

  const aiEnhance = await enhanceWithAI(c.env.AI, result.corrected, "english");
  if (aiEnhance?.natural) result.natural = aiEnhance.natural;
  if (aiEnhance?.explanation) result.explanation = aiEnhance.explanation;

  const now = nowIso();
  await updateMistakeCounts(c.env.DB, result.mistakes, now);
  await c.env.DB.prepare(
    `INSERT INTO corrections (id, session_id, type, input_text, output_json, created_at) VALUES (?, ?, 'english', ?, ?, ?)`
  )
    .bind(createId(), body.sessionId ?? null, body.text, JSON.stringify(result), now)
    .run();

  return c.json(result);
});

app.post("/bulk", async (c) => {
  const body = await c.req.json<{ text: string }>();
  if (!body.text?.trim()) return c.json({ error: "text required" }, 400);

  const result = await bulkCorrect(c.env.DB, body.text);
  const now = nowIso();

  for (const line of result.lines) {
    if (line.mistakes.length > 0) {
      await c.env.DB.prepare(
        `INSERT INTO corrections (id, type, input_text, output_json, created_at) VALUES (?, 'bulk', ?, ?, ?)`
      )
        .bind(createId(), line.original, JSON.stringify(line), now)
        .run();
    }
  }

  return c.json(result);
});

app.get("/history", async (c) => {
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 50)));
  const typeFilter = c.req.query("type");

  let query = `SELECT id, type, input_text, output_json, created_at FROM corrections`;
  const binds: string[] = [];
  if (typeFilter && typeFilter !== "all") {
    query += ` WHERE type = ?`;
    binds.push(typeFilter);
  }
  query += ` ORDER BY created_at DESC LIMIT ?`;
  binds.push(String(limit));

  const rows = await c.env.DB.prepare(query)
    .bind(...binds)
    .all();

  const items = (rows.results ?? []).map((r) => {
    let output: Record<string, unknown> = {};
    try {
      output = JSON.parse(String(r.output_json));
    } catch {
      /* ignore */
    }

    const type = String(r.type);
    let correctedPreview = "";
    let mistakeCount = 0;

    if (type === "roman_hindi") {
      correctedPreview = String(output.correctRomanHindi ?? output.corrected ?? "");
      mistakeCount = Array.isArray(output.corrections) ? output.corrections.length : 0;
    } else if (type === "english") {
      correctedPreview = String(output.corrected ?? output.natural ?? "");
      mistakeCount = Array.isArray(output.mistakes) ? output.mistakes.length : 0;
    } else if (type === "bulk") {
      correctedPreview = String(output.corrected ?? "");
      mistakeCount = Array.isArray(output.mistakes) ? output.mistakes.length : 0;
    }

    return {
      id: String(r.id),
      type,
      inputText: String(r.input_text),
      correctedPreview,
      mistakeCount,
      createdAt: String(r.created_at),
    };
  });

  const stats = await c.env.DB.prepare(
    `SELECT type, COUNT(*) as count FROM corrections GROUP BY type`
  ).all();

  return c.json({
    items,
    stats: Object.fromEntries(
      (stats.results ?? []).map((s) => [String(s.type), Number(s.count)])
    ),
    total: items.length,
  });
});

export default app;
