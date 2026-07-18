import { computeFluencyScore } from "./fluencyScore";
import { getStreakInfo } from "./streak";

export async function buildWeeklyReport(db: D1Database, userId: string) {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);
  const weekStartStr = weekStart.toISOString().slice(0, 10);
  const weekEndStr = now.toISOString().slice(0, 10);

  const settings = await db.prepare(
    `SELECT daily_goal_minutes FROM user_settings WHERE user_id = ?`
  )
    .bind(userId)
    .first<{ daily_goal_minutes: number }>();
  const dailyGoalMinutes = settings?.daily_goal_minutes ?? 15;

  const sessions = await db.prepare(
    `SELECT date, completed_steps FROM sessions
     WHERE date >= ? AND user_id = ?`
  )
    .bind(weekStartStr, userId)
    .all();

  const sessionRows = sessions.results ?? [];
  const sessionsCompleted = sessionRows.filter((s) => Number(s.completed_steps) >= 10).length;
  const sessionMap = new Map(
    sessionRows.map((s) => [String(s.date), Number(s.completed_steps)])
  );

  const corrections = await db.prepare(`SELECT COUNT(*) as count FROM corrections WHERE created_at >= ?`)
    .bind(weekStart.toISOString())
    .first<{ count: number }>();

  const recordings = await db.prepare(
    `SELECT date(created_at) as date,
            COUNT(*) as count,
            COALESCE(SUM(duration_sec), 0) as total_sec,
            AVG(loudness_score) as avg_loudness,
            AVG(clarity_score) as avg_clarity
     FROM voice_recordings
     WHERE created_at >= ?
     GROUP BY date(created_at)`
  )
    .bind(weekStart.toISOString())
    .all();

  const recordingRows = recordings.results ?? [];
  const recordingTotals = await db.prepare(
    `SELECT COUNT(*) as count,
            COALESCE(SUM(duration_sec), 0) as total_sec,
            AVG(loudness_score) as avg_loudness,
            AVG(clarity_score) as avg_clarity
     FROM voice_recordings WHERE created_at >= ?`
  )
    .bind(weekStart.toISOString())
    .first<{
      count: number;
      total_sec: number;
      avg_loudness: number;
      avg_clarity: number;
    }>();

  const recordingMap = new Map(
    recordingRows.map((r) => [
      String(r.date),
      { count: Number(r.count), minutes: Math.round(Number(r.total_sec) / 60) },
    ])
  );

  const dailyActivity = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dateStr = d.toISOString().slice(0, 10);
    const rec = recordingMap.get(dateStr);
    const minutes = rec?.minutes ?? 0;
    const recCount = rec?.count ?? 0;
    const sessionDone = (sessionMap.get(dateStr) ?? 0) >= 10;
    const goalMet = minutes >= dailyGoalMinutes || sessionDone;
    return { date: dateStr, minutes, recordings: recCount, sessionDone, goalMet };
  });

  const speakingMinutes = Math.round(Number(recordingTotals?.total_sec ?? 0) / 60);
  const daysGoalMet = dailyActivity.filter((d) => d.goalMet).length;

  const paragraphReads = await db.prepare(
    `SELECT AVG(pronunciation_accuracy_pct) as avg_acc FROM paragraph_reads WHERE created_at >= ?`
  )
    .bind(weekStart.toISOString())
    .first<{ avg_acc: number }>();

  const topMistakes = await db.prepare(
    `SELECT wrong_form, correct_form, repeat_count FROM mistakes
     WHERE last_seen_at >= ? ORDER BY repeat_count DESC LIMIT 5`
  )
    .bind(weekStart.toISOString())
    .all();

  const prevWeekReads = await db.prepare(
    `SELECT AVG(pronunciation_accuracy_pct) as avg_acc FROM paragraph_reads
     WHERE created_at >= ? AND created_at < ?`
  )
    .bind(new Date(weekStart.getTime() - 7 * 86400000).toISOString(), weekStart.toISOString())
    .first<{ avg_acc: number }>();

  const avgAccuracy = paragraphReads?.avg_acc ?? 0;
  const prevAccuracy = prevWeekReads?.avg_acc ?? 0;
  const improvements: string[] = [];
  const focusAreas: string[] = [];

  if (avgAccuracy > prevAccuracy && prevAccuracy > 0) {
    improvements.push(`Pronunciation accuracy improved by ${Math.round(avgAccuracy - prevAccuracy)}%`);
  }
  if ((recordingTotals?.avg_loudness ?? 0) > 60) improvements.push("Your voice loudness is in a good range");
  if (sessionsCompleted >= 5) improvements.push(`Completed ${sessionsCompleted} full practice sessions`);
  else if (sessionsCompleted > 0) improvements.push(`Completed ${sessionsCompleted} practice session${sessionsCompleted > 1 ? "s" : ""}`);
  if ((corrections?.count ?? 0) > 0) improvements.push(`Made ${corrections?.count} corrections — learning from mistakes`);
  if (daysGoalMet >= 5) improvements.push(`Hit your daily goal on ${daysGoalMet} of 7 days`);
  if (speakingMinutes >= dailyGoalMinutes * 3) improvements.push(`Logged ${speakingMinutes} minutes of speaking this week`);

  if ((recordingTotals?.avg_loudness ?? 0) < 50) focusAreas.push("Speak louder — practice voice warm-up daily");
  if (avgAccuracy < 70 && avgAccuracy > 0) focusAreas.push("Practice paragraph reading to improve word accuracy");
  if (daysGoalMet < 3) focusAreas.push(`Aim for ${dailyGoalMinutes} min/day — you met the goal ${daysGoalMet}/7 days`);

  const topMistakeList = topMistakes.results ?? [];
  if (topMistakeList.length > 0) {
    focusAreas.push(`Review: ${topMistakeList[0].wrong_form} → ${topMistakeList[0].correct_form}`);
  }
  if (focusAreas.length === 0) focusAreas.push("Try shadowing practice for natural pronunciation");
  if (improvements.length === 0) improvements.push("Keep practicing daily — consistency is key!");

  const streakInfo = await getStreakInfo(db, userId);

  const fluencyScore = computeFluencyScore({
    romanHindiAccuracy: avgAccuracy || 70,
    pronunciationAccuracy: avgAccuracy || 70,
    loudnessScore: recordingTotals?.avg_loudness ?? 60,
    clarityScore: recordingTotals?.avg_clarity ?? 65,
    streakDays: streakInfo.streak,
  });

  return {
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    sessionsCompleted,
    correctionsMade: corrections?.count ?? 0,
    recordingsMade: recordingTotals?.count ?? 0,
    speakingMinutes,
    avgLoudness: Math.round(recordingTotals?.avg_loudness ?? 0),
    avgClarity: Math.round(recordingTotals?.avg_clarity ?? 0),
    avgAccuracy: Math.round(avgAccuracy * 10) / 10,
    streakDays: streakInfo.streak,
    daysGoalMet,
    dailyGoalMinutes,
    dailyActivity,
    topMistakes: topMistakeList.map((m) => ({
      wrong: String(m.wrong_form),
      correct: String(m.correct_form),
      count: Number(m.repeat_count),
    })),
    improvements,
    focusAreas,
    fluencyScore,
  };
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

