import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import type { AnalyticsMixSlice, AnalyticsPeriodStat, AnalyticsScorePoint } from "@speak-coach/shared";
import { todayDate } from "../utils";
import { generateInsights } from "../services/insights";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  live_speak: "Live Speaking",
  challenge: "60s Challenge",
  practice: "Voice Practice",
  session: "Daily Session",
  shadowing: "Shadowing",
  paragraph_read: "Read Aloud",
  roleplay: "Roleplay",
};

app.get("/", async (c) => {
  const userId = c.get("userId");
  const user = await c.env.DB.prepare(`SELECT start_date FROM users WHERE id = ?`)
    .bind(userId)
    .first<{
    start_date: string;
  }>();
  const startDate = user?.start_date ? new Date(user.start_date) : new Date();
  const dayNumber = Math.floor((Date.now() - startDate.getTime()) / 86400000) + 1;

  const settings = await c.env.DB.prepare(
    `SELECT daily_goal_minutes FROM user_settings WHERE user_id = ?`
  )
    .bind(userId)
    .first<{ daily_goal_minutes: number }>();

  const counts = await c.env.DB.prepare(
    `SELECT
      (SELECT COUNT(*) FROM sessions WHERE user_id = ?) as sessions,
      (SELECT COUNT(*) FROM corrections c WHERE c.session_id IN (SELECT id FROM sessions WHERE user_id = ?)) as corrections,
      (SELECT COUNT(*) FROM voice_recordings v WHERE v.session_id IN (SELECT id FROM sessions WHERE user_id = ?)) as recordings,
      (SELECT COUNT(*) FROM shadowing_attempts) as shadowing,
      (SELECT COUNT(*) FROM paragraph_writes p WHERE p.session_id IN (SELECT id FROM sessions WHERE user_id = ?)) as writes,
      (SELECT COUNT(*) FROM paragraph_reads p WHERE p.session_id IN (SELECT id FROM sessions WHERE user_id = ?)) as reads`
  )
    .bind(userId, userId, userId, userId, userId)
    .first<{
    sessions: number;
    corrections: number;
    recordings: number;
    shadowing: number;
    writes: number;
    reads: number;
  }>();

  const today = todayDate();
  const todayMinutes = await c.env.DB.prepare(
    `SELECT COALESCE(SUM(v.duration_sec), 0) as sec
     FROM voice_recordings v
     WHERE date(v.created_at) = ?
       AND v.session_id IN (SELECT id FROM sessions WHERE user_id = ?)`
  )
    .bind(today, userId)
    .first<{ sec: number }>();

  const totalMinutes = await c.env.DB.prepare(
    `SELECT COALESCE(SUM(v.duration_sec), 0) as sec
     FROM voice_recordings v
     WHERE v.session_id IN (SELECT id FROM sessions WHERE user_id = ?)`
  )
    .bind(userId)
    .first<{ sec: number }>();

  const fluencyTrend = await c.env.DB.prepare(
    `SELECT date,
      AVG(COALESCE(pronunciation_score, 0)) as pronunciation,
      AVG(COALESCE(roman_hindi_score, 0)) as roman_hindi,
      AVG(COALESCE(loudness_score, 0)) as loudness
     FROM sessions WHERE user_id = ?
     GROUP BY date ORDER BY date DESC LIMIT 30`
  )
    .bind(userId)
    .all();

  const activityByDay = await c.env.DB.prepare(
    `SELECT date(created_at) as date, COUNT(*) as count
     FROM voice_recordings
     WHERE session_id IN (SELECT id FROM sessions WHERE user_id = ?)
     GROUP BY date(created_at)
     ORDER BY date DESC LIMIT 30`
  )
    .bind(userId)
    .all();

  const correctionsByType = await c.env.DB.prepare(
    `SELECT c.type, COUNT(*) as count
     FROM corrections c
     WHERE c.session_id IN (SELECT id FROM sessions WHERE user_id = ?)
     GROUP BY c.type`
  )
    .bind(userId)
    .all();

  const topMistakes = await c.env.DB.prepare(
    `SELECT wrong_form, correct_form, repeat_count FROM mistakes
     ORDER BY repeat_count DESC LIMIT 8`
  ).all();

  const mastered = await c.env.DB.prepare(
    `SELECT COUNT(*) as c FROM mistakes WHERE mastered_at IS NOT NULL`
  ).first<{ c: number }>();

  const avgVoice = await c.env.DB.prepare(
    `SELECT AVG(loudness_score) as loudness, AVG(clarity_score) as clarity, AVG(pace_wpm) as pace
     FROM voice_recordings
     WHERE session_id IN (SELECT id FROM sessions WHERE user_id = ?)`
  )
    .bind(userId)
    .first<{ loudness: number; clarity: number; pace: number }>();

  const weeklyRows = await c.env.DB.prepare(
    `SELECT strftime('%Y-%W', date) as period_key,
      MIN(date) as start_date,
      COUNT(*) as sessions,
      AVG(COALESCE(pronunciation_score, 0)) as pronunciation,
      AVG(COALESCE(loudness_score, 0)) as loudness
     FROM sessions WHERE user_id = ? AND date >= date('now', '-56 days')
     GROUP BY period_key ORDER BY period_key ASC`
  )
    .bind(userId)
    .all();

  const monthlyRows = await c.env.DB.prepare(
    `SELECT strftime('%Y-%m', date) as period_key,
      COUNT(*) as sessions,
      AVG(COALESCE(pronunciation_score, 0)) as pronunciation,
      AVG(COALESCE(loudness_score, 0)) as loudness
     FROM sessions WHERE user_id = ? AND date >= date('now', '-365 days')
     GROUP BY period_key ORDER BY period_key ASC`
  )
    .bind(userId)
    .all();

  const weeklyVoice = await c.env.DB.prepare(
    `SELECT strftime('%Y-%W', date(created_at)) as period_key,
      COUNT(*) as recordings,
      COALESCE(SUM(duration_sec), 0) as sec,
      AVG(clarity_score) as clarity,
      AVG(loudness_score) as loudness
     FROM voice_recordings
     WHERE date(created_at) >= date('now', '-56 days')
       AND session_id IN (SELECT id FROM sessions WHERE user_id = ?)
     GROUP BY period_key`
  )
    .bind(userId)
    .all();

  const monthlyVoice = await c.env.DB.prepare(
    `SELECT strftime('%Y-%m', date(created_at)) as period_key,
      COUNT(*) as recordings,
      COALESCE(SUM(duration_sec), 0) as sec,
      AVG(clarity_score) as clarity,
      AVG(loudness_score) as loudness
     FROM voice_recordings
     WHERE date(created_at) >= date('now', '-365 days')
       AND session_id IN (SELECT id FROM sessions WHERE user_id = ?)
     GROUP BY period_key`
  )
    .bind(userId)
    .all();

  const weeklyCorrections = await c.env.DB.prepare(
    `SELECT strftime('%Y-%W', date(created_at)) as period_key, COUNT(*) as count
     FROM corrections
     WHERE date(created_at) >= date('now', '-56 days')
       AND session_id IN (SELECT id FROM sessions WHERE user_id = ?)
     GROUP BY period_key`
  )
    .bind(userId)
    .all();

  const monthlyCorrections = await c.env.DB.prepare(
    `SELECT strftime('%Y-%m', date(created_at)) as period_key, COUNT(*) as count
     FROM corrections
     WHERE date(created_at) >= date('now', '-365 days')
       AND session_id IN (SELECT id FROM sessions WHERE user_id = ?)
     GROUP BY period_key`
  )
    .bind(userId)
    .all();

  const voiceByCategory = await c.env.DB.prepare(
    `SELECT COALESCE(category, 'general') as category, COUNT(*) as count
     FROM voice_recordings
     WHERE session_id IN (SELECT id FROM sessions WHERE user_id = ?)
     GROUP BY category`
  )
    .bind(userId)
    .all();

  const goalMinutes = settings?.daily_goal_minutes ?? 15;
  const todayMin = Math.round((todayMinutes?.sec ?? 0) / 60);

  const voiceWeekMap = mapByKey(weeklyVoice.results ?? [], "period_key");
  const voiceMonthMap = mapByKey(monthlyVoice.results ?? [], "period_key");
  const corrWeekMap = mapByKey(weeklyCorrections.results ?? [], "period_key");
  const corrMonthMap = mapByKey(monthlyCorrections.results ?? [], "period_key");

  const weeklyStats = buildPeriodStats(
    weeklyRows.results ?? [],
    voiceWeekMap,
    corrWeekMap,
    "week"
  );
  const monthlyStats = buildPeriodStats(
    monthlyRows.results ?? [],
    voiceMonthMap,
    corrMonthMap,
    "month"
  );

  const practiceMix = buildPracticeMix(counts, voiceByCategory.results ?? []);

  return c.json({
    dayNumber,
    goalMinutes,
    todayMinutes: todayMin,
    goalProgressPct: Math.min(100, Math.round((todayMin / goalMinutes) * 100)),
    totals: {
      sessions: counts?.sessions ?? 0,
      corrections: counts?.corrections ?? 0,
      recordings: counts?.recordings ?? 0,
      shadowing: counts?.shadowing ?? 0,
      paragraphWrites: counts?.writes ?? 0,
      paragraphReads: counts?.reads ?? 0,
      speakingMinutes: Math.round((totalMinutes?.sec ?? 0) / 60),
      mistakesMastered: mastered?.c ?? 0,
    },
    averages: {
      loudness: Math.round(avgVoice?.loudness ?? 0),
      clarity: Math.round(avgVoice?.clarity ?? 0),
      paceWpm: Math.round(avgVoice?.pace ?? 0),
    },
    fluencyTrend: (fluencyTrend.results ?? [])
      .map((r) => ({
        date: String(r.date),
        pronunciation: Math.round(Number(r.pronunciation ?? 0)),
        romanHindi: Math.round(Number(r.roman_hindi ?? 0)),
        loudness: Math.round(Number(r.loudness ?? 0)),
      }))
      .reverse(),
    activityByDay: (activityByDay.results ?? [])
      .map((r) => ({
        date: String(r.date),
        recordings: Number(r.count),
      }))
      .reverse(),
    correctionsByType: (correctionsByType.results ?? []).map((r) => ({
      type: String(r.type),
      count: Number(r.count),
    })),
    topMistakes: (topMistakes.results ?? []).map((m) => ({
      wrong: String(m.wrong_form),
      correct: String(m.correct_form),
      count: Number(m.repeat_count),
    })),
    weeklyStats,
    monthlyStats,
    practiceMix,
    scoreTrendWeekly: weeklyStats.map((w) => ({
      label: w.label,
      pronunciation: w.avgPronunciation,
      clarity: w.avgClarity,
      loudness: w.avgLoudness ?? w.avgClarity,
    })),
  });
});

