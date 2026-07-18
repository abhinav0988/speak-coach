import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { computeFluencyScore } from "../services/fluencyScore";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/backup", async (c) => {
  const tables = [
    "users", "sessions", "mistakes", "corrections", "paragraph_writes",
    "paragraph_reads", "voice_recordings", "shadowing_attempts", "homework",
    "journal_entries", "phrase_library", "vocabulary",
  ];

  const backup: Record<string, unknown[]> = {};

  for (const table of tables) {
    try {
      const rows = await c.env.DB.prepare(`SELECT * FROM ${table}`).all();
      backup[table] = rows.results ?? [];
    } catch {
      backup[table] = [];
    }
  }

  return c.json({
    exportedAt: new Date().toISOString(),
    version: "1.0",
    data: backup,
  });
});

app.get("/summary", async (c) => {
  const userId = c.get("userId");
  const user = await c.env.DB.prepare(`SELECT * FROM users WHERE id = ?`)
    .bind(userId)
    .first();
  const sessionCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as c FROM sessions WHERE user_id = ? AND completed_steps >= 10`
  )
    .bind(userId)
    .first<{ c: number }>();
  const mistakeCount = await c.env.DB.prepare(`SELECT COUNT(*) as c FROM mistakes`).first<{ c: number }>();
  const topMistakes = await c.env.DB.prepare(
    `SELECT wrong_form, correct_form, repeat_count FROM mistakes ORDER BY repeat_count DESC LIMIT 10`
  ).all();

  const avgScores = await c.env.DB.prepare(
    `SELECT AVG(pronunciation_score) as pron, AVG(roman_hindi_score) as rh, AVG(loudness_score) as loud
     FROM sessions WHERE user_id = ? AND pronunciation_score IS NOT NULL`
  )
    .bind(userId)
    .first<{ pron: number; rh: number; loud: number }>();

  const fluencyScore = computeFluencyScore({
    romanHindiAccuracy: avgScores?.rh ?? 70,
    pronunciationAccuracy: avgScores?.pron ?? 70,
    loudnessScore: avgScores?.loud ?? 60,
    streakDays: sessionCount?.c ?? 0,
  });

  return c.json({
    user,
    totalSessions: sessionCount?.c ?? 0,
    totalMistakes: mistakeCount?.c ?? 0,
    fluencyScore,
    topMistakes: topMistakes.results ?? [],
    generatedAt: new Date().toISOString(),
  });
});

export default app;