export function buildReportHtml(report: Awaited<ReturnType<typeof buildWeeklyReport>>) {
  const maxMinutes = Math.max(...report.dailyActivity.map((d) => d.minutes), report.dailyGoalMinutes, 1);
  const bars = report.dailyActivity
    .map((d) => {
      const pct = Math.round((d.minutes / maxMinutes) * 100);
      const goalPct = Math.round((report.dailyGoalMinutes / maxMinutes) * 100);
      const color = d.goalMet ? "#16a34a" : d.minutes > 0 ? "#2563eb" : "#e2e8f0";
      return `<div class="day-col">
        <div class="bar-wrap">
          <div class="goal-line" style="bottom:${goalPct}%"></div>
          <div class="bar" style="height:${pct}%;background:${color}" title="${d.minutes} min"></div>
        </div>
        <span class="day-label">${formatDayLabel(d.date)}</span>
        <span class="day-val">${d.minutes}m</span>
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Speak Coach Weekly Report</title>
<style>
  *{box-sizing:border-box}
  body{font-family:system-ui,-apple-system,sans-serif;max-width:760px;margin:32px auto;padding:0 28px 48px;color:#0f172a;line-height:1.5}
  h1{color:#0284c7;font-size:1.75rem;margin:0 0 4px}
  .sub{color:#64748b;margin:0 0 28px;font-size:0.95rem}
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
  .stat{padding:14px 16px;background:#f0f9ff;border-radius:10px;border:1px solid #e0f2fe}
  .stat span{display:block;font-size:0.75rem;color:#64748b;text-transform:uppercase;letter-spacing:.04em}
  .stat strong{display:block;font-size:1.5rem;margin-top:4px;color:#0c4a6e}
  .stat.highlight{background:#ecfdf5;border-color:#bbf7d0}
  .stat.highlight strong{color:#166534}
  h2{font-size:1.1rem;margin:28px 0 12px;color:#1e293b}
  ul{margin:0;padding-left:1.25rem} li{margin-bottom:6px}
  .chart{display:flex;gap:8px;align-items:flex-end;height:140px;padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0}
  .day-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px}
  .bar-wrap{position:relative;width:100%;height:100px;display:flex;align-items:flex-end}
  .bar{width:100%;border-radius:4px 4px 0 0;min-height:2px;transition:height .2s}
  .goal-line{position:absolute;left:0;right:0;height:1px;background:#f59e0b;opacity:.7}
  .day-label{font-size:0.7rem;color:#64748b;font-weight:600}
  .day-val{font-size:0.65rem;color:#94a3b8}
  .mistake{padding:8px 0;border-bottom:1px solid #f1f5f9;font-size:0.9rem}
  .mistake:last-child{border:0}
  .wrong{color:#dc2626;text-decoration:line-through}
  .correct{color:#16a34a;font-weight:600}
  .footer{margin-top:40px;padding-top:16px;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:0.75rem}
  @media print{body{margin:16px;padding:0 16px}.stats{grid-template-columns:repeat(2,1fr)}}
</style></head><body>
<h1>Speak Coach — Weekly Report</h1>
<p class="sub">${report.weekStart} → ${report.weekEnd}</p>
<div class="stats">
  <div class="stat"><span>Sessions</span><strong>${report.sessionsCompleted}</strong></div>
  <div class="stat"><span>Speaking</span><strong>${report.speakingMinutes}m</strong></div>
  <div class="stat"><span>Recordings</span><strong>${report.recordingsMade}</strong></div>
  <div class="stat highlight"><span>Fluency</span><strong>${report.fluencyScore}/100</strong></div>
</div>
<div class="stats">
  <div class="stat"><span>Streak</span><strong>${report.streakDays} days</strong></div>
  <div class="stat"><span>Goal days</span><strong>${report.daysGoalMet}/7</strong></div>
  <div class="stat"><span>Loudness</span><strong>${report.avgLoudness}/100</strong></div>
  <div class="stat"><span>Clarity</span><strong>${report.avgClarity}/100</strong></div>
</div>
<h2>Daily Speaking Minutes</h2>
<p style="font-size:0.85rem;color:#64748b;margin:-4px 0 12px">Orange line = ${report.dailyGoalMinutes} min daily goal</p>
<div class="chart">${bars}</div>
<h2>What Improved</h2><ul>${report.improvements.map((i) => `<li>${i}</li>`).join("")}</ul>
<h2>Focus Next Week</h2><ul>${report.focusAreas.map((i) => `<li>${i}</li>`).join("")}</ul>
<h2>Top Mistakes</h2>
${report.topMistakes.length > 0
    ? report.topMistakes.map((m) => `<div class="mistake"><span class="wrong">${m.wrong}</span> → <span class="correct">${m.correct}</span> (${m.count}×)</div>`).join("")
    : "<p style='color:#64748b'>None recorded this week — great job!</p>"}
<p class="footer">Generated by Speak Coach · ${new Date().toLocaleDateString()}</p>
</body></html>`;
}

export async function sendWeeklyReportEmail(
  db: D1Database,
  env: import("../env").Env,
  userId: string
): Promise<{ ok: boolean; message: string }> {
  const user = await db.prepare(`SELECT email FROM users WHERE id = ?`)
    .bind(userId)
    .first<{ email: string | null }>();
  const email = user?.email?.trim();
  if (!email) {
    return { ok: false, message: "Add your email in Profile to receive weekly reports." };
  }

  const { sendEmail } = await import("./email");
  const report = await buildWeeklyReport(db, userId);
  const html = buildReportHtml(report);
  const result = await sendEmail(
    env,
    email,
    `Speak Coach Weekly Report — ${report.weekStart} to ${report.weekEnd}`,
    html
  );

  if (result.ok) {
    await db.prepare(
      `UPDATE user_settings SET last_weekly_email_sent = ?, updated_at = ? WHERE user_id = ?`
    )
      .bind(new Date().toISOString().slice(0, 10), new Date().toISOString(), userId)
      .run();
  }

  return result;
}
