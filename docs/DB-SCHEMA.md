# Speak Coach — Database Schema

D1 (SQLite) schema for the API Worker. Source of truth: `workers/api/migrations/*.sql`.

**Naming note:** `sessions` = daily practice. `auth_sessions` = login refresh tokens.

---

## Migration index

| File | What it adds |
|------|----------------|
| `0001_init.sql` | Core learning tables |
| `0002_phase4.sql` | Homework, journal, phrases + vocab review cols |
| `0003_phase5.sql` | AI coach chat sessions |
| `0004_phase6.sql` | User settings |
| `0005_phase7.sql` | Code-switch / Hinglish logs |
| `0006_phase11.sql` | `daily_goal_minutes` on settings |
| `0007_phase14.sql` | Push tokens + reminder sent date |
| `0008_user_profile.sql` | `users.email` |
| `0009_voice_category.sql` | `voice_recordings.category` |
| `0010_weekly_email.sql` | Weekly report email flags |
| `0011_sound_gym_progress.sql` | Sound gym drill progress |
| `0012_email_auth.sql` | Email auth tables + user auth columns |

Seed data: `workers/api/src/db/seed.sql` (and later phase seed SQL files).

---

## Tables

### `users` — learner account & profile

**Defined:** `0001_init.sql` · extended by `0008`, `0012`

| Column | Notes |
|--------|--------|
| `id` | Primary key |
| `name` | Display name |
| `start_date` | Journey start |
| `target_days` | Default 90 |
| `voice_baseline_json` | Baseline voice snapshot |
| `email` | Unique (partial index) |
| `password_hash` | PBKDF2 hash |
| `email_verified` | 0/1 |
| `avatar` | Optional |
| `status` | e.g. `active`, `legacy` |
| `learning_goal` | Onboarding |
| `profile_complete` | 0/1 |
| `created_at` / `updated_at` | Timestamps |

**Used in:** `routes/auth.ts`, `routes/profile.ts`, `services/authUsers.ts`, `services/curriculum.ts`, `routes/journey.ts`, `routes/dashboard.ts`, `routes/analytics.ts`, `routes/export.ts`, `routes/leaderboard.ts`

---

### `sessions` — daily 10-step practice

**Defined:** `0001_init.sql`

| Column | Notes |
|--------|--------|
| `id`, `user_id`, `day_number`, `date` | Identity |
| `completed_steps` | Progress toward 10 |
| `*_score` | motivation, pronunciation, roman_hindi, spoken_en/hi, loudness, clarity |
| `notes`, `created_at` | |

**Used in:** `routes/sessions.ts`, `routes/dashboard.ts`, `routes/analytics.ts`, `routes/journey.ts`, `routes/heatmap.ts`, `routes/practiceHeatmap.ts`, `services/streak.ts`, `services/weeklyReport.ts`, `routes/profile.ts`, `routes/export.ts`, `routes/leaderboard.ts`

---

### `session_steps` — steps inside a daily session

**Defined:** `0001_init.sql`

| Column | Notes |
|--------|--------|
| `session_id`, `step_number` | |
| `status` | pending / done / … |
| `duration_sec`, `data_json` | |

**Used in:** `routes/sessions.ts`

---

### `corrections` — text correction history

**Defined:** `0001_init.sql`

| Column | Notes |
|--------|--------|
| `type` | `roman_hindi`, `english`, `bulk`, … |
| `input_text`, `output_json` | |
| `session_id` | Optional link |

**Used in:** `routes/corrections.ts`, `routes/dashboard.ts`, `routes/analytics.ts`, `routes/heatmap.ts`, `routes/leaderboard.ts`, `services/weeklyReport.ts`

---

### `mistakes` — mistake dictionary

**Defined:** `0001_init.sql`

| Column | Notes |
|--------|--------|
| `wrong_form` | Unique |
| `correct_form`, `category` | |
| `repeat_count`, `last_seen_at`, `mastered_at` | Spaced mastery |

