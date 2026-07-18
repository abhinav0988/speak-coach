# Speak Coach — Testing Guide

**Updated:** 2026-07-17  
**Live:** https://speak-coach-3gw.pages.dev · API https://speak-coach-api.blobforges.workers.dev

Inventory of **all testing types**, how to run them, and coverage map.

---

## Quick status

| Type | Status | Count | Command |
|------|--------|------:|---------|
| Unit — web | ✅ | **22** | `npm run test:web` |
| Unit — worker | ✅ | **58** | `npm run test:worker` |
| Smoke — raw API | ✅ | **2** checks | `npm run smoke` |
| Smoke — full API/web | ✅ | **16** asserts | `npm run smoke:full` |
| Viewport E2E (Playwright) | ✅ | **16** run · 3 tiers | `npm run test:views` |
| Typecheck / build | ✅ | — | worker `tsc` · web `build` |
| Lint | ✅ (warn) | — | `npm run lint -w @speak-coach/web` |
| All-in-one | ✅ | — | `npm run test:all` (repo root) |

**Totals:** **110 automated checks** (76 unit + 16 full smoke + 2 raw smoke + 16 viewport).

---

## Test pyramid

```text
                    ┌─────────────────────┐
                    │  Viewport E2E       │  ← Playwright (phone / tablet / desktop)
                    │  (16 run)           │
                ┌───┴─────────────────────┴───┐
                │  Live smoke (API/web)       │  ← smoke (2) + smoke:full (16)
                │                             │
            ┌───┴─────────────────────────────┴───┐
            │  Unit (libs) + tsc + build + lint   │  ← 76 unit
            └─────────────────────────────────────┘
```

---

## 1. Unit tests

Both packages use **Vitest** (`vitest run`).

### Web — `apps/web`

| | |
|--|--|
| **Files** | `src/lib/*.test.ts` (4 files) |
| **Script** | `npm run test:web` |
| **Count** | **22** |

| Suite | File | Cases |
|-------|------|------:|
| `voiceAnalytics` | `voiceAnalytics.test.ts` | 7 |
| `greeting` | `greeting.test.ts` | 8 |
| `fillerWords` | `fillerWords.test.ts` | 4 |
| `adaptive-layout` | `adaptive-layout.test.ts` | 3 |

Covers: dBFS/loudness scoring · voice tips · day-period greeting + nudges · filler counting (English + Hindi) · phone/tablet/desktop tier resolution.

### Worker — `workers/api`

| | |
|--|--|
| **Files** | `src/**/*.test.ts` (9 files) |
| **Script** | `npm run test:worker` |
| **Count** | **58** |

| Suite | File | Cases |
|-------|------|------:|
| `analyzeCodeSwitch` | `services/codeSwitch.test.ts` | 5 |
| `wordAlignment` | `services/wordAlignment.test.ts` | 11 |
| `computeFluencyScore` | `services/fluencyScore.test.ts` | 5 |
| `romanHindi` | `services/romanHindi.test.ts` | 7 |
| `correctEnglishSync` | `services/englishFix.test.ts` | 5 |
| `computeStreak` | `services/streak.test.ts` | 6 |
| `scoreVoiceAnalytics` | `services/voiceScoring.test.ts` | 4 |
| `utils` | `utils.test.ts` | 6 |
| `password / OTP` | `services/password.test.ts` | 5 |
| `JWT access / WS` | `services/jwt.test.ts` | 4 |

Covers: Hinglish detection · word alignment · fluency scoring · Roman Hindi correction · English grammar · streak logic · voice analytics · id/date helpers · **password hashing (PBKDF2), validation rules, OTP generation, SHA-256 hashing**.

---

## 2. Smoke tests (live)

Env defaults to the production deploy.

| Variable | Default | Purpose |
|----------|---------|---------|
| `API_URL` | `https://speak-coach-api.blobforges.workers.dev` | Worker base URL |
| `WEB_URL` | `https://speak-coach-3gw.pages.dev` | Pages deploy (smoke:full only) |
| `SMOKE_EMAIL` | `smoke_<timestamp>@example.com` | Ephemeral register email |
| `SMOKE_PASSWORD` | `SmokeTest1!` | Register/login password |

**No `APP_SECRET`.** Raw smoke uses only public routes. Full smoke registers a user, verifies email via `devOtp` (requires Worker `AUTH_DEV_EXPOSE_OTP=true` when Resend is not configured), exercises cookie session + CSRF logout/login.

### Smoke A — raw API (`npm run smoke`) — **2 checks**

`scripts/smoke-test.sh` — public health + protected route rejects unauthenticated callers:

- `GET /api/health` → **2xx**
- `GET /api/dashboard` without cookies → **401**

### Smoke B — full suite (`npm run smoke:full`) — **16 asserts**

`scripts/smoke-full.mjs` — cookie jar flow:

| Section | Coverage |
|---------|----------|
| Routing / deploy | Web root **200**; health 200 + `jwtConfigured` + `authTables` |
| Register + verify | `POST /api/auth/register` → `devOtp` → `POST /api/auth/verify-email` → `sc_access` / `sc_refresh` cookies |
| Session | `GET /api/auth/me`, `GET /api/dashboard` with cookies |
| Unauthorized | dashboard without cookies → **401** |
| Logout + login | `POST /api/auth/logout` (CSRF) → `POST /api/auth/login` → CSRF token returned |

Local full smoke:

