# Complete Feature Guide

This document is the source-of-truth feature inventory for the current Speak Coach repository.

## Product Summary

Speak Coach is a 90-day English and Hindi speaking coach with:

- A Next.js 15 progressive web app
- A Hono API running on Cloudflare Workers
- Cloudflare D1 for relational data
- Cloudflare R2 for voice recordings
- Workers AI for transcription and coaching
- A Durable Object for real-time coach sessions
- Scheduled reminder and report processing

## Production Services

- Web: `https://speak-coach-3gw.pages.dev`
- API: `https://speak-coach-api.blobforges.workers.dev`
- Health: `https://speak-coach-api.blobforges.workers.dev/api/health`

## Web Feature Inventory

### Account and Setup ✅

Production email authentication with JWT cookies, OTP verification, and multi-user accounts. See [AUTH-FLOW.md](./AUTH-FLOW.md).

| Feature | Route | Status |
|---|---|:---:|
| Registration | `/auth/register` | ✅ |
| Login | `/auth/login` | ✅ |
| Email verification (OTP) | `/auth/verify-email` | ✅ |
| Forgot password | `/auth/forgot-password` | ✅ |
| Reset password | `/auth/reset-password` | ✅ |
| Welcome / auth hub | `/auth` | ✅ |
| JWT access + refresh cookies | `sc_access`, `sc_refresh` | ✅ |
| Token refresh | `POST /api/auth/refresh` | ✅ |
| Session management (`/api/auth/me`, logout) | `/api/auth/*` | ✅ |
| Device sessions (list / revoke) | `GET/DELETE /api/auth/sessions` | ✅ |
| Security settings (lockout, CSRF, session revoke) | `/settings` + auth API | ✅ |
| Profile setup (learning goal) | `/profile/setup` | ✅ |
| Profile | `/profile` | ✅ |
| Settings | `/settings` | ✅ |
| Launch checks | `/launch` | ✅ |

Legacy redirects: `/sign-in` → `/auth/login`, `/sign-up` → `/auth/register`.

### Daily Program

| Feature | Route | Main behavior |
|---|---|---|
| Practice Hub | `/` | Entry point for all practice categories |
| Daily Session | `/session` | Complete the guided 10-step lesson |
| Curriculum | `/curriculum` | Browse the 90-day, 13-week program |
| Journey | `/journey` | View progress across all 90 days |
| Homework | `/homework` | Complete assigned follow-up tasks |
| Comeback | `/comeback` | Short return flow after inactivity |
| Night Review | `/night-review` | Review the day's mistakes and tasks |

### Speaking and Pronunciation

| Feature | Route | Main behavior |
|---|---|---|
| Voice Practice | `/voice` | Record speech and receive voice scores |
| Live Speak | `/live-speak` | Record chunks and display live transcription |
| Shadowing | `/shadowing` | Listen, repeat, and compare accuracy |
| Roleplay | `/roleplay` | Practice scenario-based conversations |
| Sound Gym | `/sound-gym` | Train difficult English and Hindi sounds |
| Listen and Repeat | `/listen-repeat` | Practice comprehension and repetition |
| 60-second Challenge | `/challenge` | Complete a timed fluency exercise |
| Voice Timeline | `/voice-timeline` | Compare voice performance over time |
| Voice Library | `/voice-library` | Browse, play, download, and compare recordings |

### Writing and Corrections

| Feature | Route | Main behavior |
|---|---|---|
| Grammar Fix | `/correct` | Correct English or Roman Hindi and view history |
| WhatsApp Fix | `/whatsapp` | Correct multiple pasted chat lines |
| Paragraph Writing | `/paragraphs/write` | Analyze writing and show a word-level diff |
| Read Aloud | `/paragraphs/read` | Compare spoken words with source text |
| Paragraph History | `/paragraphs/history` | Review past writing and reading attempts |
| Code-switch Tracker | `/code-switch` | Analyze English, Hindi, and mixed-language ratios |

