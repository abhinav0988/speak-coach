import type { AnalyticsData, ExtendedDashboard, LeaderboardData } from "@speak-coach/shared";
import { TOTAL_DAYS } from "@/components/dashboard/constants";

const CACHE_KEY = "speak-coach-preview-cache";

const AUTH_QUOTES = [
  "Every conversation is a step toward fluency.",
  "Confidence grows one sentence at a time.",
  "Your voice is your superpower — practice it daily.",
  "Small sessions, big breakthroughs.",
] as const;

function getAuthQuote(): string {
  const day = new Date().getDate();
  return AUTH_QUOTES[day % AUTH_QUOTES.length];
}

export type PreviewCacheData = {
  streak: number;
  xp: number;
  level: number;
  levelName: string;
  goalMinutes: number;
  todayMinutes: number;
  fluencyScore: number;
  practicedToday: boolean;
  journeyDay: number;
  targetDays: number;
  totalSessions: number;
  insightQuote: string | null;
  leaderboardTop3: Array<{ name: string; xp: number; isYou: boolean; rank: number }>;
  updatedAt: string;
};

export const EMPTY_PREVIEW: PreviewCacheData = {
  streak: 0,
  xp: 0,
  level: 1,
  levelName: "Beginner",
  goalMinutes: 15,
  todayMinutes: 0,
  fluencyScore: 0,
  practicedToday: false,
  journeyDay: 1,
  targetDays: TOTAL_DAYS,
  totalSessions: 0,
  insightQuote: null,
  leaderboardTop3: [],
  updatedAt: "",
};

export function buildPreviewFromApi({
  dashboard,
  analytics,
  insights,
  leaderboard,
  journeyTargetDays,
  journeyDay,
}: {
  dashboard: ExtendedDashboard;
  analytics: AnalyticsData | null;
  insights: string[];
  leaderboard: LeaderboardData | null;
  journeyTargetDays?: number;
  journeyDay?: number;
}): PreviewCacheData {
  const xp = dashboard.gamification?.xp ?? 0;
  const level = dashboard.gamification?.level ?? 1;
  const levelName = dashboard.gamification?.levelName ?? "Beginner";
  return {
    streak: dashboard.streak ?? 0,
    xp,
    level,
    levelName,
    goalMinutes: analytics?.goalMinutes ?? 15,
    todayMinutes: analytics?.todayMinutes ?? 0,
    fluencyScore: dashboard.fluencyScore ?? 0,
    practicedToday: dashboard.practicedToday ?? false,
    journeyDay: journeyDay ?? dashboard.dayNumber ?? 1,
    targetDays: journeyTargetDays ?? TOTAL_DAYS,
    totalSessions: analytics?.totals.sessions ?? dashboard.totalSessions ?? 0,
    insightQuote: insights[0] ?? null,
    leaderboardTop3: (leaderboard?.entries ?? []).slice(0, 3).map((e) => ({
      name: e.name,
      xp: e.xp,
      isYou: e.isYou,
      rank: e.rank,
    })),
    updatedAt: new Date().toISOString(),
  };
}

export function readPreviewCache(): PreviewCacheData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PreviewCacheData;
    if (!parsed.updatedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePreviewCache(data: PreviewCacheData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota */
  }
}

export function resolveInsightQuote(insight: string | null | undefined): string {
  if (insight?.trim()) return insight.trim();
  return getAuthQuote();
}
