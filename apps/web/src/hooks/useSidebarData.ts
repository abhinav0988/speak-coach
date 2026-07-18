"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AnalyticsData, ExtendedDashboard, PracticeHeatmapData } from "@speak-coach/shared";
import { SESSION_STEPS } from "@speak-coach/shared";
import { api } from "@/lib/api";
import { getDayPeriod, getTimeGreeting } from "@/lib/greeting";

const LEVEL_THRESHOLDS = [0, 200, 500, 1000, 2000];

export type SidebarSessionResume = {
  dayNumber: number;
  completedSteps: number;
  totalSteps: number;
  nextStep: number;
  label: string;
};

export type SidebarData = {
  loading: boolean;
  displayName: string;
  initials: string;
  greeting: string;
  streak: number;
  level: number;
  levelName: string;
  xp: number;
  levelProgressPct: number;
  weeklyXp: number;
  weeklyXpTarget: number;
  todayMinutes: number;
  goalMinutes: number;
  goalProgressPct: number;
  goalRemainingMin: number;
  latestBadge: string | null;
  aiTip: string;
  aiRecommendation: string;
  practicedToday: boolean;
  fluencyScore: number;
  resume: SidebarSessionResume | null;
  refresh: () => void;
};

type SidebarDataOptions = {
  autoRefresh?: boolean;
  enabled?: boolean;
};

function getLevelProgress(xp: number) {
  let currentMin = LEVEL_THRESHOLDS[0];
  let nextMin = LEVEL_THRESHOLDS[1] ?? 200;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      currentMin = LEVEL_THRESHOLDS[i];
      nextMin = LEVEL_THRESHOLDS[i + 1] ?? currentMin + 500;
      break;
    }
  }
  if (nextMin <= currentMin) return 100;
  return Math.min(100, Math.round(((xp - currentMin) / (nextMin - currentMin)) * 100));
}

function parseResume(
  session: unknown,
  steps: unknown[]
): SidebarSessionResume | null {
  if (!session || !(session as { id?: string }).id) return null;
  const dayNumber = Number((session as { day_number?: number }).day_number ?? 1);
  const typedSteps = steps as Array<{ step_number: number; status: string }>;
  const totalSteps = SESSION_STEPS.length;
  const completedSteps = typedSteps.filter((s) => s.status === "done").length;
  if (completedSteps >= totalSteps) return null;
  const next = typedSteps.find((s) => s.status !== "done");
  const nextStep = next?.step_number ?? completedSteps + 1;
  const stepLabel = SESSION_STEPS[nextStep - 1] ?? "Daily Session";
  return {
    dayNumber,
    completedSteps,
    totalSteps,
    nextStep,
    label: stepLabel,
  };
}

function computeWeeklyXp(
  analytics: AnalyticsData | null,
  practice: PracticeHeatmapData | null,
  dashboard: ExtendedDashboard | null
) {
  const completedSessions = dashboard?.totalSessions ?? 0;
  const xp = dashboard?.gamification?.xp ?? 0;
  const hasMeaningfulProgress =
    completedSessions > 0 ||
    xp > 0 ||
    dashboard?.todaySessionComplete === true;

  if (!hasMeaningfulProgress) {
    const target = Math.max(600, (analytics?.goalMinutes ?? practice?.goalMinutes ?? 15) * 7 * 12);
    return { weeklyXp: 0, weeklyXpTarget: target };
  }

  const week = analytics?.weeklyStats?.slice(-1)[0];
  if (week) {
    const xp = week.sessions * 50 + week.recordings * 20 + week.corrections * 10 + Math.round(week.minutes * 8);
    const target = Math.max(600, (analytics?.goalMinutes ?? 15) * 7 * 12);
    return { weeklyXp: xp, weeklyXpTarget: target };
  }
  const last7 = practice?.heatmap?.slice(-7) ?? [];
  const minutes = last7.reduce((sum, d) => sum + d.minutes, 0);
  const sessions = last7.filter((d) => d.sessionDone).length;
  const weeklyXp = sessions * 50 + Math.round(minutes * 45);
  const weeklyXpTarget = Math.max(600, (practice?.goalMinutes ?? 15) * 7 * 10);
  return { weeklyXp, weeklyXpTarget };
}

