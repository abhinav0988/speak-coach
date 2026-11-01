# End-to-End Use Cases — Speak Coach

Complete E2E test catalog derived from [COMPLETE-FEATURE.md](../COMPLETE-FEATURE.md).  
Use with [QA-ENGINEER-PROMPT.md](./QA-ENGINEER-PROMPT.md) and Playwright under `apps/web/e2e/`.

**App:** Speak Coach (web + Cloudflare Worker API)  
**Viewports:** Mobile (390×844), Tablet (834×1194), Desktop (1440×900)  
**Monitor on every case:** console errors, JS exceptions, failed network, API ≥500, blank pages, unexpected auth redirects

### Priority legend

| Priority | Meaning |
|----------|---------|
| P0 | Must pass before any release |
| P1 | Core product flows |
| P2 | Important secondary features |
| P3 | Polish / edge / optional integrations |

### Status columns (for execution)

Fill `Pass` / `Fail` / `Blocked` when running.

---

## 1. Account & authentication

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| AUTH-01 | Welcome hub | Open `/auth` | Register + Login CTAs visible; no console errors | P0 | |
| AUTH-02 | Register — empty form | Submit register with empty fields | Stays on `/auth/register`; validation messages | P0 | |
| AUTH-03 | Register — invalid email | Email `not-an-email` | Rejected; no account created | P0 | |
| AUTH-04 | Register — weak password | Password `< 8` chars / missing rules | Rejected; requirements shown (8+ chars etc.) | P0 | |
| AUTH-05 | Register — password mismatch | Confirm ≠ password | Rejected | P0 | |
| AUTH-06 | Register — happy path | Valid name, email, password | Redirect `/auth/verify-email`; OTP available (dev) or emailed | P0 | |
| AUTH-07 | Verify email — wrong OTP | Enter `000000` | Error; not verified | P0 | |
| AUTH-08 | Verify email — correct OTP | Enter valid OTP | Redirect `/profile/setup`; cookies set | P0 | |
| AUTH-09 | Profile setup | Choose learning goal → daily minutes → finish | Lands on dashboard/home; `profileComplete` | P0 | |
| AUTH-10 | Login — wrong password | Valid email + wrong password | Error; stay on `/auth/login` | P0 | |
| AUTH-11 | Login — unknown email | Fake email | Error; no session | P0 | |
| AUTH-12 | Login — happy path | Verified user credentials | Leaves auth; dashboard accessible | P0 | |
| AUTH-13 | Forgot password — invalid email | Bad email format | Validation error | P1 | |
| AUTH-14 | Forgot password — valid email | Existing email | Success / OTP path to reset | P0 | |
| AUTH-15 | Reset password — weak/mismatch | Invalid new password | Rejected | P0 | |
| AUTH-16 | Reset password — happy path | Valid OTP + new password | Can login with new password; old fails | P0 | |
| AUTH-17 | Protected route guard | Logout → open `/dashboard` | Redirect `/auth/login` | P0 | |
| AUTH-18 | Logout | Settings → Sign out | Cookies cleared; `/auth/login`; `/api/auth/me` → 401 | P0 | |
| AUTH-19 | Token refresh | Wait / force 401 then retry | `POST /api/auth/refresh` restores session | P1 | |
| AUTH-20 | Device sessions list | Settings / sessions API | Lists active sessions | P2 | |
| AUTH-21 | Revoke other session | Revoke a session id | That session cannot refresh | P2 | |
| AUTH-22 | Login lockout | Many bad logins | Lockout message; later unlock | P1 | |
| AUTH-23 | Legacy redirects | `/sign-in`, `/sign-up` | Redirect to `/auth/login`, `/auth/register` | P2 | |
| AUTH-24 | CSRF on mutating APIs | PATCH without CSRF | 403 / rejected | P1 | |
| AUTH-25 | Duplicate register | Same email twice | Clear error; no second account | P1 | |

---

