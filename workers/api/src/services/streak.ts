import { todayDate } from "../utils";

export async function getSessionDates(db: D1Database, userId: string): Promise<string[]> {
  const rows = await db.prepare(
    `SELECT date FROM sessions WHERE user_id = ? AND completed_steps >= 10 ORDER BY date DESC`
  )
    .bind(userId)
    .all<{ date: string }>();
  return (rows.results ?? []).map((r) => String(r.date));
}

export function computeStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const sorted = [...new Set(dates)].sort().reverse();
  const today = todayDate();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  if (sorted[0] !== today && sorted[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1]);
    const curr = new Date(sorted[i]);
    const diff = (prev.getTime() - curr.getTime()) / 86400000;
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export async function getStreakInfo(db: D1Database, userId: string) {
  const dates = await getSessionDates(db, userId);
  const streak = computeStreak(dates);
  const today = todayDate();
  const practicedToday = dates.includes(today);

  const settings = await db.prepare(
    `SELECT streak_freezes, last_freeze_week FROM user_settings WHERE user_id = ?`
  )
    .bind(userId)
    .first<{ streak_freezes: number; last_freeze_week: string | null }>();

  const weekStart = getWeekStart();
  const freezesAvailable = settings?.last_freeze_week === weekStart ? 0 : (settings?.streak_freezes ?? 1);

  return {
    streak,
    practicedToday,
    freezesAvailable,
    longestStreak: streak,
    totalPracticeDays: dates.length,
  };
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().slice(0, 10);
}

export async function useStreakFreeze(db: D1Database, userId: string): Promise<{ ok: boolean; message: string }> {
  const weekStart = getWeekStart();
  const settings = await db.prepare(
    `SELECT streak_freezes, last_freeze_week FROM user_settings WHERE user_id = ?`
  )
    .bind(userId)
    .first<{ streak_freezes: number; last_freeze_week: string | null }>();

  if (settings?.last_freeze_week === weekStart) {
    return { ok: false, message: "Streak freeze already used this week" };
  }

  await db.prepare(
    `UPDATE user_settings SET last_freeze_week = ?, updated_at = ? WHERE user_id = ?`
  )
    .bind(weekStart, new Date().toISOString(), userId)
    .run();

  return { ok: true, message: "Streak freeze applied! Your streak is protected for today." };
}
