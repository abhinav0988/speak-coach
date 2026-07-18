import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { analyzeParagraph } from "../services/paragraphAnalyzer";
import { getDayNumber, getDayParagraph } from "../services/curriculum";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

function isFileLike(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    typeof (value as { arrayBuffer?: unknown }).arrayBuffer === "function"
  );
}

app.post("/write", async (c) => {
  const body = await c.req.json<{
    text: string;
    language: "english" | "roman_hindi";
    sessionId?: string;
  }>();

  if (!body.text?.trim()) return c.json({ error: "Text is required" }, 400);
  const wordCount = body.text.trim().split(/\s+/).length;
  if (wordCount < 5) return c.json({ error: "Minimum 5 words required" }, 400);
  if (wordCount > 500) return c.json({ error: "Maximum 500 words allowed" }, 400);

  const result = await analyzeParagraph(c.env.DB, body);
  return c.json(result);
});

app.get("/writes", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, language, input_text, corrected_text, total_words, mistake_count, accuracy_pct, created_at
     FROM paragraph_writes ORDER BY created_at DESC LIMIT 20`
  ).all();
  return c.json({ writes: rows.results ?? [] });
});

app.get("/daily", async (c) => {
  const dayNumber = await getDayNumber(c.env.DB, c.get("userId"));
  const paragraph = await getDayParagraph(c.env.DB, dayNumber);
  return c.json({ dayNumber, paragraph });
});

app.post("/read", async (c) => {
  const formData = await c.req.formData();
  const sourceText = String(formData.get("sourceText") ?? "");
  const sourceLanguage = String(formData.get("sourceLanguage") ?? "roman_hindi");
  const transcript = String(formData.get("transcript") ?? "");
  const sessionId = formData.get("sessionId") ? String(formData.get("sessionId")) : null;
  const analyticsJson = formData.get("analytics") ? String(formData.get("analytics")) : null;
  const audio = formData.get("audio");

  if (!sourceText.trim()) return c.json({ error: "sourceText is required" }, 400);

  const { alignWords, computeReadingStats, countFillerWords } = await import(
    "../services/wordAlignment"
  );
  const { transcribeAudio } = await import("../services/transcription");
  const { createId, nowIso, countWords } = await import("../utils");

  const id = createId();
  let r2Key: string | null = null;
  let finalTranscript = transcript;

  if (isFileLike(audio) && audio.size > 0) {
    r2Key = `recordings/${id}.webm`;
    const buffer = await audio.arrayBuffer();
    await c.env.VOICE.put(r2Key, buffer, {
      httpMetadata: { contentType: audio.type || "audio/webm" },
    });
    if (!finalTranscript) {
      finalTranscript = await transcribeAudio(c.env.AI, buffer);
    }
  }

  if (!finalTranscript) finalTranscript = sourceText;

  const alignment = alignWords(sourceText, finalTranscript);
  const stats = computeReadingStats(alignment);
  const fillers = countFillerWords(finalTranscript);
  const totalWords = countWords(sourceText);
  const now = nowIso();

  const analytics = analyticsJson ? JSON.parse(analyticsJson) : null;
  const durationSec = analytics?.speakingTimeMs ? analytics.speakingTimeMs / 1000 : 60;
  const wpm = finalTranscript ? countWords(finalTranscript) / (durationSec / 60) : 0;

  await c.env.DB.prepare(
    `INSERT INTO paragraph_reads (
      id, session_id, source_text, source_language, r2_key, transcript,
      total_words, correct_words, wrong_words, skipped_words, extra_words,
      pronunciation_accuracy_pct, grammar_error_count, filler_word_count,
      words_per_minute, loudness_score, clarity_score, pitch_variety_score,
      alignment_json, voice_analytics_json, suggested_correction, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      sessionId,
      sourceText,
      sourceLanguage,
      r2Key,
      finalTranscript,
      totalWords,
      stats.correct,
      stats.wrong,
      stats.skipped,
      stats.extra,
      Math.round(stats.accuracy * 10) / 10,
      fillers,
      Math.round(wpm),
      analytics?.loudnessScore ?? null,
      analytics?.clarityScore ?? null,
      analytics?.pitchVarietyScore ?? null,
      JSON.stringify(alignment),
      analyticsJson,
      finalTranscript,
      now
    )
    .run();

  return c.json({
    id,
    totalWords,
    correctWords: stats.correct,
    wrongWords: stats.wrong,
    skippedWords: stats.skipped,
    extraWords: stats.extra,
    pronunciationAccuracyPct: Math.round(stats.accuracy * 10) / 10,
    grammarErrorCount: 0,
    fillerWordCount: fillers,
    wordsPerMinute: Math.round(wpm),
    alignment,
    grammarFixes: [],
    suggestedCorrection: sourceText,
    transcript: finalTranscript,
    voiceAnalytics: analytics,
  });
});