## 2. Profile & settings

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| PROF-01 | View profile | Open `/profile` | Name, email, progress stats load | P0 | |
| PROF-02 | Edit profile name | Change name → save | Persists after refresh | P1 | |
| PROF-03 | Settings page loads | Open `/settings` | Reminder, goals, Devanagari, email prefs visible | P0 | |
| PROF-04 | Toggle reminder | Enable/disable reminder + time | Saved via API; reload keeps value | P1 | |
| PROF-05 | Daily goal minutes | Set minutes/day | Saved; analytics uses new goal | P1 | |
| PROF-06 | Devanagari preference | Toggle | Preference persists | P2 | |
| PROF-07 | Weekly report email | Toggle weekly email | Flag saved | P2 | |
| PROF-08 | Streak freeze display | View settings / streak | Freeze count shown coherently | P2 | |

---

## 3. Navigation & shell

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| NAV-01 | Practice hub | Open `/` authenticated | Categories / CTAs; links work | P0 | |
| NAV-02 | Explore catalog | `/explore` → search / open cards | Features open correct routes | P1 | |
| NAV-03 | Side / bottom nav | Click every nav item | Correct page; no 5xx | P0 | |
| NAV-04 | Mega menu / tabs | Open every menu entry | No dead links | P1 | |
| NAV-05 | Soft 404 | Unknown path | Friendly 404; app shell intact | P2 | |
| NAV-06 | Responsive shell mobile | 390×844 crawl key pages | No horizontal overflow; touch targets ≥40px | P0 | |
| NAV-07 | Responsive shell tablet | 834×1194 | Layout usable; no overflow | P0 | |
| NAV-08 | Responsive shell desktop | 1440×900 | Side nav / desktop chrome correct | P0 | |

---

## 4. Daily program

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| DAY-01 | Start / resume session | `/session` | Today’s session loads or creates | P0 | |
| DAY-02 | Continue lesson | Click Continue Lesson | Scrolls/expands to step; `#lesson-step-N` visible | P0 | |
| DAY-03 | Complete a step | Mark step done | Progress updates; API persists | P0 | |
| DAY-04 | Complete lesson | Finish flow | Lesson complete UI; stay on `/session` | P1 | |
| DAY-05 | Share lesson | Click Share | Native share or clipboard; **no** navigate away | P1 | |
| DAY-06 | Curriculum map | `/curriculum` | 13 weeks / 90 days browseable | P1 | |
| DAY-07 | Journey map | `/journey` | Days show completed vs pending | P1 | |
| DAY-08 | Homework list | `/homework` | Tasks load; empty state OK | P1 | |
| DAY-09 | Complete homework | Mark task done | Status persists | P1 | |
| DAY-10 | Comeback session | `/comeback` | Short flow runs end-to-end | P2 | |
| DAY-11 | Night review | `/night-review` | Mistakes + homework summary shown | P1 | |

---

## 5. Speaking & pronunciation

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| VOI-01 | Voice page loads | `/voice` | Record UI; permissions prompt when used | P0 | |
| VOI-02 | Record + upload | Record short clip → submit | R2 upload; scores/transcript returned | P0 | |
| VOI-03 | Voice without mic | Deny permission | Clear error; no crash | P1 | |
| VOI-04 | Live Speak | `/live-speak` chunked speak | Live transcript updates | P1 | |
| VOI-05 | Shadowing — play ref | `/shadowing` play reference | Audio plays | P1 | |
| VOI-06 | Shadowing — submit | Record repeat → score | Accuracy metrics shown + stored | P1 | |
| VOI-07 | Roleplay start | `/roleplay` pick scenario | Session created; turns UI | P1 | |
| VOI-08 | Roleplay reply | Send text/voice turn | AI feedback; history updates | P1 | |
| VOI-09 | Sound Gym drill | `/sound-gym` complete drill | Progress saved | P2 | |
| VOI-10 | Listen & Repeat | `/listen-repeat` cycle | Completes without crash | P2 | |
| VOI-11 | 60s Challenge | `/challenge` start → finish | Timer + result shown | P2 | |
| VOI-12 | Voice timeline | `/voice-timeline` | First vs latest comparison | P2 | |
| VOI-13 | Voice library list | `/voice-library` | List/play/download links work | P2 | |
| VOI-14 | Voice library compare | Select two recordings | Comparison UI works | P3 | |