function pickAiContent(insights: string[]) {
  const tip = insights[0] ?? "Practice a little today to strengthen your speaking habit.";
  const recommendation =
    insights.find((i) => /word|pronunciation|grammar|vocabulary|ending|sound/i.test(i))?.split(/[.!]/)[0] ??
    "Daily Session";
  return { tip, recommendation: recommendation.slice(0, 48) };
}

export function useSidebarData(displayName: string, options: SidebarDataOptions = {}): SidebarData {
  const autoRefresh = options.autoRefresh ?? true;
  const enabled = options.enabled ?? true;
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<ExtendedDashboard | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [practice, setPractice] = useState<PracticeHeatmapData | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [resume, setResume] = useState<SidebarSessionResume | null>(null);

  const load = useCallback(() => {
    if (!enabled) {
      setLoading(false);
      return Promise.resolve();
    }
    setLoading(true);
    return Promise.all([
      api.getDashboard().catch(() => null),
      api.getAnalytics().catch(() => null),
      api.getPracticeHeatmap().catch(() => null),
      api.getAnalyticsInsights().catch(() => ({ insights: [] as string[] })),
      api.getTodaySession().catch(() => ({ session: null, steps: [] })),
    ])
      .then(([dash, a, heatmap, ins, sessionToday]) => {
        setDashboard(dash);
        setAnalytics(a);
        setPractice(heatmap);
        setInsights(ins.insights);
        setResume(parseResume(sessionToday.session, sessionToday.steps));
      })
      .finally(() => setLoading(false));
  }, [enabled]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    const onFocus = () => {
      void load();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void load();
      }
    };

    const interval = autoRefresh
      ? window.setInterval(() => {
          if (document.visibilityState === "visible") {
            void load();
          }
        }, 45_000)
      : null;

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (interval !== null) window.clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [load, autoRefresh, enabled]);

  const greeting = useMemo(() => getTimeGreeting(getDayPeriod()), []);

  const initials = useMemo(() => {
    return displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?";
  }, [displayName]);

  const levelProgressPct = getLevelProgress(dashboard?.gamification?.xp ?? 0);
  const { weeklyXp, weeklyXpTarget } = computeWeeklyXp(analytics, practice, dashboard);
  const { tip, recommendation } = pickAiContent(insights);

  const earnedBadges = dashboard?.gamification?.badges?.filter((b) => b.earned) ?? [];
  const latestBadge = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1].name : null;

  const todayMinutes = analytics?.todayMinutes ?? 0;
  const goalMinutes = analytics?.goalMinutes ?? practice?.goalMinutes ?? 15;
  const goalProgressPct = analytics?.goalProgressPct ?? Math.min(100, Math.round((todayMinutes / Math.max(goalMinutes, 1)) * 100));
  const goalRemainingMin = Math.max(0, goalMinutes - todayMinutes);

  return {
    loading,
    displayName,
    initials,
    greeting,
    streak: dashboard?.streak ?? 0,
    level: dashboard?.gamification?.level ?? 1,
    levelName: dashboard?.gamification?.levelName ?? "Beginner",
    xp: dashboard?.gamification?.xp ?? 0,
    levelProgressPct,
    weeklyXp,
    weeklyXpTarget,
    todayMinutes,
    goalMinutes,
    goalProgressPct,
    goalRemainingMin,
    latestBadge,
    aiTip: tip,
    aiRecommendation: recommendation,
    practicedToday: dashboard?.practicedToday ?? false,
    fluencyScore: dashboard?.fluencyScore ?? 0,
    resume,
    refresh: load,
  };
}
