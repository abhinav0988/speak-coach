export interface Env {
  DB: D1Database;
  VOICE: R2Bucket;
  AI: Ai;
  COACH_ROOM: DurableObjectNamespace;
  /** Required. HS256 secret for access + WS JWTs. */
  JWT_SECRET: string;
  /** Optional Resend API key for OTP / report emails. */
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  /** When "true", OTP may be returned in API JSON if email is unavailable (local/dev only). */
  AUTH_DEV_EXPOSE_OTP?: string;
  /** Cloudflare Turnstile secret. When set, login/register require a token. */
  TURNSTILE_SECRET_KEY?: string;
  EXPO_ACCESS_TOKEN?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
}