---

## 6. Writing & corrections

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| WR-01 | Grammar Fix empty | `/correct` submit empty | Validation; no API spam | P1 | |
| WR-02 | Correct English | Paste English with errors | Corrected text + history entry | P0 | |
| WR-03 | Correct Roman Hindi | Paste Roman Hindi | Corrections + mistakes updated | P0 | |
| WR-04 | WhatsApp bulk empty | `/whatsapp` empty submit | Validation | P1 | |
| WR-05 | WhatsApp bulk valid | Paste multi-line chat | All lines corrected; Hinglish flags if mixed | P1 | |
| WR-06 | Paragraph write empty | `/paragraphs/write` empty | Validation | P1 | |
| WR-07 | Paragraph write analyze | Submit paragraph | Diff, accuracy, mistakes shown + stored | P0 | |
| WR-08 | Paragraph read | `/paragraphs/read` record vs source | Alignment % + analytics | P1 | |
| WR-09 | Paragraph history | `/paragraphs/history` | Past writes/reads listed; open detail | P1 | |
| WR-10 | Code-switch analyze | `/code-switch` paste mixed text | EN/HI ratios + log saved | P2 | |
| WR-11 | Code-switch history | View recent logs | List loads | P2 | |

---

## 7. Learning & retention

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| LR-01 | Vocabulary due list | `/vocabulary` | Due words load | P0 | |
| LR-02 | Review word — know | Mark known | Ease / next_review updates | P1 | |
| LR-03 | Review word — again | Mark again | Comes back sooner | P1 | |
| LR-04 | Vocabulary TTS | Click Listen | Speech plays (web speech / TTS) | P2 | |
| LR-05 | Mistakes dictionary | `/mistakes` | Flashcards / list of recurring mistakes | P1 | |
| LR-06 | Mistake drill | Flip / mark mastered | State updates | P2 | |
| LR-07 | Phrase library empty | `/phrases` | Empty state | P2 | |
| LR-08 | Save phrase | Add original + corrected | Appears in list; category filter | P1 | |
| LR-09 | Delete phrase | Delete item | Removed after refresh | P2 | |
| LR-10 | Journal create | `/journal` mood + reflection | Saved for today | P1 | |
| LR-11 | Journal edit same day | Update entry | Upsert; one row per date | P1 | |
| LR-12 | Rewards page | `/rewards` | XP/badges render; empty OK | P2 | |

---

## 8. Coaching & progress

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| CO-01 | Coach page loads | `/coach` | Chat UI; past sessions if any | P0 | |
| CO-02 | Coach HTTP send | Send message | Reply stored in session | P0 | |
| CO-03 | Coach SSE stream | Stream mode message | Tokens stream; final message saved | P1 | |
| CO-04 | Coach WebSocket | WS mode connect + message | Real-time reply via DO | P1 | |
| CO-05 | Coach offline / API down | Kill API mid-chat | Clear error; no uncaught exception | P1 | |
| CO-06 | Dashboard loads | `/dashboard` | Streak, missions, scores, activity | P0 | |
| CO-07 | Analytics loads | `/analytics` | Goals, trends, charts, insights | P1 | |
| CO-08 | Analytics AI insights | Request insights | Tips render or graceful empty | P2 | |
| CO-09 | Weekly report | `/reports` | Report data; print/export HTML | P1 | |
| CO-10 | Heatmap | `/heatmap` | Activity / mistake density | P2 | |
| CO-11 | Practice heatmap | Related heatmap views | Data or empty state | P2 | |
| CO-12 | Launch checklist | `/launch` | Smoke checks run; statuses shown | P1 | |
| CO-13 | Export / backup | Trigger export if UI present | Download / JSON without error | P2 | |
| CO-14 | Leaderboard / streak API | Via dashboard widgets | Numbers consistent with sessions | P2 | |

