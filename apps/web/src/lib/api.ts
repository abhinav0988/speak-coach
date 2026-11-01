"use client";

// Empty string = same-origin `/api` (Pages Functions / next rewrites / serve-out proxy).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const CSRF_KEY = "speak-coach-csrf";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  avatar: string | null;
  status: string;
  startDate: string;
  targetDays: number;
  learningGoal: string | null;
  profileComplete: boolean;
};

function getCsrf(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem(CSRF_KEY) ?? undefined;
}

export { getCsrf };

export function setCsrf(token: string | null | undefined) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(CSRF_KEY, token);
  else localStorage.removeItem(CSRF_KEY);
}

async function request<T = any>(path: string, options?: RequestInit & { csrf?: boolean }): Promise<T> {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string> | undefined),
  };
  if (options?.csrf) {
    const csrf = getCsrf();
    if (csrf) headers["X-CSRF-Token"] = csrf;
  }
  // Only set JSON content-type for string bodies; FormData must set its own multipart boundary
  if (typeof options?.body === "string" && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (res.status === 401 && path !== "/api/auth/login" && path !== "/api/auth/refresh") {
    const refreshed = await fetch(`${API_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) {
      const data = (await refreshed.json()) as { csrfToken?: string };
      if (data.csrfToken) setCsrf(data.csrfToken);
      const retry = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
          ...headers,
          ...(data.csrfToken ? { "X-CSRF-Token": data.csrfToken } : {}),
        },
      });
      if (!retry.ok) {
        const err = await retry.json().catch(() => ({ error: retry.statusText }));
        throw new Error((err as { error?: string }).error ?? "Request failed");
      }
      return retry.json() as Promise<T>;
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const message = (err as { error?: string; next?: string }).error ?? "Request failed";
    const error = new Error(message) as Error & { status?: number; next?: string; email?: string };
    error.status = res.status;
    error.next = (err as { next?: string }).next;
    error.email = (err as { email?: string }).email;
    throw error;
  }
  return res.json() as Promise<T>;
}

export const api = {
  getHealth: () => request<import("@speak-coach/shared").HealthStatus>("/api/health"),

  register: (data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    turnstileToken?: string;
  }) =>
    request<{ ok: boolean; email: string; next: string; message: string; devOtp?: string }>(
      "/api/auth/register",
      { method: "POST", body: JSON.stringify(data) }
    ),

  login: (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
    turnstileToken?: string;
  }) =>
    request<{ ok: boolean; user: AuthUser; next: string; csrfToken: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      setCsrf(res.csrfToken);
      return res;
    }),

  logout: () =>
    request<{ ok: boolean }>("/api/auth/logout", { method: "POST", csrf: true }).finally(() =>
      setCsrf(null)
    ),

  refresh: () =>
    request<{ ok: boolean; csrfToken: string }>("/api/auth/refresh", { method: "POST" }).then(
      (res) => {
        setCsrf(res.csrfToken);
        return res;
      }
    ),

  me: () =>
    request<{
      user: AuthUser;
      sessions: unknown[];
      currentSessionId: string;
      csrfToken: string | null;
    }>("/api/auth/me"),

  verifyEmail: (data: { email: string; otp: string }) =>
    request<{
      ok: boolean;
      next: string;
      csrfToken?: string;
      user?: AuthUser | null;
    }>("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.csrfToken) setCsrf(res.csrfToken);
      return res;
    }),

  resendOtp: (data: { email: string; purpose?: "verify" | "reset" }) =>
    request<{ ok: boolean; message: string; devOtp?: string }>("/api/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: (data: { email: string; turnstileToken?: string }) =>
    request<{ ok: boolean; next: string; message: string; devOtp?: string }>(
      "/api/auth/forgot-password",
      { method: "POST", body: JSON.stringify(data) }
    ),

  resetPassword: (data: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) =>
    request<{ ok: boolean; next: string }>("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  wsToken: () =>
    request<{ token: string; expiresIn: number }>("/api/auth/ws-token", {
      method: "POST",
      csrf: true,
    }),

  profileSetup: (data: {
    learningGoal?: string;
    dailyGoalMinutes?: number;
    targetDays?: number;
  }) =>
    request<{ ok: boolean; user: AuthUser; next: string }>("/api/auth/profile-setup", {
      method: "PATCH",
      body: JSON.stringify(data),
      csrf: true,
    }),

  listSessions: () =>
    request<{ sessions: unknown[]; currentSessionId: string }>("/api/auth/sessions"),

  revokeSession: (id: string) =>
    request<{ ok: boolean }>(`/api/auth/sessions/${id}`, { method: "DELETE", csrf: true }),

  getProfile: () =>
    request<{
      profile: import("@speak-coach/shared").UserProfile;
      stats: import("@speak-coach/shared").UserProfileStats;
    }>("/api/profile"),
  updateProfile: (data: { name?: string; email?: string }) =>
    request<{ profile: import("@speak-coach/shared").UserProfile }>("/api/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
      csrf: true,
    }),
  getDashboard: () => request<import("@speak-coach/shared").ExtendedDashboard>("/api/dashboard"),
  startSession: () =>
    request<{ id: string; dayNumber: number; existing: boolean }>("/api/sessions", {
      method: "POST",
      csrf: true,
    }),
  getTodaySession: () => request<{ session: unknown; steps: unknown[] }>("/api/sessions/today"),
  updateStep: (sessionId: string, data: unknown) =>
    request(`/api/sessions/${sessionId}/step`, {
      method: "PATCH",
      body: JSON.stringify(data),
      csrf: true,
    }),
  updateScores: (sessionId: string, data: unknown) =>
    request(`/api/sessions/${sessionId}/scores`, {
      method: "PATCH",
      body: JSON.stringify(data),
      csrf: true,
    }),
  saveScores: (sessionId: string, scores: unknown) =>
    request(`/api/sessions/${sessionId}/scores`, {
      method: "PATCH",
      body: JSON.stringify(scores),
      csrf: true,
    }),
  assignHomework: (
    sessionId: string,
    data: { dayNumber: number; scores?: Record<string, number> }
  ) =>
    request(`/api/sessions/${sessionId}/homework`, {
      method: "POST",
      body: JSON.stringify(data),
      csrf: true,
    }),
  correctRomanHindi: (text: string) =>
    request("/api/correct/roman-hindi", {
      method: "POST",
      body: JSON.stringify({ text }),
      csrf: true,
    }),
  correctEnglish: (text: string) =>
    request("/api/correct/english", {
      method: "POST",
      body: JSON.stringify({ text }),
      csrf: true,
    }),
  correctBulk: (text: string) =>
    request("/api/correct/bulk", {
      method: "POST",
      body: JSON.stringify({ text }),
      csrf: true,
    }),
  bulkCorrect: (text: string) =>
    request<import("@speak-coach/shared").BulkCorrectResult>("/api/correct/bulk", {
      method: "POST",
      body: JSON.stringify({ text }),
      csrf: true,
    }),
  getCorrectionHistory: (type?: string) =>
    request<{
      items: import("@speak-coach/shared").CorrectionHistoryItem[];
      stats: Record<string, number>;
      total: number;
    }>(`/api/correct/history${type && type !== "all" ? `?type=${encodeURIComponent(type)}` : ""}`),
  writeParagraph: (data: unknown) =>
    request("/api/paragraphs/write", {
      method: "POST",
      body: JSON.stringify(data),
      csrf: true,
    }),
  analyzeParagraph: (text: string, language: "english" | "roman_hindi") =>
    request<import("@speak-coach/shared").ParagraphWriteResult>("/api/paragraphs/write", {
      method: "POST",
      body: JSON.stringify({ text, language }),
      csrf: true,
    }),
  readParagraph: (form: FormData) =>
    request("/api/paragraphs/read", { method: "POST", body: form, csrf: true }),
  submitParagraphRead: (form: FormData) =>
    request("/api/paragraphs/read", { method: "POST", body: form, csrf: true }),
  getDailyParagraph: () => request("/api/paragraphs/daily"),
  getParagraphWrites: () => request("/api/paragraphs/writes"),
  getParagraphReads: () => request("/api/paragraphs/reads"),
  getParagraphWrite: (id: string) => request(`/api/paragraphs/writes/${id}`),
  getParagraphRead: (id: string) => request(`/api/paragraphs/reads/${id}`),
  uploadVoice: (form: FormData) =>
    request("/api/voice/upload", { method: "POST", body: form, csrf: true }),
  getVoiceLibrary: (category?: string) =>
    request(`/api/voice/library${category ? `?category=${category}` : ""}`),
  getVoiceTimeline: () => request("/api/voice/timeline"),
  getVoiceAudioUrl: (id: string, source?: string) =>
    `${API_URL}/api/voice/${id}/audio${source ? `?source=${encodeURIComponent(source)}` : ""}`,
  /** Cookie auth: callers should use `credentials: "include"` instead of Authorization. */
  getAuthHeaders: (): Record<string, string> => ({}),
  getMistakes: () => request("/api/mistakes"),
  addMistake: (wrong: string, correct: string, category?: string) =>
    request("/api/mistakes", {
      method: "POST",
      body: JSON.stringify({ wrong, correct, category }),
      csrf: true,
    }),
  getVocabulary: () => request("/api/vocabulary/today"),
  getVocabularyToday: () => request("/api/vocabulary/today"),
  getVocabularyDue: () => request<{ words: unknown[] }>("/api/vocabulary/due"),
  reviewVocabulary: (id: string, quality: "known" | "learning" | "difficult") =>
    request(`/api/vocabulary/${id}/review`, {
      method: "POST",
      body: JSON.stringify({ quality }),
      csrf: true,
    }),
  getShadowingToday: () => request("/api/shadowing/sentence"),
  getShadowingSentence: () =>
    request<{ sentence: { text: string; language: string } }>("/api/shadowing/sentence"),
  shadowingAttempt: (form: FormData) =>
    request("/api/shadowing/attempt", { method: "POST", body: form, csrf: true }),
  submitShadowing: (form: FormData) =>
    request("/api/shadowing/attempt", { method: "POST", body: form, csrf: true }),
  getRoleplayScenarios: () =>
    request<{ scenarios: Array<{ id: string; title: string; description: string; turnCount: number }> }>(
      "/api/roleplay/scenarios"
    ),
  startRoleplay: (scenarioId: string) =>
    request("/api/roleplay/start", {
      method: "POST",
      body: JSON.stringify({ scenarioId }),
      csrf: true,
    }),
  roleplayTurn: (data: unknown) =>
    request("/api/roleplay/turn", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      csrf: true,
    }),
  submitRoleplayTurn: (form: FormData) =>
    request("/api/roleplay/turn", { method: "POST", body: form, csrf: true }),
  getAnalytics: () => request("/api/analytics"),
  getAnalyticsInsights: () => request<{ insights: string[] }>("/api/analytics/insights"),
  getWeeklyReport: () => request("/api/reports/weekly"),
  sendWeeklyReportEmail: () =>
    request<{ ok: boolean; message: string }>("/api/reports/weekly/email", {
      method: "POST",
      csrf: true,
    }),
  exportWeeklyReportHtml: async () => {
    const headers: Record<string, string> = {};
    const csrf = getCsrf();
    if (csrf) headers["X-CSRF-Token"] = csrf;
    const res = await fetch(`${API_URL}/api/reports/weekly/html`, {
      credentials: "include",
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error((err as { error?: string }).error ?? "Request failed");
    }
    return res.text();
  },
  getJourney: () => request("/api/journey"),
  getHeatmap: () => request("/api/heatmap"),
  getPracticeHeatmap: () => request("/api/practice-heatmap"),
  getHomework: () => request("/api/homework"),
  completeHomework: (id: string) =>
    request(`/api/homework/${id}/complete`, { method: "PATCH", csrf: true }),
  getJournal: () => request<{ entries: unknown[] }>("/api/journal"),
  getTodayJournal: () => request<{ entry: unknown | null }>("/api/journal/today"),
  postJournal: (data: unknown) =>
    request("/api/journal", { method: "POST", body: JSON.stringify(data), csrf: true }),
  saveJournal: (data: { moodBefore?: number; moodAfter?: number; reflection?: string }) =>
    request("/api/journal", { method: "POST", body: JSON.stringify(data), csrf: true }),
  getPhrases: (category?: string) =>
    request<{ phrases: unknown[] }>(
      `/api/phrases${category ? `?category=${encodeURIComponent(category)}` : ""}`
    ),
  savePhrase: (data: {
    original: string;
    corrected: string;
    language: string;
    category?: string;
  }) =>
    request("/api/phrases", {
      method: "POST",
      body: JSON.stringify(data),
      csrf: true,
    }),
  deletePhrase: (id: string) =>
    request(`/api/phrases/${id}`, { method: "DELETE", csrf: true }),
  getExport: () => request("/api/export/backup"),
  exportBackup: () => request("/api/export/backup"),
  exportSummary: () => request("/api/export/summary"),
  getNightReview: () => request("/api/night-review"),
  coachChat: (message: string, sessionId?: string) =>
    request<{
      sessionId: string;
      reply: string;
      messages: import("@speak-coach/shared").CoachMessage[];
    }>("/api/coach/chat", {
      method: "POST",
      body: JSON.stringify({ message, sessionId }),
      csrf: true,
    }),
  getStreak: () => request("/api/streak"),
  freezeStreak: () =>
    request<{ ok: boolean; message: string }>("/api/streak/freeze", {
      method: "POST",
      csrf: true,
    }),
  useStreakFreeze: () =>
    request<{ ok: boolean; message: string }>("/api/streak/freeze", {
      method: "POST",
      csrf: true,
    }),
  getLeaderboard: () => request("/api/leaderboard"),
  getSettings: () => request("/api/settings"),
  updateSettings: (data: unknown) =>
    request("/api/settings", { method: "PATCH", body: JSON.stringify(data), csrf: true }),
  analyzeCodeSwitch: (text: string) =>
    request("/api/code-switch/analyze", {
      method: "POST",
      body: JSON.stringify({ text }),
      csrf: true,
    }),
  getCodeSwitchHistory: () =>
    request<{
      logs: Array<{
        id: string;
        textSample: string;
        englishRatio: number;
        hindiRatio: number;
        mixedScore: number;
        wordCount: number;
        createdAt: string;
      }>;
    }>("/api/code-switch/history"),
  getCodeSwitchStats: () => request("/api/code-switch/stats"),
  getCurriculum: () => request("/api/curriculum/overview"),
  getCurriculumOverview: () =>
    request<import("@speak-coach/shared").CurriculumOverview>("/api/curriculum/overview"),
  getSoundGym: () => request("/api/sound-gym"),
  getSoundGymProgress: () =>
    request<{
      completed: unknown[];
      completedIds: string[];
      totalCompleted: number;
    }>("/api/sound-gym"),
  completeSoundGym: (data: unknown) =>
    request("/api/sound-gym/complete", {
      method: "POST",
      body: JSON.stringify(data),
      csrf: true,
    }),
  completeSoundGymDrill: (data: {
    drillId: string;
    loudnessScore?: number;
    clarityScore?: number;
  }) =>
    request<{ ok: boolean; completedIds: string[]; totalCompleted: number }>(
      "/api/sound-gym/complete",
      {
        method: "POST",
        body: JSON.stringify(data),
        csrf: true,
      }
    ),
  getPushStatus: () => request("/api/push/status"),
  registerPush: (data: unknown) =>
    request("/api/push/register", { method: "POST", body: JSON.stringify(data), csrf: true }),
  getVapidKey: () => request<{ publicKey: string | null }>("/api/push/vapid-public-key"),
  getVapidPublicKey: () => request<{ publicKey: string | null }>("/api/push/vapid-public-key"),
  registerWebPush: (subscription: unknown) =>
    request("/api/push/register", {
      method: "POST",
      body: JSON.stringify({ subscription }),
      csrf: true,
    }),
};

export { API_URL };

/** True when a CSRF token is stored (set after login or /me). */
export function hasAuthSessionHint(): boolean {
  return !!getCsrf();
}