function mapByKey(rows: Record<string, unknown>[], key: string) {
  const map = new Map<string, Record<string, unknown>>();
  for (const r of rows) map.set(String(r[key]), r);
  return map;
}

function buildPeriodStats(
  sessionRows: Record<string, unknown>[],
  voiceMap: Map<string, Record<string, unknown>>,
  corrMap: Map<string, Record<string, unknown>>,
  mode: "week" | "month"
): AnalyticsPeriodStat[] {
  return sessionRows.map((r) => {
    const key = String(r.period_key);
    const voice = voiceMap.get(key);
    const corr = corrMap.get(key);
    const startDate = r.start_date ? String(r.start_date) : key;
    return {
      label: formatPeriodLabel(key, startDate, mode),
      periodKey: key,
      sessions: Number(r.sessions ?? 0),
      recordings: Number(voice?.recordings ?? 0),
      minutes: Math.round(Number(voice?.sec ?? 0) / 60),
      corrections: Number(corr?.count ?? 0),
      avgPronunciation: Math.round(Number(r.pronunciation ?? 0)),
      avgClarity: Math.round(Number(voice?.clarity ?? r.loudness ?? 0)),
      avgLoudness: Math.round(Number(voice?.loudness ?? r.loudness ?? 0)),
    };
  });
}