**Used in:** `routes/mistakes.ts`, `services/romanHindi.ts`, `routes/night-review.ts`, `routes/dashboard.ts`, `routes/analytics.ts`, `routes/export.ts`, `services/weeklyReport.ts`, `db/seed.sql`

---

### `voice_recordings` — uploaded speech + analytics

**Defined:** `0001_init.sql` · `category` in `0009`

| Column | Notes |
|--------|--------|
| `r2_key` | Object in R2 bucket |
| `transcript`, `language` | |
| `loudness_score`, `clarity_score`, `pace_wpm`, `pitch_avg_hz`, `filler_count` | |
| `analytics_json`, `category` | Default `general` |
| `session_id` | Optional |

**Used in:** `routes/voice.ts`, `routes/analytics.ts`, `routes/dashboard.ts`, `routes/profile.ts`, `routes/practiceHeatmap.ts`, `routes/night-review.ts`, `services/unifiedTimeline.ts`, `services/weeklyReport.ts`, `routes/leaderboard.ts`

---

### `sentence_voice_metrics` — per-sentence voice breakdown

**Defined:** `0001_init.sql`

Linked to `voice_recordings` via `recording_id`. Timing, volume, pitch, tips.

**Used in:** `routes/voice.ts`

---

### `paragraph_writes` — write lab results

**Defined:** `0001_init.sql`

Input vs corrected text, error counts, accuracy, `mistakes_json` / `diff_json`.

**Used in:** `services/paragraphAnalyzer.ts`, `routes/paragraphs.ts`, `routes/heatmap.ts`, `routes/analytics.ts`

---

### `paragraph_reads` — read-aloud alignment

**Defined:** `0001_init.sql`

Source text vs transcript, word stats, pronunciation %, voice analytics, R2 key.

**Used in:** `routes/paragraphs.ts`, `services/unifiedTimeline.ts`, `services/weeklyReport.ts`, `routes/analytics.ts`

---

### `shadowing_attempts` — listen → repeat scores

**Defined:** `0001_init.sql`

Reference text, transcript, word/pace/volume match, overall score.

**Used in:** `routes/shadowing.ts`, `routes/analytics.ts`, `routes/dashboard.ts`, `routes/leaderboard.ts`, `services/unifiedTimeline.ts`

---

### `roleplay_sessions` — scenario practice

**Defined:** `0001_init.sql`

`scenario`, `turns_json`, avg scores, `completed`.

**Used in:** `routes/roleplay.ts`

---

### `vocabulary` — words + spaced repetition

**Defined:** `0001_init.sql` · review cols in `0002`

| Extra cols (`0002`) | `status`, `last_reviewed_at`, `review_count` |
|---------------------|-----------------------------------------------|

**Used in:** `routes/vocabulary.ts`, `services/curriculum.ts`, `routes/export.ts`, `db/seed.sql`

---

### `daily_sentences` — curriculum sentences by day

**Defined:** `0001_init.sql`

`roman_hindi`, `hindi_script`, `english`, `practiced`.

**Used in:** `services/curriculum.ts`, `db/seed.sql`

---

### `daily_paragraphs` — curriculum paragraphs by day

**Defined:** `0001_init.sql`

`language`, `title`, `content`, `hindi_script`, `difficulty`.

**Used in:** `services/curriculum.ts`, `db/seed.sql`

---

### `homework` — post-session tasks

**Defined:** `0002_phase4.sql`

`tasks_json`, `due_date`, `completed`, optional `session_id`.

**Used in:** `routes/homework.ts`, `routes/sessions.ts`, `routes/night-review.ts`

---

### `journal_entries` — confidence journal

**Defined:** `0002_phase4.sql`

One row per `date` (unique): mood before/after, reflection.

**Used in:** `routes/journal.ts`, `routes/export.ts`

---

### `phrase_library` — saved corrected phrases

**Defined:** `0002_phase4.sql`

