import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";

const WEEKS = 12;
const DAYS = WEEKS * 7;

function levelForDay(
  minutes: number,
  goalMinutes: number,
  sessionDone: boolean,
  recordings: number
): "none" | "light" | "moderate" | "active" | "intense" {
  if (minutes === 0 && recordings === 0 && !sessionDone) return "none";
  if (sessionDone && minutes >= goalMinutes * 2) return "intense";
  if (sessionDone || minutes >= goalMinutes) return "active";
  if (minutes >= goalMinutes * 0.5 || sessionDone) return "moderate";
  if (minutes > 0 || recordings > 0) return "light";
  return "none";
}

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (DAYS - 1));
  const startStr = start.toISOString().slice(0, 10);

  const settings = await c.env.DB.prepare(
    `SELECT daily_goal_minutes FROM user_settings WHERE user_id = ?`
  )
    .bind(userId)
    .first<{ daily_goal_minutes: number }>();
  const goalMinutes = settings?.daily_goal_minutes ?? 15;

  const recordings = await c.env.DB.prepare(
    `SELECT date(created_at) as date,
            COUNT(*) as count,
            COALESCE(SUM(duration_sec), 0) as total_sec
     FROM voice_recordings
     WHERE created_at >= ?
     GROUP BY date(created_at)`
  )
    .bind(start.toISOString())
    .all();

  const sessions = await c.env.DB.prepare(
    `SELECT date, completed_steps FROM sessions
     WHERE date >= ? AND user_id = ?`
  )
    .bind(startStr, userId)
    .all();

  const recordingMap = new Map(
    (recordings.results ?? []).map((r) => [
      String(r.date),
      { count: Number(r.count), minutes: Math.round(Number(r.total_sec) / 60) },
    ])
  );
  const sessionMap = new Map(
    (sessions.results ?? []).map((r) => [String(r.date), Number(r.completed_steps)])
  );

  const heatmap = Array.from({ length: DAYS }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const rec = recordingMap.get(dateStr);
    const minutes = rec?.minutes ?? 0;
    const recCount = rec?.count ?? 0;
    const completedSteps = sessionMap.get(dateStr) ?? 0;
    const sessionDone = completedSteps >= 10;
    const goalMet = minutes >= goalMinutes || sessionDone;

    return {
      date: dateStr,
      level: levelForDay(minutes, goalMinutes, sessionDone, recCount),
      minutes,
      recordings: recCount,
      sessionDone,
      goalMet,
    };
  });

  const activeDays = heatmap.filter((d) => d.level !== "none").length;
  const goalMetDays = heatmap.filter((d) => d.goalMet).length;
  const totalMinutes = heatmap.reduce((n, d) => n + d.minutes, 0);

  return c.json({
    heatmap,
    goalMinutes,
    summary: {
      activeDays,
      goalMetDays,
      totalMinutes,
      weeks: WEEKS,
    },
  });
});

export default app;