---

## 9. Push & notifications (optional)

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| PUSH-01 | Register push token | Enable reminders + register | Token stored in `push_tokens` | P2 | |
| PUSH-02 | VAPID public key | Fetch vapid endpoint | Key or null if unset | P3 | |
| PUSH-03 | Unregister token | Disable | Token removed | P3 | |

---

## 10. Platform & security smoke

| ID | Use case | Steps | Expected | Priority | Status |
|----|----------|-------|----------|----------|--------|
| PLAT-01 | Health endpoint | `GET /api/health` | `status: ok`; DB + auth tables true | P0 | |
| PLAT-02 | Unauthenticated API | `GET` protected without cookies | 401 | P0 | |
| PLAT-03 | Cross-user isolation | User A cannot read User B session data | 403/empty/own data only | P0 | |
| PLAT-04 | Bundle has no secrets | Inspect built JS | No `JWT_SECRET`, Resend keys, legacy `APP_SECRET` | P0 | |
| PLAT-05 | Same-origin cookies | Login via `/api` proxy | `sc_access` / refresh first-party | P0 | |
| PLAT-06 | PWA offline shell | Go offline after load | Cached shell; clear offline messaging | P3 | |
| PLAT-07 | Service worker | Register / unregister | Does not break auth cookies | P2 | |

---

## 11. Cross-cutting acceptance (every feature)

For each feature above, also verify:

1. **Loading** state is shown (not blank flash forever).
2. **Empty** state is understandable when no data.
3. **Error** state is user-readable (API down, 4xx/5xx).
4. **Persistence** survives hard refresh.
5. **Auth** required routes redirect when logged out.
6. **A11y** — interactive controls have accessible names; keyboard can reach primary actions.
7. **Responsive** — no horizontal scroll at mobile/tablet/desktop.
8. **No** uncaught `pageerror` or API 5xx during the happy path.

---

## 12. Suggested Playwright mapping

| Spec file | Covers |
|-----------|--------|
| `e2e/auth-flow.spec.ts` | AUTH-06…18 core |
| `e2e/qa-autonomous.spec.ts` | Crawl + forms + responsive + health |
| `e2e/pages-crawl.spec.ts` | Route smoke all pages |
| `e2e/learn-flow.spec.ts` | DAY-02…05 |
| `e2e/viewports.spec.ts` | NAV-06…08 |
| *To add* | Voice/mic (VOI-*), coach WS (CO-04), push (PUSH-*), isolation (PLAT-03) |

---

## 13. Release gate (minimum P0 set)

Ship only if all **P0** IDs pass on Chrome desktop + at least one mobile viewport smoke:

- AUTH-01, 02, 06, 08, 09, 12, 16, 17, 18  
- PROF-01, 03  
- NAV-01, 03, 06  
- DAY-01, 02  
- VOI-01, 02 (or blocked with documented mic limitation)  
- WR-02, 03, 07  
- LR-01  
- CO-01, 02, 06  
- PLAT-01, 02, 03, 04, 05  

---

## 14. Traceability to product areas

| Product area (COMPLETE-FEATURE) | Use case IDs |
|---------------------------------|--------------|
| Account and Setup | AUTH-*, PROF-* |
| Daily Program | DAY-* |
| Speaking and Pronunciation | VOI-* |
| Writing and Corrections | WR-* |
| Learning and Retention | LR-* |
| Coaching and Progress | CO-* |
| Platform / Integrations | PLAT-*, PUSH-* |
| Shell / Explore | NAV-* |

---

*Source of truth for features: `COMPLETE-FEATURE.md`. Update this file when routes or flows change.*
