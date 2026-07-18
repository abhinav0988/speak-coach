import type { Env } from "./env";
import { runReminderCron } from "./services/push";
import { sendWeeklyReportEmail } from "./services/weeklyReport";

export async function handleScheduled(
  event: ScheduledEvent,
  env: Env,
  _ctx: ExecutionContext
) {
  await runReminderCron(
    env.DB,
    env.EXPO_ACCESS_TOKEN,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY
  );

  const now = new Date(event.scheduledTime);
  const isSunday = now.getUTCDay() === 0;
  const hour = now.getUTCHours();
  if (!isSunday || hour !== 8) return;

  const today = now.toISOString().slice(0, 10);
  const eligible = await env.DB.prepare(
    `SELECT user_id, last_weekly_email_sent FROM user_settings
     WHERE weekly_report_email = 1`
  ).all<{ user_id: string; last_weekly_email_sent: string | null }>();

  for (const row of eligible.results ?? []) {
    if (row.last_weekly_email_sent === today) continue;
    await sendWeeklyReportEmail(env.DB, env, row.user_id);
  }
}
