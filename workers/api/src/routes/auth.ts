import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { createId, nowIso, todayDate } from "../utils";
import { hashPassword, validatePassword, verifyPassword, sha256Hex, generateToken } from "../services/password";
import {
  ACCESS_COOKIE,
  CSRF_COOKIE,
  LOCKOUT_MINUTES,
  MAX_LOGIN_ATTEMPTS,
  MAX_OTP_ATTEMPTS,
  RESEND_COOLDOWN_SEC,
  signWsToken,
} from "../services/jwt";
import {
  canResendOtp,
  createEmailVerification,
  createPasswordReset,
  findUserByEmail,
  findUserById,
  parseUserAgent,
  publicUser,
  sendOtpEmail,
  verifyOtpRecord,
  writeAudit,
} from "../services/authUsers";
import {
  clearAuthCookies,
  clientIp,
  createAuthSession,
  getCookie,
  requireJwtSecret,
  rotateRefreshSession,
  setAuthCookies,
} from "../services/sessions";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

function emailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyTurnstile(env: Env, token: string | undefined, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  });
  const data = (await res.json()) as { success?: boolean };
  return !!data.success;
}

function requireCsrf(c: import("hono").Context<{ Bindings: Env; Variables: AppVariables }>): boolean {
  const method = c.req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return true;
  const header = c.req.header("X-CSRF-Token");
  const cookie = getCookie(c, CSRF_COOKIE);
  if (!header || !cookie || header !== cookie) return false;
  return true;
}

async function getLockout(db: D1Database, email: string) {
  return db
    .prepare(`SELECT id, attempts, locked_until FROM auth_lockouts WHERE email = ?`)
    .bind(email.toLowerCase())
    .first<{ id: string; attempts: number; locked_until: string | null }>();
}

