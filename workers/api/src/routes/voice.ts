import { Hono } from "hono";
import type { Env } from "../env";
import type { VoiceLibraryItem, VoiceRecordingCategory } from "@speak-coach/shared";
import { createId, nowIso } from "../utils";
import { transcribeAudio } from "../services/transcription";

const app = new Hono<{ Bindings: Env }>();

const VALID_CATEGORIES = new Set<VoiceRecordingCategory>([
  "general",
  "live_speak",
  "challenge",
  "practice",
  "session",
  "shadowing",
  "paragraph_read",
  "roleplay",
]);

function isFileLike(value: unknown): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    typeof (value as { arrayBuffer?: unknown }).arrayBuffer === "function"
  );
}

function audioExtension(mime: string): string {
  if (mime.includes("m4a") || mime.includes("mp4")) return "m4a";
  if (mime.includes("caf")) return "caf";
  if (mime.includes("3gp")) return "3gp";
  if (mime.includes("wav")) return "wav";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "mp3";
  return "webm";
}

function normalizeCategory(raw: string | null | undefined): VoiceRecordingCategory {
  const c = (raw ?? "general").trim() as VoiceRecordingCategory;
  return VALID_CATEGORIES.has(c) ? c : "general";
}

function emptyCounts(): Record<VoiceRecordingCategory, number> {
  return {
    general: 0,
    live_speak: 0,
    challenge: 0,
    practice: 0,
    session: 0,
    shadowing: 0,
    paragraph_read: 0,
    roleplay: 0,
  };
}

function bumpCount(counts: Record<VoiceRecordingCategory, number>, category: VoiceRecordingCategory) {
  counts[category] = (counts[category] ?? 0) + 1;
}

app.get("/library", async (c) => {
  const categoryFilter = c.req.query("category");
  const limit = Math.min(100, Math.max(1, Number(c.req.query("limit") ?? 50)));

  const [voiceRows, shadowRows, paragraphRows] = await Promise.all([
    c.env.DB.prepare(
      `SELECT id, r2_key, duration_sec, transcript, category, loudness_score, clarity_score, created_at
       FROM voice_recordings ORDER BY created_at DESC LIMIT 200`
    ).all(),
    c.env.DB.prepare(
      `SELECT id, r2_key, transcript, reference_text, created_at
       FROM shadowing_attempts WHERE r2_key IS NOT NULL ORDER BY created_at DESC LIMIT 100`
    ).all(),
    c.env.DB.prepare(
      `SELECT id, r2_key, transcript, source_text, loudness_score, clarity_score, created_at
       FROM paragraph_reads WHERE r2_key IS NOT NULL ORDER BY created_at DESC LIMIT 100`
    ).all(),
  ]);

  const items: VoiceLibraryItem[] = [];

  for (const r of voiceRows.results ?? []) {
    const category = normalizeCategory(String(r.category ?? "general"));
    items.push({
      id: String(r.id),
      source: "voice",
      category,
      r2Key: r.r2_key ? String(r.r2_key) : null,
      transcript: String(r.transcript ?? ""),
      durationSec: r.duration_sec != null ? Number(r.duration_sec) : null,
      loudnessScore: r.loudness_score != null ? Number(r.loudness_score) : null,
      clarityScore: r.clarity_score != null ? Number(r.clarity_score) : null,
      createdAt: String(r.created_at),
      canDownload: !!r.r2_key,
    });
  }

  for (const r of shadowRows.results ?? []) {
    items.push({
      id: String(r.id),
      source: "shadowing",
      category: "shadowing",
      r2Key: r.r2_key ? String(r.r2_key) : null,
      transcript: String(r.transcript ?? r.reference_text ?? ""),
      durationSec: null,
      loudnessScore: null,
      clarityScore: null,
      createdAt: String(r.created_at),
      canDownload: !!r.r2_key,
      label: String(r.reference_text ?? "").slice(0, 60),
    });
  }

  for (const r of paragraphRows.results ?? []) {
    items.push({
      id: String(r.id),
      source: "paragraph",
      category: "paragraph_read",
      r2Key: r.r2_key ? String(r.r2_key) : null,
      transcript: String(r.transcript ?? r.source_text ?? ""),
      durationSec: null,
      loudnessScore: r.loudness_score != null ? Number(r.loudness_score) : null,
      clarityScore: r.clarity_score != null ? Number(r.clarity_score) : null,
      createdAt: String(r.created_at),
      canDownload: !!r.r2_key,
      label: String(r.source_text ?? "").slice(0, 60),
    });
  }

  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const counts = emptyCounts();
  for (const item of items) bumpCount(counts, item.category);

  const filtered =
    categoryFilter && categoryFilter !== "all"
      ? items.filter((i) => i.category === normalizeCategory(categoryFilter))
      : items;

  return c.json({
    total: items.length,
    counts,
    recordings: filtered.slice(0, limit),
  });
});

