# Speak Coach

Personal 90-day English & Hindi speaking coach — **34 pages, web + mobile, full-stack on Cloudflare**.

## Quick Start

```bash
npm install
cd workers/api && npm run db:migrate && npm run db:seed
cd ../..
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:8787

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15 + PWA |
| API | Cloudflare Workers + Hono |
| Database | D1 (SQLite) |
| Voice | R2 + Workers AI Whisper |
| AI Coach | Workers AI Llama |

## All Features (Phases 1–5)

### Phase 1–2 — Core
- 10-step daily session, Roman Hindi/English correction
- Paragraph write/read labs, voice recording + analytics
- Mistake dictionary, vocabulary, dashboard

### Phase 3 — Smart Coaching
- AI Shadowing, Roleplay (5 scenarios), Sound Gym
- 60-second challenge, weekly reports, XP/badges

### Phase 4 — Polish & Retention
- 90-day journey map, mistake heatmap
- Homework auto-assign, confidence journal
- Phrase library, spaced repetition, night review
- PWA offline, export backup

### Phase 5 — Advanced
- **Live AI Coach Chat** (`/coach`) — ask anything, bilingual coach with memory
- **Live Speak** (`/live-speak`) — real-time transcript while you talk
- **WhatsApp Bulk Correct** (`/whatsapp`) — paste chat lines, fix all at once
- **Hinglish detection** — flags mixed language in bulk correct
- **Chunked transcription** — 4-sec audio chunks → live text on screen
- **Deploy scripts** — `npm run deploy:all`

### Phase 6 — Mobile & Retention
- Expo React Native app, real streak engine, streak freeze
- Comeback session, voice timeline, daily reminders
- Devanagari toggle, coach SSE streaming, curriculum days 2–7

### Phase 7 — Production & Full Curriculum
- **90-day programmatic curriculum** — 13 weekly themes, auto-generated for all 90 days
- **Email auth** — register, OTP verify, JWT cookies (`/auth/*`, `/api/auth/*`)
- **Code-switch tracker** (`/code-switch`) — Hinglish mixing analysis
- **Curriculum map** (`/curriculum`) — see all 13 weekly themes
- **Weekly report PDF** — print/save via HTML export
- **Production deploy** — remote seed, env examples, deploy script

### Phase 8 — Real-Time & Mobile Polish
- **WebSocket coach** — Durable Object streaming at `/api/coach/ws`
- **Mobile reminders** — Expo local push notifications tab
- **PWA icons** — 192/512 PNG icons in manifest
- **Waveform comparison** — voice timeline waveform bars

### Phase 9 — Stabilization
- Fixed all worker TypeScript errors (clean `tsc --noEmit`)
- Runtime-safe file upload guards for Cloudflare Workers

### Phase 10 — Production Launch (NEW)
- **Launch checklist page** (`/launch`) — live smoke tests + readiness status
- **Enhanced health API** — DB, auth, AI, R2, Durable Object checks
- **Smoke test script** — `npm run smoke` tests 12 core endpoints
- **Env validation** — `npm run validate:env` before deploy
- **Static export** — Next.js `output: 'export'` for Cloudflare Pages
- **One-command deploy** — `npm run deploy:all` (migrate + seed + API + Pages + smoke)

### Phase 11 — Analytics & TTS
- **Practice analytics** (`/analytics`) — goals, trends, activity charts, voice averages
- **AI coach insights** — personalized 3-tip summary from your stats
- **Devanagari TTS** — 🔊 Listen button on vocabulary words and Hindi sentences
- **Daily practice goal** — set minutes/day target in Settings, track on Analytics

### Phase 12 — Mobile Parity & Curriculum
- **Mobile daily session** — 10-step flow with progress tracking (Session tab)
- **Mobile profile** — analytics, AI insights, daily goal, Devanagari toggle
- **Mobile TTS** — 🔊 Listen on vocabulary words and Hindi sentences (`expo-speech`)
- **Synced reminders** — mobile reminders save to `user_settings` in D1
- **Per-day curriculum** — sentences/vocab rotate within each week (days 8–90 feel different daily)

### Phase 13 — Mobile Voice & App Builds
- **Mobile voice practice** — record, upload to R2, Whisper transcription (Voice tab)
- **Voice progress** — recent recordings + timeline delta on mobile
- **Mobile audio formats** — API accepts m4a/caf/3gp from iOS/Android
- **EAS build config** — `eas.json` for preview APK / TestFlight builds
- **Mic permissions** — iOS/Android microphone setup for recording

### Phase 14 — Push, Live Speak & Shadowing
- **Server push reminders** — Cron Worker (every 15 min) sends Expo push at reminder time (IST)
- **Push token API** — `/api/push/register` + status; mobile Profile registers on enable
- **Mobile live speak** — chunked transcription on Voice tab (Live Speak mode)
- **Mobile shadowing** — listen, repeat, scored accuracy (Shadow tab)

### Phase 15 — Production, Curriculum & Roleplay (NEW)
- **Full curriculum SQL seed** — days 8–90 in `seed_phase15.sql` (auto-generated from shared curriculum)
- **Production setup script** — `npm run setup:production` guides D1, R2, secrets, EAS
- **Deploy includes phase15 seed** — remote DB gets all 90 days of handcrafted SQL content
- **Mobile roleplay** — 5 scenarios with text replies + AI feedback (Roleplay tab)
- **Web push reminders** — VAPID keys + service worker push handler + subscription register

## Key Pages

| Route | Feature |
|-------|---------|
| `/analytics` | Practice stats, trends, AI insights |
| `/auth` | Welcome — register or login |
| `/auth/login` | Email + password sign-in |
| `/auth/register` | Create account |
| `/auth/verify-email` | 6-digit email OTP |
| `/launch` | Production launch checklist + smoke tests |
| `/voice-timeline` | Compare first vs latest voice recordings |
| `/comeback` | Quick 5-step session after a break |
| `/live-speak` | Real-time voice + live transcript |
| `/whatsapp` | Bulk correct pasted messages |
| `/journey` | 90-day progress map |
| `/session` | Daily 10-step coaching |
| `/shadowing` | Listen → repeat → score |
| `/roleplay` | Scenario conversations |
| + 24 more pages |

## Mobile App (Expo)

Mobile is **not** in the root npm workspace (so it does not pick up web’s Expo 56 / Metro 0.84). Install deps once:

```bash
cd ~/Videos/Speak
npm run fix:mobile       # runs npm install in apps/mobile
```

Then start Expo:

```bash
cd apps/mobile
npm run dev          # or: npm start
```

If Metro errors mention `metro-cache` or `metro_cache_key`, re-run `npm run fix:mobile` from the repo root.

**API must be running** (separate terminal):
```bash
cd ~/Videos/Speak/workers/api && npm run dev
```

On a **physical phone**, point the app at your PC’s LAN IP (not `localhost`):

```bash
EXPO_PUBLIC_API_URL=http://192.168.x.x:8787 npm run dev
```

Tabs: **Home** → **Session** → **Voice** → **Shadow** → **Roleplay** → **Coach** → **Words** → **Profile**

### Build for device (EAS)

```bash
# Install EAS CLI once
npm install -g eas-cli
eas login

# Preview APK (Android) or internal iOS build
cd apps/mobile
EXPO_PUBLIC_API_URL=https://your-api.workers.dev eas build --profile preview --platform android

# Or from repo root
npm run build:mobile:preview
```

## Deploy to Cloudflare

```bash
# 1. Login & create resources
npx wrangler login
npx wrangler d1 create speak-coach
npx wrangler r2 bucket create speak-coach-voice

# 2. Local Wrangler config (gitignored — keeps account/D1 IDs off GitHub)
cp workers/api/wrangler.jsonc.example workers/api/wrangler.jsonc
# Paste database_id from: npx wrangler d1 create speak-coach

# 3. Set secrets (Worker only — never in the web bundle / never commit .dev.vars)
cd workers/api && npx wrangler secret put JWT_SECRET
# Optional: npx wrangler secret put RESEND_API_KEY

# 4. Full production deploy (migrate + seed + API + Pages + smoke test)
export NEXT_PUBLIC_API_URL=https://speak-coach-api.YOUR.workers.dev
npm run setup:production  # one-time Cloudflare resource guide
npm run deploy:all
```

Auth details: [AUTH-FLOW.md](./AUTH-FLOW.md) · migration: [docs/AUTH-MIGRATION.md](./docs/AUTH-MIGRATION.md)

### Useful commands

```bash
npm run validate:env    # Check env before deploy
npm run smoke           # Test API endpoints
npm run deploy:api      # Deploy Worker only
npm run deploy:pages    # Build + deploy frontend only
```

## Daily Practice Flow

1. **Session** → 10 guided steps
2. **Coach** → ask questions / get corrections
3. **Live Speak** → practice with live transcript
4. **Shadowing** or **Roleplay**
5. **WhatsApp Fix** → correct your chat messages
6. **Night Review** → 5-min recap
