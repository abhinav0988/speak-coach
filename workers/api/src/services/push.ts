import { createId, nowIso, todayDate } from "../utils";

export function getISTMinutes(): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function reminderMatchesNow(reminderTime: string, windowMinutes = 14): boolean {
  const [rh, rm] = reminderTime.split(":").map((v) => Number(v));
  if (Number.isNaN(rh) || Number.isNaN(rm)) return false;
  const target = rh * 60 + rm;
  const current = getISTMinutes();
  const diff = Math.abs(current - target);
  return diff <= windowMinutes || diff >= 24 * 60 - windowMinutes;
}

export async function sendExpoPush(
  tokens: string[],
  title: string,
  body: string,
  accessToken?: string
): Promise<{ sent: number; failed: number }> {
  if (tokens.length === 0) return { sent: 0, failed: 0 };

  const messages = tokens.map((to) => ({
    to,
    title,
    body,
    sound: "default",
    priority: "high",
  }));

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(messages),
  });

  if (!res.ok) return { sent: 0, failed: tokens.length };

  const data = (await res.json()) as { data?: Array<{ status?: string }> };
  const results = data.data ?? [];
  const sent = results.filter((r) => r.status === "ok").length;
  return { sent, failed: results.length - sent };
}

export async function runReminderCron(
  db: D1Database,
  accessToken?: string,
  vapidPublic?: string,
  vapidPrivate?: string
) {
  const today = todayDate();
  const settings = await db.prepare(
    `SELECT user_id, reminder_time, last_reminder_sent_date FROM user_settings
     WHERE reminder_enabled = 1`
  ).all<{
    user_id: string;
    reminder_time: string;
    last_reminder_sent_date: string | null;
  }>();

  let notified = 0;
  const title = "Speak Coach Reminder";
  const body = "Time to practice speaking for 10 minutes!";

  for (const row of settings.results ?? []) {
    if (row.last_reminder_sent_date === today) continue;
    if (!reminderMatchesNow(row.reminder_time ?? "09:00")) continue;

    const tokens = await db.prepare(
      `SELECT token, platform FROM push_tokens WHERE user_id = ?`
    )
      .bind(row.user_id)
      .all<{ token: string; platform: string | null }>();

    const rows = tokens.results ?? [];
    if (rows.length === 0) continue;

    const expoTokens = rows
      .filter((t) => t.token.startsWith("ExponentPushToken"))
      .map((t) => t.token);
    const webSubs = rows
      .filter((t) => t.platform === "web" || t.token.startsWith("{"))
      .map((t) => t.token);

    let sent = 0;
    if (expoTokens.length > 0) {
      sent += (await sendExpoPush(expoTokens, title, body, accessToken)).sent;
    }
    if (webSubs.length > 0 && vapidPublic && vapidPrivate) {
      sent += (await sendWebPush(webSubs, title, body, vapidPublic, vapidPrivate)).sent;
    }

    if (sent > 0) {
      await db.prepare(
        `UPDATE user_settings SET last_reminder_sent_date = ?, updated_at = ? WHERE user_id = ?`
      )
        .bind(today, nowIso(), row.user_id)
        .run();
      notified += sent;
    }
  }

  return { notified, checkedAt: nowIso() };
}

export async function sendWebPush(
  subscriptionJsonList: string[],
  title: string,
  body: string,
  vapidPublic: string,
  vapidPrivate: string
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  try {
    const webpush = await import("web-push");
    webpush.setVapidDetails("mailto:speak-coach@example.com", vapidPublic, vapidPrivate);
    const payload = JSON.stringify({ title, body });

    for (const subJson of subscriptionJsonList) {
      try {
        const sub = JSON.parse(subJson) as { endpoint: string; keys: { p256dh: string; auth: string } };
        await webpush.sendNotification(sub, payload);
        sent++;
      } catch {
        failed++;
      }
    }
  } catch {
    failed += subscriptionJsonList.length;
  }

  return { sent, failed };
}

export async function upsertPushToken(
  db: D1Database,
  userId: string,
  token: string,
  platform?: string
) {
  const existing = await db.prepare(`SELECT id FROM push_tokens WHERE token = ?`)
    .bind(token)
    .first<{ id: string }>();

  const now = nowIso();
  if (existing) {
    await db.prepare(
      `UPDATE push_tokens SET user_id = ?, platform = ?, updated_at = ? WHERE token = ?`
    )
      .bind(userId, platform ?? null, now, token)
      .run();
    return existing.id;
  }

  const id = createId();
  await db.prepare(
    `INSERT INTO push_tokens (id, user_id, token, platform, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(id, userId, token, platform ?? null, now, now)
    .run();
  return id;
}
