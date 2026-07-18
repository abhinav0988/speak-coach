import type { Env } from "../env";
import { createId, nowIso } from "../utils";
import { sendEmail } from "./email";
import { generateOtp, sha256Hex } from "./password";
import { MAX_OTP_ATTEMPTS, OTP_TTL_SEC, RESEND_COOLDOWN_SEC } from "./jwt";

export type AuthUserRow = {
  id: string;
  name: string;
  email: string | null;
  password_hash: string | null;
  email_verified: number;
  avatar: string | null;
  status: string;
  start_date: string;
  target_days: number;
  learning_goal: string | null;
  profile_complete: number;
  daily_goal_minutes?: number;
};

export async function findUserByEmail(db: D1Database, email: string): Promise<AuthUserRow | null> {
  return db
    .prepare(
      `SELECT id, name, email, password_hash, email_verified, avatar, status, start_date, target_days,
              learning_goal, profile_complete
       FROM users WHERE lower(email) = lower(?)`
    )
    .bind(email.trim())
    .first<AuthUserRow>();
}

export async function findUserById(db: D1Database, id: string): Promise<AuthUserRow | null> {
  return db
    .prepare(
      `SELECT id, name, email, password_hash, email_verified, avatar, status, start_date, target_days,
              learning_goal, profile_complete
       FROM users WHERE id = ?`
    )
    .bind(id)
    .first<AuthUserRow>();
}

export async function writeAudit(
  db: D1Database,
  entry: {
    userId?: string | null;
    email?: string | null;
    action: string;
    ip?: string | null;
    userAgent?: string | null;
    meta?: Record<string, unknown>;
  }
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO auth_audit_logs (id, user_id, email, action, ip, user_agent, meta_json, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      createId(),
      entry.userId ?? null,
      entry.email ?? null,
      entry.action,
      entry.ip ?? null,
      entry.userAgent ?? null,
      entry.meta ? JSON.stringify(entry.meta) : null,
      nowIso()
    )
    .run();
}

export async function createEmailVerification(
  db: D1Database,
  userId: string
): Promise<{ otp: string; id: string }> {
  const otp = generateOtp(6);
  const id = createId();
  const expires = new Date(Date.now() + OTP_TTL_SEC * 1000).toISOString();
  await db
    .prepare(
      `INSERT INTO email_verifications (id, user_id, otp_hash, expires_at, attempts, created_at)
       VALUES (?, ?, ?, ?, 0, ?)`
    )
    .bind(id, userId, await sha256Hex(otp), expires, nowIso())
    .run();
  return { otp, id };
}

export async function createPasswordReset(
  db: D1Database,
  userId: string
): Promise<{ otp: string; id: string }> {
  const otp = generateOtp(6);
  const id = createId();
  const expires = new Date(Date.now() + OTP_TTL_SEC * 1000).toISOString();
  await db
    .prepare(
      `INSERT INTO password_resets (id, user_id, otp_hash, expires_at, attempts, created_at)
       VALUES (?, ?, ?, ?, 0, ?)`
    )
    .bind(id, userId, await sha256Hex(otp), expires, nowIso())
    .run();
  return { otp, id };
}

export async function sendOtpEmail(
  env: Env,
  to: string,
  otp: string,
  purpose: "verify" | "reset"
): Promise<{ ok: boolean; message: string; exposedOtp?: string }> {
  const subject =
    purpose === "verify" ? "Verify your Speak Coach email" : "Reset your Speak Coach password";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto">
      <h1 style="font-size:20px">Speak Coach</h1>
      <p>Your one-time code is:</p>
      <p style="font-size:32px;letter-spacing:8px;font-weight:700">${otp}</p>
      <p>This code expires in 10 minutes. Maximum 5 attempts.</p>
      <p style="color:#64748b;font-size:12px">If you did not request this, you can ignore this email.</p>
    </div>
  `;

  const result = await sendEmail(env, to, subject, html);
  // Local/dev convenience: expose OTP when email provider is not configured
  if (!result.ok && env.AUTH_DEV_EXPOSE_OTP === "true") {
    return { ok: true, message: "OTP logged for development", exposedOtp: otp };
  }
  if (!result.ok && !env.RESEND_API_KEY) {
    console.log(`[auth-otp] ${purpose} for ${to}: ${otp}`);
    return { ok: true, message: "OTP logged (email not configured)", exposedOtp: env.AUTH_DEV_EXPOSE_OTP === "true" ? otp : undefined };
  }
  return result;
}

export async function canResendOtp(db: D1Database, userId: string, table: "email_verifications" | "password_resets"): Promise<boolean> {
  const row = await db
    .prepare(`SELECT created_at FROM ${table} WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`)
    .bind(userId)
    .first<{ created_at: string }>();
  if (!row) return true;
  const elapsed = Date.now() - new Date(row.created_at).getTime();
  return elapsed >= RESEND_COOLDOWN_SEC * 1000;
}

export async function verifyOtpRecord(
  db: D1Database,
  opts: {
    table: "email_verifications" | "password_resets";
    userId: string;
    otp: string;
  }
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const row = await db
    .prepare(
      `SELECT id, otp_hash, expires_at, attempts, ${opts.table === "email_verifications" ? "verified_at" : "used_at as verified_at"}
       FROM ${opts.table}
       WHERE user_id = ?
       ORDER BY created_at DESC LIMIT 1`
    )
    .bind(opts.userId)
    .first<{ id: string; otp_hash: string; expires_at: string; attempts: number; verified_at: string | null }>();

  if (!row) return { ok: false, error: "No active code. Request a new one." };
  if (row.verified_at) return { ok: false, error: "Code already used." };
  if (new Date(row.expires_at).getTime() < Date.now()) return { ok: false, error: "Code expired." };
  if (row.attempts >= MAX_OTP_ATTEMPTS) return { ok: false, error: "Too many attempts. Request a new code." };

  const match = (await sha256Hex(opts.otp)) === row.otp_hash;
  await db
    .prepare(`UPDATE ${opts.table} SET attempts = attempts + 1 WHERE id = ?`)
    .bind(row.id)
    .run();

  if (!match) return { ok: false, error: "Invalid code." };
  return { ok: true, id: row.id };
}

export function parseUserAgent(ua: string | null): { browser: string; device: string } {
  const raw = ua ?? "unknown";
  let browser = "Unknown";
  if (/Edg\//i.test(raw)) browser = "Edge";
  else if (/Chrome\//i.test(raw)) browser = "Chrome";
  else if (/Firefox\//i.test(raw)) browser = "Firefox";
  else if (/Safari\//i.test(raw)) browser = "Safari";

  let device = "Desktop";
  if (/iPhone|iPad|Android/i.test(raw)) device = "Mobile";
  else if (/Tablet|iPad/i.test(raw)) device = "Tablet";

  return { browser, device };
}

export function publicUser(user: AuthUserRow) {
  return {
    id: user.id,
    name: user.name,
    email: user.email ?? "",
    emailVerified: !!user.email_verified,
    avatar: user.avatar,
    status: user.status,
    startDate: user.start_date,
    targetDays: user.target_days,
    learningGoal: user.learning_goal,
    profileComplete: !!user.profile_complete,
  };
}