app.get("/:id/audio", async (c) => {
  const id = c.req.param("id");
  const source = c.req.query("source") ?? "voice";

  let r2Key: string | null = null;
  let filename = `speak-coach-${id}.webm`;

  if (source === "shadowing") {
    const row = await c.env.DB.prepare(`SELECT r2_key FROM shadowing_attempts WHERE id = ?`)
      .bind(id)
      .first<{ r2_key: string | null }>();
    r2Key = row?.r2_key ?? null;
    filename = `shadowing-${id}.webm`;
  } else if (source === "paragraph") {
    const row = await c.env.DB.prepare(`SELECT r2_key FROM paragraph_reads WHERE id = ?`)
      .bind(id)
      .first<{ r2_key: string | null }>();
    r2Key = row?.r2_key ?? null;
    filename = `paragraph-read-${id}.webm`;
  } else {
    const row = await c.env.DB.prepare(
      `SELECT r2_key, category FROM voice_recordings WHERE id = ?`
    )
      .bind(id)
      .first<{ r2_key: string | null; category: string | null }>();
    r2Key = row?.r2_key ?? null;
    const cat = normalizeCategory(row?.category ?? "general");
    filename = `${cat}-${id}.webm`;
  }

  if (!r2Key) return c.json({ error: "Recording not found" }, 404);

  const object = await c.env.VOICE.get(r2Key);
  if (!object) return c.json({ error: "Audio file missing" }, 404);

  const ext = r2Key.split(".").pop() ?? "webm";
  filename = filename.replace(/\.webm$/, `.${ext}`);

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  headers.set("Cache-Control", "private, max-age=3600");

  return new Response(object.body, { headers });
});

app.get("/timeline", async (c) => {
  const { buildUnifiedTimeline } = await import("../services/unifiedTimeline");
  return c.json(await buildUnifiedTimeline(c.env.DB));
});

app.get("/", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, duration_sec, transcript, language, category, loudness_score, clarity_score, pace_wpm, filler_count, created_at
     FROM voice_recordings ORDER BY created_at DESC LIMIT 20`
  ).all();
  return c.json({ recordings: rows.results ?? [] });
});

app.post("/upload", async (c) => {
  const formData = await c.req.formData();
  const audio = formData.get("audio");
  const transcript = String(formData.get("transcript") ?? "");
  const language = String(formData.get("language") ?? "mixed");
  const sessionId = formData.get("sessionId") ? String(formData.get("sessionId")) : null;
  const analyticsJson = formData.get("analytics") ? String(formData.get("analytics")) : null;
  const category = normalizeCategory(String(formData.get("category") ?? "general"));

  if (!isFileLike(audio)) return c.json({ error: "audio file required" }, 400);

  const id = createId();
  const contentType = audio.type || "audio/webm";
  const r2Key = `voice/${category}/${id}.${audioExtension(contentType)}`;
  const audioBuffer = await audio.arrayBuffer();
  await c.env.VOICE.put(r2Key, audioBuffer, {
    httpMetadata: { contentType },
  });

  const analytics = analyticsJson ? JSON.parse(analyticsJson) : null;
  let finalTranscript = transcript;
  if (!finalTranscript) {
    finalTranscript = await transcribeAudio(c.env.AI, audioBuffer);
  }

  const { scoreVoiceAnalytics } = await import("../services/voiceScoring");
  const scored = scoreVoiceAnalytics(analytics, finalTranscript);
  const now = nowIso();

  await c.env.DB.prepare(
    `INSERT INTO voice_recordings (
      id, session_id, r2_key, duration_sec, transcript, language, category,
      loudness_score, clarity_score, pace_wpm, pitch_avg_hz, filler_count, analytics_json, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      id,
      sessionId,
      r2Key,
      analytics?.speakingTimeMs ? Math.round(analytics.speakingTimeMs / 1000) : null,
      finalTranscript,
      language,
      category,
      scored.loudnessScore,
      scored.clarityScore,
      scored.paceWpm,
      scored.pitchAvgHz || null,
      scored.fillerCount,
      JSON.stringify(scored),
      now
    )
    .run();

  if (scored.sentences?.length) {
    for (const s of scored.sentences) {
      await c.env.DB.prepare(
        `INSERT INTO sentence_voice_metrics (
          id, recording_id, sentence_index, sentence_text, speaking_time_ms, pause_before_ms,
          volume_avg_dbfs, volume_peak_dbfs, pitch_avg_hz, pitch_std_hz,
          loudness_score, clarity_score, pace_wpm, tips_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
        .bind(
          createId(),
          id,
          s.sentenceIndex,
          s.sentenceText,
          s.speakingTimeMs,
          s.pauseBeforeMs,
          s.volumeAvgDbfs,
          s.volumePeakDbfs,
          s.pitchAvgHz,
          s.pitchStdHz,
          s.loudnessScore,
          s.clarityScore,
          s.paceWpm,
          JSON.stringify(s.tips),
          now
        )
        .run();
    }
  }

  return c.json({
    id,
    r2Key,
    category,
    transcript: finalTranscript,
    fillers: scored.fillerCount,
    analytics: scored,
  });
});

app.post("/transcribe-chunk", async (c) => {
  const formData = await c.req.formData();
  const audio = formData.get("audio");
  if (!isFileLike(audio) || audio.size === 0) {
    return c.json({ transcript: "", partial: true });
  }

  const buffer = await audio.arrayBuffer();
  const transcript = await transcribeAudio(c.env.AI, buffer);
  return c.json({ transcript, partial: true });
});

export default app;
