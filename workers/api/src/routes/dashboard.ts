import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { computeFluencyScore } from "../services/fluencyScore";
import { todayDate } from "../utils";

const LEVELS = [
  { min: 0, name: "Beginner" },
  { min: 200, name: "Learner" },
  { min: 500, name: "Improving" },
  { min: 1000, name: "Confident" },
  { min: 2000, name: "Fluent" },
];

function getLevel(xp: number) {
  let level = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.min) level = l;
  }
  return level;
}

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const { getStreakInfo } = await import("../services/streak");
  const streakInfo = await getStreakInfo(c.env.DB, userId);

  const sessionCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as c FROM sessions WHERE user_id = ? AND completed_steps >= 10`
  )
    .bind(userId)
    .first<{ c: number }>();
  const hasCompletedSessions = (sessionCount?.c ?? 0) > 0;

  const scores = await c.env.DB.prepare(
    `SELECT date, pronunciation_score, roman_hindi_score, spoken_en_score, spoken_hi_score, loudness_score
     FROM sessions
     WHERE user_id = ?
       AND completed_steps >= 10
       AND roman_hindi_score IS NOT NULL
     ORDER BY date DESC LIMIT 7`
  )
    .bind(userId)
    .all();

  const topMistakes = await c.env.DB.prepare(
    `SELECT wrong_form, correct_form, repeat_count FROM mistakes ORDER BY repeat_count DESC LIMIT 5`
  ).all();

  const today = todayDate();
  const todaySession = await c.env.DB.prepare(
    `SELECT completed_steps FROM sessions WHERE user_id = ? AND date = ?`
  )
    .bind(userId, today)
    .first<{ completed_steps: number }>();

  const user = await c.env.DB.prepare(`SELECT start_date FROM users WHERE id = ?`)
    .bind(userId)
    .first<{
      start_date: string;
    }>();

  const startDate = user?.start_date ? new Date(user.start_date) : new Date();
  const dayNumber = Math.floor((Date.now() - startDate.getTime()) / 86400000) + 1;

  const recentScores = (scores.results ?? []).map((s) => ({
    date: String(s.date),
    pronunciation: Number(s.pronunciation_score ?? 0),
    romanHindi: Number(s.roman_hindi_score ?? 0),
    spokenEn: Number(s.spoken_en_score ?? 0),
    spokenHi: Number(s.spoken_hi_score ?? 0),
    loudness: Number(s.loudness_score ?? 0),
  }));

  const avgRoman = recentScores.length > 0 ? recentScores.reduce((a, s) => a + s.romanHindi, 0) / recentScores.length : 70;
  const correctionCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as c
     FROM corrections c
     WHERE c.session_id IN (SELECT id FROM sessions WHERE user_id = ?)`
  )
    .bind(userId)
    .first<{ c: number }>();
  const recordingCount = await c.env.DB.prepare(
    `SELECT COUNT(*) as c
     FROM voice_recordings v
     WHERE v.session_id IN (SELECT id FROM sessions WHERE user_id = ?)`
  )
    .bind(userId)
    .first<{ c: number }>();
  const shadowCount = await c.env.DB.prepare(`SELECT COUNT(*) as c FROM shadowing_attempts`).first<{ c: number }>();

  const xp =
    (sessionCount?.c ?? 0) * 50 +
    (correctionCount?.c ?? 0) * 10 +
    (recordingCount?.c ?? 0) * 20 +
    (shadowCount?.c ?? 0) * 30;

  const levelInfo = getLevel(xp);
  const level = LEVELS.indexOf(levelInfo) + 1;

  const voiceTrend = await c.env.DB.prepare(
    `SELECT date(created_at) as date, AVG(loudness_score) as loudness, AVG(clarity_score) as clarity
     FROM voice_recordings
     WHERE session_id IN (SELECT id FROM sessions WHERE user_id = ?)
     GROUP BY date(created_at) ORDER BY date DESC LIMIT 7`
  )
    .bind(userId)
    .all();

  const badges = [
    { id: "first_session", name: "First Session", earned: (sessionCount?.c ?? 0) >= 1 },
    { id: "week_streak", name: "7-Day Streak", earned: streakInfo.streak >= 7 },
    { id: "voice_hero", name: "Voice Hero", earned: (recordingCount?.c ?? 0) >= 10 },
    { id: "mistake_fixer", name: "Mistake Fixer", earned: (correctionCount?.c ?? 0) >= 20 },
    { id: "shadow_master", name: "Shadow Master", earned: (shadowCount?.c ?? 0) >= 5 },
    { id: "day_30", name: "30-Day Milestone", earned: dayNumber >= 30 },
  ];

  const correctionsToday = await c.env.DB.prepare(
    `SELECT COUNT(*) as c
     FROM corrections c
     WHERE date(c.created_at) = ?
       AND c.session_id IN (SELECT id FROM sessions WHERE user_id = ?)`
  )
    .bind(today, userId)
    .first<{ c: number }>();

  return c.json({
    streak: streakInfo.streak,
    practicedToday: streakInfo.practicedToday,
    freezesAvailable: streakInfo.freezesAvailable,
    totalPracticeDays: streakInfo.totalPracticeDays,
    dayNumber,
    todaySessionComplete: (todaySession?.completed_steps ?? 0) >= 10,
    fluencyScore: hasCompletedSessions
      ? computeFluencyScore({
          romanHindiAccuracy: avgRoman,
          streakDays: streakInfo.streak,
        })
      : 0,
    recentScores,
    topMistakes: (topMistakes.results ?? []).map((m) => ({
      wrong: String(m.wrong_form),
      correct: String(m.correct_form),
      repeatCount: Number(m.repeat_count),
    })),
    totalSessions: sessionCount?.c ?? 0,
    correctionsToday: correctionsToday?.c ?? 0,
    gamification: {
      xp,
      level,
      levelName: levelInfo.name,
      badges,
      voiceTrend: (voiceTrend.results ?? []).map((v) => ({
        date: String(v.date),
        loudness: Math.round(Number(v.loudness ?? 0)),
        clarity: Math.round(Number(v.clarity ?? 0)),
      })),
    },
  });
});

export default app;
