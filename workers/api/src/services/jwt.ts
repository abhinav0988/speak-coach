import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const ACCESS_COOKIE = "sc_access";
export const REFRESH_COOKIE = "sc_refresh";
export const CSRF_COOKIE = "sc_csrf";

export const ACCESS_TTL_SEC = 15 * 60;
export const REFRESH_TTL_SEC = 30 * 24 * 60 * 60;
export const OTP_TTL_SEC = 10 * 60;
export const WS_TOKEN_TTL_SEC = 60;
export const RESEND_COOLDOWN_SEC = 60;
export const MAX_OTP_ATTEMPTS = 5;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export type AccessClaims = JWTPayload & {
  sub: string;
  email: string;
  sid: string;
  typ: "access";
};

export type WsClaims = JWTPayload & {
  sub: string;
  typ: "ws";
};

function encoder(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(
  secret: string,
  payload: { userId: string; email: string; sessionId: string }
): Promise<string> {
  return new SignJWT({
    email: payload.email,
    sid: payload.sessionId,
    typ: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.userId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SEC}s`)
    .sign(encoder(secret));
}

export async function verifyAccessToken(secret: string, token: string): Promise<AccessClaims> {
  const { payload } = await jwtVerify(token, encoder(secret));
  if (payload.typ !== "access" || !payload.sub || typeof payload.sid !== "string") {
    throw new Error("Invalid access token");
  }
  return payload as AccessClaims;
}

export async function signWsToken(secret: string, userId: string): Promise<string> {
  return new SignJWT({ typ: "ws" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${WS_TOKEN_TTL_SEC}s`)
    .sign(encoder(secret));
}

export async function verifyWsToken(secret: string, token: string): Promise<WsClaims> {
  const { payload } = await jwtVerify(token, encoder(secret));
  if (payload.typ !== "ws" || !payload.sub) throw new Error("Invalid WS token");
  return payload as WsClaims;
}

export function cookieOptions(maxAge: number, path = "/"): string {
  const parts = [
    `Path=${path}`,
    `Max-Age=${maxAge}`,
    "HttpOnly",
    "Secure",
    "SameSite=None",
  ];
  return parts.join("; ");
}

export function clearCookie(name: string, path = "/"): string {
  return `${name}=; Path=${path}; Max-Age=0; HttpOnly; Secure; SameSite=None`;
}
