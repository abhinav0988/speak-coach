import type { Context } from "hono";
import type { Env } from "../env";
import { createId, nowIso } from "../utils";
import {
  ACCESS_COOKIE,
  ACCESS_TTL_SEC,
  CSRF_COOKIE,
  REFRESH_COOKIE,
  REFRESH_TTL_SEC,
  clearCookie,
  cookieOptions,
  signAccessToken,
} from "./jwt";
import { generateToken, sha256Hex } from "./password";

export type AppVariables = {
  userId: string;
  userEmail: string;
  sessionId: string;
};

export type AppContext = Context<{ Bindings: Env; Variables: AppVariables }>;

export function clientIp(c: Context): string {
  return (
    c.req.header("CF-Connecting-IP") ??
    c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function getCookie(c: Context, name: string): string | undefined {
  const header = c.req.header("Cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export function setAuthCookies(
  c: Context,
  tokens: { access: string; refresh: string; csrf: string }
): void {
  c.header("Set-Cookie", `${ACCESS_COOKIE}=${tokens.access}; ${cookieOptions(ACCESS_TTL_SEC)}`, { append: true });
  c.header("Set-Cookie", `${REFRESH_COOKIE}=${tokens.refresh}; ${cookieOptions(REFRESH_TTL_SEC, "/api/auth")}`, {
    append: true,
  });
  // CSRF is readable by JS for double-submit pattern
  c.header(
    "Set-Cookie",
    `${CSRF_COOKIE}=${tokens.csrf}; Path=/; Max-Age=${REFRESH_TTL_SEC}; Secure; SameSite=None`,
    { append: true }
  );
}

export function clearAuthCookies(c: Context): void {
  c.header("Set-Cookie", clearCookie(ACCESS_COOKIE), { append: true });
  c.header("Set-Cookie", clearCookie(REFRESH_COOKIE, "/api/auth"), { append: true });
  c.header("Set-Cookie", `${CSRF_COOKIE}=; Path=/; Max-Age=0; Secure; SameSite=None`, { append: true });
}

export async function createAuthSession(
  db: D1Database,
  opts: {
    userId: string;
    email: string;
    jwtSecret: string;
    browser?: string;
    device?: string;
    ip?: string;
  }
): Promise<{ access: string; refresh: string; csrf: string; sessionId: string }> {
  const sessionId = createId();
  const refresh = generateToken(48);
  const csrf = generateToken(24);
  const expires = new Date(Date.now() + REFRESH_TTL_SEC * 1000).toISOString();

  await db
    .prepare(
      `INSERT INTO auth_sessions (id, user_id, refresh_token_hash, browser, device, ip, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      sessionId,
      opts.userId,
      await sha256Hex(refresh),
      opts.browser ?? null,
      opts.device ?? null,
      opts.ip ?? null,
      expires,
      nowIso()
    )
    .run();

  const access = await signAccessToken(opts.jwtSecret, {
    userId: opts.userId,
    email: opts.email,
    sessionId,
  });

  return { access, refresh, csrf, sessionId };
}

export async function rotateRefreshSession(
  db: D1Database,
  opts: {
    oldRefresh: string;
    jwtSecret: string;
    browser?: string;
    device?: string;
    ip?: string;
  }
): Promise<{ access: string; refresh: string; csrf: string; userId: string; email: string } | null> {
  const hash = await sha256Hex(opts.oldRefresh);
  const session = await db
    .prepare(
      `SELECT s.id, s.user_id, s.expires_at, s.revoked_at, u.email, u.status
       FROM auth_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.refresh_token_hash = ?`
    )
    .bind(hash)
    .first<{
      id: string;
      user_id: string;
      expires_at: string;
      revoked_at: string | null;
      email: string;
      status: string;
    }>();

  if (!session || session.revoked_at) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) return null;
  if (session.status !== "active") return null;

  // Rotate: revoke old, create new
  await db
    .prepare(`UPDATE auth_sessions SET revoked_at = ? WHERE id = ?`)
    .bind(nowIso(), session.id)
    .run();

  const created = await createAuthSession(db, {
    userId: session.user_id,
    email: session.email,
    jwtSecret: opts.jwtSecret,
    browser: opts.browser,
    device: opts.device,
    ip: opts.ip,
  });

  return {
    access: created.access,
    refresh: created.refresh,
    csrf: created.csrf,
    userId: session.user_id,
    email: session.email,
  };
}

export function requireJwtSecret(env: Env): string {
  const secret = env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
}
