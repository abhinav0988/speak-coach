# Code Review — Speak Coach (post email-auth)

**Updated:** 2026-07-17  
**Companion:** [AUTH-FLOW.md](./AUTH-FLOW.md) · [TESTING.md](./TESTING.md)

Staff-engineer style review after replacing shared-secret auth with production email authentication.

---

## Executive summary

| Area | Grade | Notes |
|---|---|---|
| Authentication | **B+** | JWT + refresh cookies, OTP verify, lockout, CSRF |
| Authorization | **B** | Per-request `userId` from JWT; some learning tables still weakly scoped |
| Secrets hygiene | **A-** | No client-baked app secret; `JWT_SECRET` Worker-only |
| Session security | **B+** | HttpOnly cookies, refresh rotation, session revoke API |
| CORS / CSRF | **B+** | Credentials + origin allowlist; double-submit CSRF |
| Observability | **B** | Auth audit logs table; health checks JWT + auth tables |

**Primary risk (resolved P0):** Shared `APP_SECRET` / `speak-coach-dev` / single `user-1` tenant model has been removed from production source.

**Remaining follow-ups:** Ensure production Worker has a strong `JWT_SECRET`, Resend (or `AUTH_DEV_EXPOSE_OTP` only in non-prod), apply migration `0012_email_auth.sql`, and tighten per-user ownership on any remaining global learning tables.

---

## What changed (auth rewrite)

| Before | After |
|---|---|
| `APP_SECRET` Bearer equality check | JWT access (15m) + refresh (30d) |
| Single `user-1` | UUID users with password hashes |
| localStorage token | HttpOnly `sc_access` / `sc_refresh` + CSRF hint |
| Sign-in = access code | Register → email OTP → profile setup |
| Fail-open if secret missing | Fail-closed (503 if `JWT_SECRET` unset) |
| `?token=` on WebSocket | `POST /api/auth/ws-token` → `?ws_token=` (60s) |

---

## Security checklist

| Control | Status |
|---|---|
| Password hashing (PBKDF2-SHA-256, 100k — Workers platform max) | ✅ |
| Email verification OTP (10m / 5 attempts) | ✅ |
| Login lockout (5 / 15m) | ✅ |
| Refresh token rotation | ✅ |
| CSRF on mutating auth routes | ✅ |
| HttpOnly + Secure + SameSite cookies | ✅ |
| Optional Turnstile | ✅ (when `TURNSTILE_SECRET_KEY` set) |
| No JWT in localStorage | ✅ |
| No `APP_SECRET` in client bundle | ✅ |
| Session list / revoke | ✅ |

---

## AuthZ notes

- Protected routes attach `userId` from verified JWT claims after DB active-user check.
- Practice `sessions` and user-scoped routes use `c.get("userId")`.
- Historical migrations may still default some columns to `user-1` for legacy rows — new writes must use the authenticated id. Audit any feature that reads without a `user_id` filter.

---

## Deploy verification

```bash
cd workers/api
npx wrangler secret put JWT_SECRET
npx wrangler d1 migrations apply speak-coach --remote

# Local / smoke with OTP in JSON (non-production only)
# AUTH_DEV_EXPOSE_OTP=true

API_URL=https://speak-coach-api.blobforges.workers.dev npm run smoke
API_URL=… WEB_URL=https://speak-coach-3gw.pages.dev npm run smoke:full
```

---

## Residual risks (non-blocking)

1. **Email delivery** — Without Resend, OTP is logged / optionally returned as `devOtp` (must be off in prod).
2. **Cross-origin cookies** — Pages ↔ Workers needs `SameSite=None; Secure` and exact CORS origins.
3. **Mobile app** — May still need a cookie/token adapter if it previously used `EXPO_PUBLIC_APP_SECRET`.
4. **Data isolation** — Complete a pass for tables that historically lacked `user_id`.

---

## Verdict

Auth is no longer a shared-secret product. Ship after remote migration + `JWT_SECRET` + email provider (or temporary controlled `AUTH_DEV_EXPOSE_OTP` for staging smoke only).