app.get("/writes/:id", async (c) => {
  const id = c.req.param("id");
  const row = await c.env.DB.prepare(
    `SELECT id, language, input_text, corrected_text, total_words, mistake_count,
            spelling_errors, grammar_errors, roman_hindi_errors, accuracy_pct, diff_json, mistakes_json, created_at
     FROM paragraph_writes WHERE id = ?`
  )
    .bind(id)
    .first();

  if (!row) return c.json({ error: "Not found" }, 404);

  let diff = [];
  let mistakes = [];
  try {
    diff = row.diff_json ? JSON.parse(String(row.diff_json)) : [];
    mistakes = row.mistakes_json ? JSON.parse(String(row.mistakes_json)) : [];
  } catch {
    /* ignore */
  }

  return c.json({
    id: String(row.id),
    language: String(row.language),
    inputText: String(row.input_text),
    correctedText: String(row.corrected_text),
    totalWords: Number(row.total_words),
    mistakeCount: Number(row.mistake_count),
    spellingErrors: Number(row.spelling_errors ?? 0),
    grammarErrors: Number(row.grammar_errors ?? 0),
    romanHindiErrors: Number(row.roman_hindi_errors ?? 0),
    accuracyPct: Number(row.accuracy_pct),
    diff,
    mistakes,
    createdAt: String(row.created_at),
  });
});

app.get("/reads/:id", async (c) => {
  const id = c.req.param("id");
  const row = await c.env.DB.prepare(
    `SELECT id, source_text, source_language, transcript, total_words, correct_words, wrong_words,
            skipped_words, extra_words, pronunciation_accuracy_pct, filler_word_count, words_per_minute,
            loudness_score, clarity_score, alignment_json, voice_analytics_json, created_at
     FROM paragraph_reads WHERE id = ?`
  )
    .bind(id)
    .first();

  if (!row) return c.json({ error: "Not found" }, 404);

  let alignment = [];
  try {
    alignment = row.alignment_json ? JSON.parse(String(row.alignment_json)) : [];
  } catch {
    /* ignore */
  }

  return c.json({
    id: String(row.id),
    sourceText: String(row.source_text),
    sourceLanguage: String(row.source_language),
    transcript: String(row.transcript ?? ""),
    totalWords: Number(row.total_words),
    correctWords: Number(row.correct_words),
    wrongWords: Number(row.wrong_words),
    skippedWords: Number(row.skipped_words),
    extraWords: Number(row.extra_words),
    pronunciationAccuracyPct: Number(row.pronunciation_accuracy_pct),
    fillerWordCount: Number(row.filler_word_count ?? 0),
    wordsPerMinute: Number(row.words_per_minute ?? 0),
    loudnessScore: row.loudness_score != null ? Number(row.loudness_score) : null,
    clarityScore: row.clarity_score != null ? Number(row.clarity_score) : null,
    alignment,
    createdAt: String(row.created_at),
  });
});

app.get("/reads", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, source_text, pronunciation_accuracy_pct, wrong_words, loudness_score, created_at
     FROM paragraph_reads ORDER BY created_at DESC LIMIT 20`
  ).all();
  return c.json({ reads: rows.results ?? [] });
});

export default app;
