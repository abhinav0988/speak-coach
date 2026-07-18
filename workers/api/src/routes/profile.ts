import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { getDayNumber } from "../services/curriculum";
import { getStreakInfo } from "../services/streak";
import { computeFluencyScore } from "../services/fluencyScore";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const user = await c.env.DB.prepare(
    `SELECT id, name, email, start_date, target_days FROM users WHERE id = ?`
  )
    .bind(userId)
    .first<{
      id: string;
      name: string;
      email: string | null;
      start_date: string;
      target_days: number;
    }>();

  if (!user) return c.json({ error: "User not found" }, 404);

  const [dayNumber, streakInfo, sessions, sessionAverages, voiceAverages] = await Promise.all([
    getDayNumber(c.env.DB, userId),
    getStreakInfo(c.env.DB, userId),
    c.env.DB
      .prepare(`SELECT COUNT(*) as count FROM sessions WHERE user_id = ? AND completed_steps >= 10`)
      .bind(userId)
      .first<{ count: number }>(),
    c.env.DB
      .prepare(
        `SELECT
          AVG(roman_hindi_score) as romanHindiAccuracy,
          AVG(pronunciation_score) as pronunciationAccuracy
         FROM sessions
         WHERE user_id = ?`
      )
      .bind(userId)
      .first<{ romanHindiAccuracy: number | null; pronunciationAccuracy: number | null }>(),
    c.env.DB
      .prepare(
        `SELECT
          AVG(loudness_score) as loudnessScore,
          AVG(clarity_score) as clarityScore
         FROM voice_recordings`
      )
      .first<{ loudnessScore: number | null; clarityScore: number | null }>(),
  ]);

  const fluencyScore = computeFluencyScore({
    romanHindiAccuracy: sessionAverages?.romanHindiAccuracy ?? undefined,
    pronunciationAccuracy: sessionAverages?.pronunciationAccuracy ?? undefined,
    loudnessScore: voiceAverages?.loudnessScore ?? undefined,
    clarityScore: voiceAverages?.clarityScore ?? undefined,
    streakDays: streakInfo.streak,
  });

  return c.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email ?? "",
      startDate: user.start_date,
      targetDays: user.target_days,
    },
    stats: {
      dayNumber,
      streak: streakInfo.streak,
      totalSessions: sessions?.count ?? 0,
      fluencyScore,
      totalPracticeDays: streakInfo.totalPracticeDays,
    },
  });
});

app.patch("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ name?: string; email?: string }>();
  const name = body.name?.trim();
  if (name !== undefined && name.length < 2) {
    return c.json({ error: "Name must be at least 2 characters" }, 400);
  }

  await c.env.DB.prepare(
    `UPDATE users SET
      name = COALESCE(?, name),
      email = COALESCE(?, email)
    WHERE id = ?`
  )
    .bind(name ?? null, body.email?.trim() ?? null, userId)
    .run();

  const user = await c.env.DB.prepare(
    `SELECT id, name, email, start_date, target_days FROM users WHERE id = ?`
  )
    .bind(userId)
    .first<{
      id: string;
      name: string;
      email: string | null;
      start_date: string;
      target_days: number;
    }>();

  return c.json({
    profile: {
      id: user!.id,
      name: user!.name,
      email: user!.email ?? "",
      startDate: user!.start_date,
      targetDays: user!.target_days,
    },
  });
});

export default app;