function formatPeriodLabel(key: string, startDate: string, mode: "week" | "month"): string {
  if (mode === "month") {
    try {
      const [y, m] = key.split("-");
      return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("en", { month: "short", year: "2-digit" });
    } catch {
      return key;
    }
  }
  try {
    const d = new Date(startDate);
    return d.toLocaleDateString("en", { month: "short", day: "numeric" });
  } catch {
    return `W${key.split("-")[1] ?? key}`;
  }
}

function buildPracticeMix(
  counts: {
    sessions: number;
    shadowing: number;
    writes: number;
    reads: number;
    corrections: number;
  } | null,
  voiceCategories: Record<string, unknown>[]
): AnalyticsMixSlice[] {
  const mix: AnalyticsMixSlice[] = [];

  if ((counts?.sessions ?? 0) > 0) {
    mix.push({ id: "sessions", label: "Daily Sessions", value: counts!.sessions });
  }
  for (const row of voiceCategories) {
    const cat = String(row.category ?? "general");
    const count = Number(row.count ?? 0);
    if (count > 0) {
      mix.push({
        id: cat,
        label: CATEGORY_LABELS[cat] ?? cat,
        value: count,
      });
    }
  }
  if ((counts?.shadowing ?? 0) > 0) {
    mix.push({ id: "shadowing", label: "Shadowing", value: counts!.shadowing });
  }
  if ((counts?.writes ?? 0) > 0) {
    mix.push({ id: "writes", label: "Paragraph Write", value: counts!.writes });
  }
  if ((counts?.reads ?? 0) > 0) {
    mix.push({ id: "reads", label: "Paragraph Read", value: counts!.reads });
  }
  if ((counts?.corrections ?? 0) > 0) {
    mix.push({ id: "corrections", label: "Corrections", value: counts!.corrections });
  }

  return mix.sort((a, b) => b.value - a.value);
}

app.get("/insights", async (c) => {
  const userId = c.get("userId");
  const statsRes = await c.env.DB.prepare(
    `SELECT
      (SELECT COUNT(*) FROM sessions WHERE user_id = ?) as sessions,
      (SELECT COUNT(*) FROM corrections c WHERE c.session_id IN (SELECT id FROM sessions WHERE user_id = ?)) as corrections,
      (SELECT COUNT(*) FROM voice_recordings v WHERE v.session_id IN (SELECT id FROM sessions WHERE user_id = ?)) as recordings,
      (SELECT wrong_form FROM mistakes ORDER BY repeat_count DESC LIMIT 1) as top_mistake`
  )
    .bind(userId, userId, userId)
    .first<{
    sessions: number;
    corrections: number;
    recordings: number;
    top_mistake: string;
  }>();

  const insights = await generateInsights(c.env.AI, {
    sessions: statsRes?.sessions ?? 0,
    corrections: statsRes?.corrections ?? 0,
    recordings: statsRes?.recordings ?? 0,
    topMistake: statsRes?.top_mistake ?? "none",
  });

  return c.json({ insights });
});

export default app;
