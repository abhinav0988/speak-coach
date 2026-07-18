import type { MiddlewareHandler } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { ACCESS_COOKIE, verifyAccessToken, verifyWsToken } from "../services/jwt";
import { findUserById } from "../services/authUsers";
import { getCookie, requireJwtSecret } from "../services/sessions";

const PUBLIC_EXACT = new Set([
  "/api/health",
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/verify-email",
  "/api/auth/resend-otp",
]);

const PUBLIC_PREFIXES = ["/api/auth/register", "/api/auth/login"];

function isPublic(path: string): boolean {
  if (PUBLIC_EXACT.has(path)) return true;
  // WebSocket upgrade with short-lived ws token handled separately in coachWs
  if (path === "/api/coach/ws") return true;
  return PUBLIC_PREFIXES.some((p) => path === p);
}

export const authMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: AppVariables }> = async (
  c,
  next
) => {
  const path = new URL(c.req.url).pathname;
  if (isPublic(path)) return next();

  let secret: string;
  try {
    secret = requireJwtSecret(c.env);
  } catch {
    return c.json({ error: "Authentication is not configured" }, 503);
  }

  const bearer = c.req.header("Authorization");
  const headerToken = bearer?.startsWith("Bearer ") ? bearer.slice(7) : undefined;
  const cookieToken = getCookie(c, ACCESS_COOKIE);
  const token = headerToken ?? cookieToken;

  if (!token) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const claims = await verifyAccessToken(secret, token);
    const user = await findUserById(c.env.DB, claims.sub);
    if (!user || user.status !== "active") {
      return c.json({ error: "Unauthorized" }, 401);
    }
    c.set("userId", user.id);
    c.set("userEmail", user.email ?? claims.email);
    c.set("sessionId", claims.sid);
    return next();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
};

/** Authenticate coach WebSocket upgrade using short-lived ws JWT in ?ws_token= */
export async function authenticateWsUpgrade(
  env: Env,
  wsToken: string | undefined
): Promise<{ userId: string } | { error: string; status: number }> {
  if (!wsToken) return { error: "Missing ws_token", status: 401 };
  let secret: string;
  try {
    secret = requireJwtSecret(env);
  } catch {
    return { error: "Authentication is not configured", status: 503 };
  }
  try {
    const claims = await verifyWsToken(secret, wsToken);
    const user = await findUserById(env.DB, claims.sub);
    if (!user || user.status !== "active") return { error: "Unauthorized", status: 401 };
    return { userId: user.id };
  } catch {
    return { error: "Invalid or expired ws_token", status: 401 };
  }
}
