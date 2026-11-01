# QA Report — Speak Coach (local production-ready pass)

**Date:** 2026-07-18  
**Environment:** Local Chrome (headed) + Worker API + static `out/` with same-origin `/api` proxy  
**App URL:** http://localhost:4321  
**API:** http://127.0.0.1:8787 (proxied via `/api/*`)

---

## Verdict

**No critical failures remaining** in the automated QA suites run today.

| Suite | Result |
|-------|--------|
| `e2e/qa-autonomous.spec.ts` (desktop headed) | **49 passed** |
| `e2e/auth-flow` + `pages-crawl` + `viewports` (desktop) | **54 passed**, 3 skipped (project filters) |
| `e2e/viewports` (mobile + tablet) | **9 passed**, 5 skipped (project filters) |
| `e2e/learn-flow` | **1 passed** |

**Total executed (non-skipped): 113 passed, 0 failed.**

Chrome was opened on the desktop to http://localhost:4321. Headed Playwright used system Google Chrome.

---

## What was fixed (infra for local QA)

These were required so local auth cookies and e2e match production Pages behavior:

1. **`apps/web/scripts/serve-out.mjs`** — proxies `/api/*` → local Worker (same-origin cookies).
2. **`apps/web/next.config.ts`** — dev rewrites `/api/:path*` → Worker (for `next dev`).
3. **`apps/web/.env.local`** — `NEXT_PUBLIC_API_URL=` empty so the client uses relative `/api`.
4. **`apps/web/src/lib/api.ts`**, `useCoachChat.ts`, `voiceLibrary.ts` — default API base is `""` (same-origin), not hardcoded `:8787`.
5. **`apps/web/e2e/qa-autonomous.spec.ts`** — full crawl: auth forms (valid/invalid), OTP, login/logout, all major routes, nav clicks, responsive overflow checks, API 5xx monitoring.
6. **`playwright.config.ts`** — `PLAYWRIGHT_HEADED=1` opens real Chrome (not headless).

---

## Coverage exercised

- Register (invalid + valid), OTP verify, profile setup, dashboard
- Forgot-password UI, bad login, good login, settings logout
- Public auth pages crawl
- Authenticated crawl of 35+ feature routes (session, coach, voice, shadowing, roleplay, analytics, etc.)
- Settings/profile toggles, explore/dashboard card clicks
- Mobile / tablet / desktop dashboard horizontal overflow
- Session “Continue lesson” + share stays on page
- Health API (`/api/health`) including DB + auth tables

---

## Remaining non-critical / out of scope

| Item | Severity | Notes |
|------|----------|--------|
| Mic / camera features | Low | Need real device media; not fully automated |
| WebSocket coach DO under proxy | Low | HTTP crawl passed; WS upgrade through static `serve-out` not asserted |
| Cross-browser (Safari/Firefox) | Medium | Only Chrome verified |
| Load / security pen-test | Medium | Not in this pass |
| `output: 'export'` + Next rewrites | Info | Rewrites apply in `next dev`; production uses Pages Functions; local static uses `serve-out` proxy |
| Older git history may still contain Cloudflare IDs | Info | Current tree hides `wrangler.jsonc`; history purge optional |

---

## How to re-run

```bash
# Terminal 1 — API
cd workers/api && npx wrangler dev --ip 127.0.0.1 --port 8787

# Terminal 2 — web (after build with empty API URL)
cd apps/web && NEXT_PUBLIC_API_URL= npm run build
API_ORIGIN=http://127.0.0.1:8787 PORT=4321 node scripts/serve-out.mjs

# Headed Chrome QA
cd apps/web
PLAYWRIGHT_HEADED=1 PLAYWRIGHT_CHANNEL=chrome npx playwright test --project=desktop-chrome
```

Open manually: http://localhost:4321