async function bumpLockout(db: D1Database, email: string): Promise<{ locked: boolean; retryAfterMin: number }> {
  const key = email.toLowerCase();
  const existing = await getLockout(db, key);
  const now = nowIso();
  if (existing?.locked_until && new Date(existing.locked_until).getTime() > Date.now()) {
    const mins = Math.ceil((new Date(existing.locked_until).getTime() - Date.now()) / 60000);
    return { locked: true, retryAfterMin: mins };
  }
  const attempts = (existing?.attempts ?? 0) + 1;
  const lockedUntil =
    attempts >= MAX_LOGIN_ATTEMPTS
      ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000).toISOString()
      : null;
  if (existing) {
    await db
      .prepare(`UPDATE auth_lockouts SET attempts = ?, locked_until = ?, updated_at = ? WHERE id = ?`)
      .bind(attempts, lockedUntil, now, existing.id)
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO auth_lockouts (id, email, ip, attempts, locked_until, updated_at) VALUES (?, ?, NULL, ?, ?, ?)`
      )
      .bind(createId(), key, attempts, lockedUntil, now)
      .run();
  }
  return { locked: !!lockedUntil, retryAfterMin: LOCKOUT_MINUTES };
}

async function clearLockout(db: D1Database, email: string) {
  await db.prepare(`DELETE FROM auth_lockouts WHERE email = ?`).bind(email.toLowerCase()).run();
}

app.post("/register", async (c) => {
  const body = await c.req.json<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    turnstileToken?: string;
  }>();

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const ip = clientIp(c);
  const ua = c.req.header("User-Agent") ?? null;

  if (name.length < 2) return c.json({ error: "Name must be at least 2 characters" }, 400);
  if (!emailValid(email)) return c.json({ error: "Valid email is required" }, 400);
  if (password !== body.confirmPassword) return c.json({ error: "Passwords do not match" }, 400);
  const pwErr = validatePassword(password);
  if (pwErr) return c.json({ error: pwErr }, 400);
  if (!(await verifyTurnstile(c.env, body.turnstileToken, ip))) {
    return c.json({ error: "Turnstile verification failed" }, 400);
  }

  const existing = await findUserByEmail(c.env.DB, email);
  if (existing?.password_hash) {
    return c.json({ error: "An account with this email already exists" }, 409);
  }

  const passwordHash = await hashPassword(password);
  const userId = existing?.id ?? createId();
  const now = nowIso();

  if (existing) {
    await c.env.DB.prepare(
      `UPDATE users SET name = ?, email = ?, password_hash = ?, email_verified = 0, status = 'active',
        updated_at = ?, created_at = COALESCE(created_at, ?) WHERE id = ?`
    )
      .bind(name, email, passwordHash, now, now, userId)
      .run();
  } else {
    await c.env.DB.prepare(
      `INSERT INTO users (id, name, email, password_hash, email_verified, status, start_date, target_days, profile_complete, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, 'active', ?, 90, 0, ?, ?)`
    )
      .bind(userId, name, email, passwordHash, todayDate(), now, now)
      .run();
  }

  await c.env.DB.prepare(
    `INSERT OR IGNORE INTO user_settings (user_id, reminder_enabled, reminder_time, streak_freezes)
     VALUES (?, 0, '09:00', 1)`
  )
    .bind(userId)
    .run();

  const { otp } = await createEmailVerification(c.env.DB, userId);
  const mail = await sendOtpEmail(c.env, email, otp, "verify");
  await writeAudit(c.env.DB, { userId, email, action: "register", ip, userAgent: ua });

  return c.json({
    ok: true,
    userId,
    email,
    next: "/auth/verify-email",
    message: mail.message,
    ...(mail.exposedOtp ? { devOtp: mail.exposedOtp } : {}),
  });
});

app.post("/verify-email", async (c) => {
  const body = await c.req.json<{ email?: string; otp?: string }>();
  const email = body.email?.trim().toLowerCase() ?? "";
  const otp = body.otp?.trim() ?? "";
  if (!emailValid(email) || otp.length !== 6) {
    return c.json({ error: "Email and 6-digit OTP are required" }, 400);
  }

  const user = await findUserByEmail(c.env.DB, email);
  if (!user) return c.json({ error: "Account not found" }, 404);

  const result = await verifyOtpRecord(c.env.DB, {
    table: "email_verifications",
    userId: user.id,
    otp,
  });
  if (!result.ok) return c.json({ error: result.error }, 400);

  const now = nowIso();
  await c.env.DB.prepare(
    `UPDATE email_verifications SET verified_at = ? WHERE id = ?`
  )
    .bind(now, result.id)
    .run();
  await c.env.DB.prepare(
    `UPDATE users SET email_verified = 1, updated_at = ? WHERE id = ?`
  )
    .bind(now, user.id)
    .run();

  const ua = c.req.header("User-Agent") ?? null;
  const { browser, device } = parseUserAgent(ua);
  const session = await createAuthSession(c.env.DB, {
    userId: user.id,
    email: user.email ?? email,
    jwtSecret: requireJwtSecret(c.env),
    browser,
    device,
    ip: clientIp(c),
  });
  setAuthCookies(c, session);

  await writeAudit(c.env.DB, {
    userId: user.id,
    email,
    action: "verify_email",
    ip: clientIp(c),
    userAgent: ua,
  });

  const refreshed = await findUserById(c.env.DB, user.id);
  return c.json({
    ok: true,
    next: refreshed?.profile_complete ? "/dashboard" : "/profile/setup",
    message: "Email verified",
    user: refreshed ? publicUser(refreshed) : null,
    csrfToken: session.csrf,
  });
});

app.post("/resend-otp", async (c) => {
  const body = await c.req.json<{ email?: string; purpose?: "verify" | "reset" }>();
  const email = body.email?.trim().toLowerCase() ?? "";
  const purpose = body.purpose === "reset" ? "reset" : "verify";
  if (!emailValid(email)) return c.json({ error: "Valid email is required" }, 400);

  const user = await findUserByEmail(c.env.DB, email);
  if (!user) return c.json({ ok: true, message: "If the account exists, a code was sent" });

  const table = purpose === "reset" ? "password_resets" : "email_verifications";
  if (!(await canResendOtp(c.env.DB, user.id, table))) {
    return c.json({ error: `Wait ${RESEND_COOLDOWN_SEC} seconds before resending` }, 429);
  }

  const created =
    purpose === "reset"
      ? await createPasswordReset(c.env.DB, user.id)
      : await createEmailVerification(c.env.DB, user.id);
  const mail = await sendOtpEmail(c.env, email, created.otp, purpose);

  return c.json({
    ok: true,
    message: mail.message,
    ...(mail.exposedOtp ? { devOtp: mail.exposedOtp } : {}),
  });
});

app.post("/login", async (c) => {
  const body = await c.req.json<{
    email?: string;
    password?: string;
    rememberMe?: boolean;
    turnstileToken?: string;
  }>();
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  const ip = clientIp(c);
  const ua = c.req.header("User-Agent") ?? null;

  if (!emailValid(email) || !password) {
    return c.json({ error: "Email and password are required" }, 400);
  }
  if (!(await verifyTurnstile(c.env, body.turnstileToken, ip))) {
    return c.json({ error: "Turnstile verification failed" }, 400);
  }

  const lock = await getLockout(c.env.DB, email);
  if (lock?.locked_until && new Date(lock.locked_until).getTime() > Date.now()) {
    return c.json({ error: "Account temporarily locked. Try again later.", retryAfterMin: LOCKOUT_MINUTES }, 429);
  }

  const user = await findUserByEmail(c.env.DB, email);
  if (!user?.password_hash) {
    await bumpLockout(c.env.DB, email);
    return c.json({ error: "Invalid email or password" }, 401);
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    const bumped = await bumpLockout(c.env.DB, email);
    if (bumped.locked) {
      return c.json({ error: "Too many failed attempts. Account locked for 15 minutes." }, 429);
    }
    await writeAudit(c.env.DB, { userId: user.id, email, action: "login_failed", ip, userAgent: ua });
    return c.json({ error: "Invalid email or password" }, 401);
  }

  if (!user.email_verified) {
    return c.json({ error: "Email not verified", next: "/auth/verify-email", email }, 403);
  }
  if (user.status !== "active") {
    return c.json({ error: "Account is not active" }, 403);
  }

  await clearLockout(c.env.DB, email);
  const { browser, device } = parseUserAgent(ua);
  const jwtSecret = requireJwtSecret(c.env);
  const session = await createAuthSession(c.env.DB, {
    userId: user.id,
    email: user.email ?? email,
    jwtSecret,
    browser,
    device,
    ip,
  });
  setAuthCookies(c, session);
  await writeAudit(c.env.DB, { userId: user.id, email, action: "login", ip, userAgent: ua });

  const next = user.profile_complete ? "/dashboard" : "/profile/setup";
  return c.json({
    ok: true,
    user: publicUser(user),
    next,
    csrfToken: session.csrf,
  });
});

app.post("/logout", async (c) => {
  if (!requireCsrf(c)) return c.json({ error: "CSRF validation failed" }, 403);
  const sessionId = c.get("sessionId");
  if (sessionId) {
    await c.env.DB.prepare(`UPDATE auth_sessions SET revoked_at = ? WHERE id = ?`)
      .bind(nowIso(), sessionId)
      .run();
  }
  clearAuthCookies(c);
  await writeAudit(c.env.DB, {
    userId: c.get("userId"),
    email: c.get("userEmail"),
    action: "logout",
    ip: clientIp(c),
    userAgent: c.req.header("User-Agent"),
  });
  return c.json({ ok: true });
});

app.post("/refresh", async (c) => {
  const refresh = getCookie(c, "sc_refresh");
  if (!refresh) return c.json({ error: "Unauthorized" }, 401);
  const ua = c.req.header("User-Agent") ?? null;
  const { browser, device } = parseUserAgent(ua);
  const rotated = await rotateRefreshSession(c.env.DB, {
    oldRefresh: refresh,
    jwtSecret: requireJwtSecret(c.env),
    browser,
    device,
    ip: clientIp(c),
  });
  if (!rotated) {
    clearAuthCookies(c);
    return c.json({ error: "Unauthorized" }, 401);
  }
  setAuthCookies(c, rotated);
  return c.json({ ok: true, csrfToken: rotated.csrf });
});

app.get("/me", async (c) => {
  const user = await findUserById(c.env.DB, c.get("userId"));
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  const sessions = await c.env.DB.prepare(
    `SELECT id, browser, device, ip, created_at, expires_at, revoked_at
     FROM auth_sessions WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
     ORDER BY created_at DESC LIMIT 20`
  )
    .bind(user.id, nowIso())
    .all();

  return c.json({
    user: publicUser(user),
    sessions: sessions.results ?? [],
    currentSessionId: c.get("sessionId"),
    csrfToken: getCookie(c, CSRF_COOKIE) ?? null,
  });
});

app.post("/forgot-password", async (c) => {
  const body = await c.req.json<{ email?: string; turnstileToken?: string }>();
  const email = body.email?.trim().toLowerCase() ?? "";
  const ip = clientIp(c);
  if (!emailValid(email)) return c.json({ error: "Valid email is required" }, 400);
  if (!(await verifyTurnstile(c.env, body.turnstileToken, ip))) {
    return c.json({ error: "Turnstile verification failed" }, 400);
  }

  const user = await findUserByEmail(c.env.DB, email);
  // Always return ok to avoid email enumeration
  if (user?.password_hash) {
    const { otp } = await createPasswordReset(c.env.DB, user.id);
    const mail = await sendOtpEmail(c.env, email, otp, "reset");
    await writeAudit(c.env.DB, { userId: user.id, email, action: "forgot_password", ip });
    return c.json({
      ok: true,
      next: "/auth/reset-password",
      message: mail.message,
      ...(mail.exposedOtp ? { devOtp: mail.exposedOtp } : {}),
    });
  }
  return c.json({ ok: true, next: "/auth/reset-password", message: "If the account exists, a code was sent" });
});

app.post("/reset-password", async (c) => {
  const body = await c.req.json<{
    email?: string;
    otp?: string;
    password?: string;
    confirmPassword?: string;
  }>();
  const email = body.email?.trim().toLowerCase() ?? "";
  const otp = body.otp?.trim() ?? "";
  const password = body.password ?? "";
  if (!emailValid(email) || otp.length !== 6) {
    return c.json({ error: "Email and OTP are required" }, 400);
  }
  if (password !== body.confirmPassword) return c.json({ error: "Passwords do not match" }, 400);
  const pwErr = validatePassword(password);
  if (pwErr) return c.json({ error: pwErr }, 400);

  const user = await findUserByEmail(c.env.DB, email);
  if (!user) return c.json({ error: "Invalid reset request" }, 400);

  const result = await verifyOtpRecord(c.env.DB, { table: "password_resets", userId: user.id, otp });
  if (!result.ok) return c.json({ error: result.error }, 400);

  const now = nowIso();
  await c.env.DB.prepare(`UPDATE password_resets SET used_at = ? WHERE id = ?`).bind(now, result.id).run();
  await c.env.DB.prepare(`UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?`)
    .bind(await hashPassword(password), now, user.id)
    .run();
  // Revoke all sessions
  await c.env.DB.prepare(`UPDATE auth_sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL`)
    .bind(now, user.id)
    .run();

  await writeAudit(c.env.DB, {
    userId: user.id,
    email,
    action: "reset_password",
    ip: clientIp(c),
  });

  return c.json({ ok: true, next: "/auth/login", message: "Password updated. Please sign in." });
});

app.post("/ws-token", async (c) => {
  if (!requireCsrf(c)) return c.json({ error: "CSRF validation failed" }, 403);
  const token = await signWsToken(requireJwtSecret(c.env), c.get("userId"));
  const hash = await sha256Hex(token);
  await c.env.DB.prepare(
    `INSERT INTO ws_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)`
  )
    .bind(
      createId(),
      c.get("userId"),
      hash,
      new Date(Date.now() + 60_000).toISOString(),
      nowIso()
    )
    .run();
  return c.json({ token, expiresIn: 60 });
});

app.get("/sessions", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, browser, device, ip, created_at, expires_at
     FROM auth_sessions
     WHERE user_id = ? AND revoked_at IS NULL AND expires_at > ?
     ORDER BY created_at DESC`
  )
    .bind(c.get("userId"), nowIso())
    .all();
  return c.json({
    sessions: rows.results ?? [],
    currentSessionId: c.get("sessionId"),
  });
});

