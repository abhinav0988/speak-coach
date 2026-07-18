import { Hono } from "hono";
import type { Env } from "../env";
import { SHADOWING_SENTENCES } from "@speak-coach/shared/content";
import { alignWords, computeReadingStats } from "../services/wordAlignment";
import { transcribeAudio } from "../services/transcription";
import { createId, nowIso } from "../utils";

const app = new Hono<{ Bindings: Env }>();

function isFileLike(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    typeof (value as { arrayBuffer?: unknown }).arrayBuffer === "function"
  );
}

app.get("/sentence", async (c) => {
  const dayIndex = Math.floor(Date.now() / 86400000) % SHADOWING_SENTENCES.length;
  const sentence = SHADOWING_SENTENCES[dayIndex];
  return c.json({ sentence });
});

app.get("/history", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, reference_text, word_accuracy_pct, pace_match_pct, volume_match_pct, overall_score, created_at
     FROM shadowing_attempts ORDER BY created_at DESC LIMIT 10`
  ).all();
  return c.json({ attempts: rows.results ?? [] });
});

app.post("/attempt", async (c) => {
  const formData = await c.req.formData();
  const referenceText = String(formData.get("referenceText") ?? "");
  let transcript = String(formData.get("transcript") ?? "");
  const analyticsJson = formData.get("analytics") ? String(formData.get("analytics")) : null;
  const audio = formData.get("audio");

  if (!referenceText) return c.json({ error: "referenceText required" }, 400);

  let r2Key: string | null = null;
  if (isFileLike(audio) && audio.size > 0) {
    r2Key = `shadowing/${createId()}.webm`;
    const buffer = await audio.arrayBuffer();
    await c.env.VOICE.put(r2Key, buffer, {
      httpMetadata: { contentType: audio.type || "audio/webm" },
    });
    if (!transcript) {
      transcript = await transcribeAudio(c.env.AI, buffer);
    }
  }

  const alignment = alignWords(referenceText, transcript || "");
  const stats = computeReadingStats(alignment);
  const analytics = analyticsJson ? JSON.parse(analyticsJson) : null;

  const mismatched = alignment
    .filter((a) => a.status === "wrong")
    .map((a) => ({ expected: a.word, spoken: a.spoken ?? "?" }));

  const wordAccuracyPct = Math.round(stats.accuracy * 10) / 10;
  const volumeMatchPct = analytics?.loudnessScore ?? 70;
  const clarityScore = analytics?.clarityScore ?? 70;
  const paceMatchPct = analytics?.paceWpm
    ? Math.min(100, Math.round((analytics.paceWpm / 140) * 100))
    : 75;
  const overallScore = Math.round(
    wordAccuracyPct * 0.4 + volumeMatchPct * 0.25 + clarityScore * 0.2 + paceMatchPct * 0.15
  );

  const id = createId();
  const now = nowIso();

  await c.env.DB.prepare(
    `INSERT INTO shadowing_attempts (
      id, reference_text, r2_key, transcript, word_accuracy_pct, pace_match_pct,
      volume_match_pct, clarity_score, overall_score, mismatched_words_json, analytics_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      referenceText,
      r2Key,
      transcript,
      wordAccuracyPct,
      paceMatchPct,
      volumeMatchPct,
      clarityScore,
      overallScore,
      JSON.stringify(mismatched),
      analyticsJson,
      now
    )
    .run();

  return c.json({
    id,
    referenceText,
    transcript,
    wordAccuracyPct,
    paceMatchPct,
    volumeMatchPct,
    clarityScore,
    overallScore,
    mismatchedWords: mismatched,
  });
});

export default app;