`original`, `corrected`, `language`, `category`.

**Used in:** `routes/phrases.ts`, `routes/export.ts`

---

### `coach_sessions` — AI coach chat memory

**Defined:** `0003_phase5.sql`

`title`, `messages_json`, `created_at`, `updated_at`.

**Used in:** `routes/coach.ts`, `services/coach.ts` (also coach stream / Durable Object path)

---

### `user_settings` — preferences & reminders

**Defined:** `0004_phase6.sql` · extended `0006`, `0007`, `0010`

| Column | From |
|--------|------|
| `reminder_enabled`, `reminder_time` | `0004` |
| `streak_freezes`, `last_freeze_week` | `0004` |
| `devanagari_preferred` | `0004` |
| `daily_goal_minutes` | `0006` |
| `last_reminder_sent_date` | `0007` |
| `weekly_report_email`, `last_weekly_email_sent` | `0010` |

**Used in:** `routes/settings.ts`, `routes/auth.ts`, `services/streak.ts`, `services/push.ts`, `services/weeklyReport.ts`, `routes/push.ts`, `routes/analytics.ts`, `routes/practiceHeatmap.ts`, `scheduled.ts`

---

### `code_switch_logs` — Hinglish mixing analysis

**Defined:** `0005_phase7.sql`

English/Hindi ratios, mixed score, sample text.

**Used in:** `routes/codeSwitch.ts`

---

### `push_tokens` — mobile/web push devices

**Defined:** `0007_phase14.sql`

`user_id`, unique `token`, `platform`.

**Used in:** `routes/push.ts`, `services/push.ts`

---

### `sound_gym_progress` — pronunciation drills done

**Defined:** `0011_sound_gym_progress.sql`

PK `(user_id, drill_id)`, optional loudness/clarity scores.

**Used in:** `routes/soundGym.ts`

---

## Auth tables (`0012_email_auth.sql`)

### `auth_sessions` — refresh token sessions (cookies)

`refresh_token_hash`, browser/device/ip, `expires_at`, `revoked_at`.

**Used in:** `services/sessions.ts`, `routes/auth.ts`

### `email_verifications` — signup OTP

`otp_hash`, `expires_at`, `attempts`, `verified_at`.

**Used in:** `services/authUsers.ts`, `routes/auth.ts`

### `password_resets` — forgot-password OTP

Same shape as email verifications + `used_at`.

**Used in:** `services/authUsers.ts`, `routes/auth.ts`

### `auth_lockouts` — login rate limits

Per-email attempts + `locked_until`.

**Used in:** `routes/auth.ts`

### `ws_tokens` — one-time WebSocket upgrade tokens

**Used in:** `routes/auth.ts`, `routes/coachWs.ts`

### `auth_audit_logs` — auth event trail

`action`, ip, user_agent, `meta_json`.

**Used in:** `services/authUsers.ts`

### `csrf_tokens` — CSRF bound to refresh session

**Used in:** auth / session helpers (`services/sessions.ts`, auth middleware)

---

## Quick purpose map

| Area | Tables |
|------|--------|
| Account & auth | `users`, `auth_sessions`, `email_verifications`, `password_resets`, `auth_lockouts`, `ws_tokens`, `auth_audit_logs`, `csrf_tokens` |
| Daily practice | `sessions`, `session_steps`, `homework` |
| Corrections & mistakes | `corrections`, `mistakes`, `phrase_library` |
| Voice | `voice_recordings`, `sentence_voice_metrics`, `shadowing_attempts`, `sound_gym_progress` |
| Paragraphs | `paragraph_writes`, `paragraph_reads` |
| Curriculum | `daily_sentences`, `daily_paragraphs`, `vocabulary` |
| Coach | `coach_sessions` |
| Roleplay | `roleplay_sessions` |
| Retention | `journal_entries`, `user_settings`, `push_tokens`, `code_switch_logs` |

All route/service paths above are under `workers/api/src/`.