```bash
# workers/api/.dev.vars
JWT_SECRET=dev-secret-at-least-32-characters-long
AUTH_DEV_EXPOSE_OTP=true

cd workers/api && npm run dev   # terminal 1
API_URL=http://localhost:8787 WEB_URL=http://localhost:3000 npm run smoke:full
```

---

## 3. Viewport E2E (Playwright)

Tests **phone**, **tablet**, and **desktop** adaptive layouts against the built static export.

| | |
|--|--|
| **Config** | `apps/web/playwright.config.ts` |
| **Spec** | `apps/web/e2e/viewports.spec.ts` |
| **Helpers** | `apps/web/e2e/helpers.ts` |
| **Static server** | `apps/web/scripts/serve-out.mjs` |
| **Script** | `npm run test:views` |
| **Executed** | **16** (30 incl. cross-tier skips) |

### Viewports

| Project | Size | What it validates |
|---------|------|-------------------|
| `desktop-chrome` | 1440×900 | Bottom nav + FAB hidden; API host embedded in bundle; no horizontal scroll |
| `mobile-iphone` | 390×844 | Bottom nav + FAB visible; touch targets ≥ 40px; shell renders |
| `tablet-ipad` | 834×1194 | Two-pane rail visible; bottom nav hidden; no horizontal scroll |

Shared checks run on all three tiers: shell renders, no horizontal scroll on landing, sign-in page renders.

### Run locally

```bash
# Build first (preview server auto-starts via playwright webServer)
npm run build
npm run test:views --prefix apps/web

# Against the live deploy
PLAYWRIGHT_BASE_URL=https://speak-coach-3gw.pages.dev npm run test:views --prefix apps/web
```

First run needs Chromium: `cd apps/web && npx playwright install chromium`

HTML report: `apps/web/playwright-report/index.html`

---

## 4. Static gates

| Check | Command |
|-------|---------|
| Worker types | `npm run typecheck:worker` |
| Web build (static export) | `npm run build` |
| Lint | `npm run lint -w @speak-coach/web` |
| Deploy env validation | `npm run validate:env` |

---

## 5. CI

**File:** `.github/workflows/ci.yml`

| Job | Gates |
|-----|-------|
| `worker` | `typecheck:worker` · `test:worker` |
| `frontend` | `test:web` · `build` · **Playwright viewports** · `lint` |
| `smoke` | `smoke` · `smoke:full` (main branch only; no secrets — full smoke needs `AUTH_DEV_EXPOSE_OTP` on Worker) |

Root helper: `npm run test:all`

---

## 6. Run everything

```bash
npm run test:all
```

Piecemeal:

```bash
npm run test:worker
npm run typecheck:worker
npm run test:web
npm run build
npm run test:views
npm run smoke
npm run smoke:full
```

---

## 7. Coverage map

| Feature | Unit | Smoke | Viewport | Status |
|---------|:----:|:-----:|:--------:|--------|
| Health / readiness | | ✅ | | Working |
| Auth register / verify / login (cookies) | | ✅ | `/auth/*` forms | Working |
| Protected routes need session | | ✅ | | Working |
| Dashboard / analytics / journey | | ✅ | | Working |
| Roman Hindi correction + diff | ✅ | ✅ | | Working |
| English grammar fix | ✅ | ✅ | | Working |
| Code-switch (Hinglish) detection | ✅ | ✅ | | Working |
| Voice scoring / analytics | ✅ | ✅ | | Working |
| Streak logic | ✅ | ✅ | | Working |
| Word alignment / reading | ✅ | | | Working |
| Phone bottom nav + FAB | | | ✅ | Working |
| Tablet two-pane rail | | | ✅ | Working |
| Desktop multi-panel shell | | | ✅ | Working |
| API host embedded in bundle | | ✅ | ✅ | Working |

---

## 8. File index

```text
TESTING.md
package.json                         # test:all, test:web, test:worker, test:views, smoke, smoke:full
.github/workflows/ci.yml
scripts/smoke-test.sh                # raw smoke (2 checks)
scripts/smoke-full.mjs               # full smoke (16 asserts)
apps/web/vitest.config.ts
apps/web/playwright.config.ts
apps/web/scripts/serve-out.mjs
apps/web/e2e/viewports.spec.ts
apps/web/e2e/helpers.ts
apps/web/src/lib/voiceAnalytics.test.ts
apps/web/src/lib/greeting.test.ts
apps/web/src/lib/fillerWords.test.ts
apps/web/src/lib/adaptive-layout.test.ts
workers/api/vitest.config.ts
workers/api/src/services/codeSwitch.test.ts
workers/api/src/services/wordAlignment.test.ts
workers/api/src/services/fluencyScore.test.ts
workers/api/src/services/romanHindi.test.ts
workers/api/src/services/englishFix.test.ts
workers/api/src/services/streak.test.ts
workers/api/src/services/voiceScoring.test.ts
workers/api/src/services/password.test.ts
workers/api/src/services/jwt.test.ts
workers/api/src/utils.test.ts
```

---

## 9. Counting cheat-sheet

| Bucket | Number |
|--------|-------:|
| Unit — web | **22** |
| Unit — worker | **58** |
| Smoke asserts (full) | **16** |
| Smoke checks (raw) | **2** |
| Viewport E2E (executed) | **16** |
| **Automated total** | **110** |

When adding a feature: **unit** for pure logic (`src/lib` or worker `services`) · **smoke assert** for every new public route · **viewport test** for responsive UI changes.