app.delete("/sessions/:id", async (c) => {
  if (!requireCsrf(c)) return c.json({ error: "CSRF validation failed" }, 403);
  const id = c.req.param("id");
  await c.env.DB.prepare(
    `UPDATE auth_sessions SET revoked_at = ? WHERE id = ? AND user_id = ?`
  )
    .bind(nowIso(), id, c.get("userId"))
    .run();
  return c.json({ ok: true });
});

app.patch("/profile-setup", async (c) => {
  if (!requireCsrf(c)) return c.json({ error: "CSRF validation failed" }, 403);
  const body = await c.req.json<{
    learningGoal?: string;
    dailyGoalMinutes?: number;
    targetDays?: number;
  }>();
  const learningGoal = body.learningGoal?.trim() || null;
  const dailyGoal = Math.min(120, Math.max(5, Number(body.dailyGoalMinutes) || 15));
  const targetDays = Math.min(365, Math.max(7, Number(body.targetDays) || 90));
  const now = nowIso();

  await c.env.DB.prepare(
    `UPDATE users SET learning_goal = ?, target_days = ?, profile_complete = 1, updated_at = ? WHERE id = ?`
  )
    .bind(learningGoal, targetDays, now, c.get("userId"))
    .run();

  await c.env.DB.prepare(
    `UPDATE user_settings SET daily_goal_minutes = ?, updated_at = ? WHERE user_id = ?`
  )
    .bind(dailyGoal, now, c.get("userId"))
    .run();

  const user = await findUserById(c.env.DB, c.get("userId"));
  return c.json({ ok: true, user: user ? publicUser(user) : null, next: "/dashboard" });
});

export default app;