### Learning and Retention

| Feature | Route | Main behavior |
|---|---|---|
| Vocabulary | `/vocabulary` | Study due words with spaced repetition |
| Mistakes | `/mistakes` | Review recurring mistakes as flashcards |
| Phrase Library | `/phrases` | Save and review useful phrases |
| Confidence Journal | `/journal` | Record daily confidence and notes |
| Rewards | `/rewards` | View XP, badges, and achievements |

### Coaching and Progress

| Feature | Route | Main behavior |
|---|---|---|
| AI Coach | `/coach` | Chat through HTTP, streaming, or WebSocket transport |
| Dashboard | `/dashboard` | View streaks, missions, scores, and recent activity |
| Analytics | `/analytics` | View goals, trends, practice mix, and AI insights |
| Reports | `/reports` | View and print the weekly progress report |
| Heatmaps | `/heatmap` | View practice activity and mistake density |
| Explore | `/explore` | Search and open the complete feature catalog |

## Backend Capabilities

The Worker mounts these API groups under `/api`:

- `auth`, `profile`, `settings`
- `dashboard`, `analytics`, `reports`, `export`
- `sessions`, `curriculum`, `journey`, `streak`, `leaderboard`
- `corrections`, `paragraphs`, `mistakes`, `vocabulary`, `phrases`
- `voice`, `shadowing`, `roleplay`, `sound-gym`
- `coach` chat, SSE stream, and WebSocket
- `homework`, `journal`, `night-review`
- `heatmap`, `practice-heatmap`, `code-switch`
- `push` registration and web-push configuration
- `health` dependency checks

## Platform Integrations

| Integration | Purpose |
|---|---|
| D1 | Users, sessions, curriculum, progress, and settings |
| R2 | Voice and practice audio |
| Workers AI | Whisper transcription and AI coaching |
| Durable Objects | Stateful WebSocket coach rooms |
| Cron Triggers | Reminder and weekly-report processing |
| Cloudflare Pages | Static Next.js web deployment |

## Feature Completion Criteria

A feature is complete only when:

- [ ] The user flow works from entry to success.
- [ ] API inputs and outputs are typed and validated.
- [ ] Authentication and ownership rules are enforced.
- [ ] Data persists correctly after refresh.
- [ ] Loading, empty, error, and offline states are understandable.
- [ ] The UI works on mobile and desktop widths.
- [ ] Keyboard navigation and accessible labels are present.
- [ ] Relevant build, type, smoke, and manual tests pass.
- [ ] Environment variables and migrations are documented.
- [ ] Deployment and rollback impact has been considered.
- [ ] `README.md`, this inventory, and API documentation remain accurate.

See [`CODE-REVIEW.md`](CODE-REVIEW.md) for review requirements and [`TESTING.md`](TESTING.md) for verification steps.

## Current Limitations

- Mobile app (`apps/mobile`) may still need a cookie or token adapter for the new auth model.
- AI and push behavior depends on Cloudflare bindings and optional secrets (`RESEND_API_KEY`, VAPID keys).
- Production requires a strong `JWT_SECRET` on the Worker (never in the web bundle).

## Related Documentation

- [`README.md`](README.md) — setup, architecture, and deployment
- [`AUTH-FLOW.md`](AUTH-FLOW.md) — authentication flow, cookies, OTP, and API reference
- [`docs/AUTH-MIGRATION.md`](docs/AUTH-MIGRATION.md) — breaking change from shared-secret auth
- [`ADAPTIVE-LAYOUT.md`](ADAPTIVE-LAYOUT.md) — phone / tablet / desktop shell architecture
- [`docs/COMPLETE_FLOW.md`](docs/COMPLETE_FLOW.md) — detailed application and data flow
- [`CODE-REVIEW.md`](CODE-REVIEW.md) — review checklist
- [`TESTING.md`](TESTING.md) — test plan and release acceptance

