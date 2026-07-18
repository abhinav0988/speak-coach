# Auth Migration — Shared Secret → Email + JWT Cookies

**Updated:** 2026-07-17  
**Companion:** [AUTH-FLOW.md](../AUTH-FLOW.md) · [CODE-REVIEW.md](../CODE-REVIEW.md)

This document summarizes the **breaking change** from single-tenant shared-secret auth to production email authentication.

---

## What changed

| Before (removed) | After (current) |
|---|---|
| `APP_SECRET` / `NEXT_PUBLIC_APP_SECRET` / `DEV_ACCESS_CODE` | `JWT_SECRET` (Worker only) |
| `Authorization: Bearer <shared-secret>` | HttpOnly cookies `sc_access` + `sc_refresh` |
| Single hard-coded `user-1` | Per-user UUID rows in `users` |
| `POST /api/auth/sign-in`, `sign-up` + access code | `POST /api/auth/register`, `login`, `verify-email`, etc. |
| JWT/token in `localStorage` | CSRF hint only in `localStorage`; tokens in HttpOnly cookies |
| WebSocket `?token=` | `POST /api/auth/ws-token` → `?ws_token=` (60s) |
| Fail-open if secret missing | Fail-closed — **503** if `JWT_SECRET` unset |

---

## Database migration

Apply **`workers/api/migrations/0012_email_auth.sql`** before deploying the new Worker:

```bash
cd workers/api
npx wrangler d1 migrations apply speak-coach --local    # dev
npx wrangler d1 migrations apply speak-coach --remote   # production
```

### Tables added / extended

- **`users`** — `password_hash`, `email_verified`, `avatar`, `status`, `learning_goal`, `profile_complete`, timestamps
- **`auth_sessions`** — refresh token hashes + device metadata (not practice `sessions`)
- **`email_verifications`** — email OTP (hashed, 10 min, 5 attempts)
- **`password_resets`** — reset OTP
- **`auth_lockouts`** — login lockout (5 failures → 15 min)
- **`ws_tokens`** — short-lived WebSocket upgrade tokens
- **`auth_audit_logs`**, **`csrf_tokens`**

---

## Environment variables

### Worker (`workers/api/.dev.vars` / wrangler secrets)

| Variable | Required | Notes |
|---|---|---|
| `JWT_SECRET` | **Yes** | HS256 signing key; min ~32 random bytes |
| `AUTH_DEV_EXPOSE_OTP` | Dev/staging | `true` → return `devOtp` in JSON when email not configured |
| `RESEND_API_KEY` | Prod email | OTP delivery via Resend |
| `EMAIL_FROM` | With Resend | Sender address |
| `TURNSTILE_SECRET_KEY` | Optional | Bot protection on register/login |

```bash
# Production
cd workers/api
npx wrangler secret put JWT_SECRET
npx wrangler secret put RESEND_API_KEY   # recommended
```

### Web (`apps/web/.env.local`)

| Variable | Required |
|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** |

**Do not** set `NEXT_PUBLIC_APP_SECRET`, `APP_SECRET`, or `DEV_ACCESS_CODE` on the client.

---

## Cookie names

| Cookie | Purpose | Lifetime |
|---|---|---|
| `sc_access` | JWT access token (HttpOnly, Secure, SameSite) | 15 minutes |
| `sc_refresh` | Opaque refresh token (path `/api/auth`) | 30 days |
| `sc_csrf` | CSRF double-submit hint (readable by JS for header) | Session |

Mutating authenticated auth routes require header `X-CSRF-Token` matching `sc_csrf`.

---

## API endpoints

| Method | Path | Auth |
|---|---|---|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/verify-email` | Public (sets session cookies on success) |
| POST | `/api/auth/resend-otp` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Access + CSRF |
| POST | `/api/auth/refresh` | Refresh cookie |
| GET | `/api/auth/me` | Access |
| POST | `/api/auth/forgot-password` | Public |
| POST | `/api/auth/reset-password` | Public |
| POST | `/api/auth/ws-token` | Access + CSRF |
| GET | `/api/auth/sessions` | Access |
| DELETE | `/api/auth/sessions/:id` | Access + CSRF |
| PATCH | `/api/auth/profile-setup` | Access + CSRF |

All other `/api/*` routes require a valid access JWT (cookie or `Authorization: Bearer <jwt>`).

---

## Frontend routes

| Route | Purpose |
|---|---|
| `/auth` | Welcome |
| `/auth/register` | Create account |
| `/auth/login` | Sign in |
| `/auth/verify-email` | 6-digit OTP |
| `/auth/forgot-password` | Request reset OTP |
| `/auth/reset-password` | OTP + new password |
| `/profile/setup` | Learning goal + daily minutes |
| `/sign-in`, `/sign-up` | Redirect to `/auth/*` |

---

## Migration checklist

1. Apply `0012_email_auth.sql` on remote D1.
2. Set `JWT_SECRET` on the Worker (`wrangler secret put`).
3. Configure Resend (or enable `AUTH_DEV_EXPOSE_OTP` only on non-prod).
4. Remove `APP_SECRET` / `NEXT_PUBLIC_APP_SECRET` from Pages env and CI.
5. Deploy API, then Pages (`NEXT_PUBLIC_API_URL` only).
6. Run smoke: `npm run smoke` (public) and `npm run smoke:full` (cookie flow).
7. Existing `user-1` rows remain for legacy data; new users register with unique emails.

---

## Client integration notes

- Browser: `fetch(..., { credentials: "include" })` on all API calls.
- Postman: run **Register → Verify Email** or **Login** first; cookies populate the jar automatically.
- Mobile / CLI: may use `Authorization: Bearer <access-jwt>` from login response body, or implement cookie storage.

See [AUTH-FLOW.md](../AUTH-FLOW.md) for sequence diagrams and security controls.
