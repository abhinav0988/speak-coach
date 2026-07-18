"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AnalyticsData,
  ExtendedDashboard,
  JourneyData,
  LeaderboardData,
  PracticeHeatmapData,
  StreakInfo,
} from "@speak-coach/shared";
import { api } from "@/lib/api";
import type { SidebarSessionResume } from "@/hooks/useSidebarData";

function parseResume(session: unknown, steps: unknown[]): SidebarSessionResume | null {
  if (!session || !(session as { id?: string }).id) return null;
  const dayNumber = Number((session as { day_number?: number }).day_number ?? 1);
  const typedSteps = steps as Array<{ step_number: number; status: string }>;
  const completedSteps = typedSteps.filter((s) => s.status === "done").length;
  const totalSteps = 10;
  if (completedSteps >= totalSteps) return null;
  const next = typedSteps.find((s) => s.status !== "done");
  const nextStep = next?.step_number ?? completedSteps + 1;
  return {
    dayNumber,
    completedSteps,
    totalSteps,
    nextStep,
    label: `Step ${nextStep}`,
  };
}

export type DashboardData = {
  dashboard: ExtendedDashboard;
  analytics: AnalyticsData | null;
  insights: string[];
  journey: JourneyData | null;
  heatmap: PracticeHeatmapData | null;
  resume: SidebarSessionResume | null;
  streak: StreakInfo | null;
  leaderboard: LeaderboardData | null;
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    return Promise.all([
      api.getDashboard(),
      api.getAnalytics().catch(() => null),
      api.getAnalyticsInsights().catch(() => ({ insights: [] as string[] })),
      api.getJourney().catch(() => null),
      api.getPracticeHeatmap().catch(() => null),
      api.getTodaySession().catch(() => ({ session: null, steps: [] })),
      api.getStreak().catch(() => null),
      api.getLeaderboard().catch(() => null),
    ])
      .then(([dashboard, analytics, ins, journey, heatmap, sessionRes, streak, leaderboard]) => {
        const insights = ins.insights;
        const payload = {
          dashboard,
          analytics,
          insights,
          journey,
          heatmap,
          resume: parseResume(sessionRes.session, sessionRes.steps),
          streak,
          leaderboard,
        };
        setData(payload);
        import("@/lib/preview-cache").then(({ buildPreviewFromApi, savePreviewCache }) => {
          savePreviewCache(
            buildPreviewFromApi({
              dashboard,
              analytics,
              insights,
              leaderboard,
              journeyTargetDays: journey?.targetDays,
              journeyDay: journey?.dayNumber,
            })
          );
        });
      })
      .catch(() => {
        setData(null);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const useFreeze = useCallback(async () => {
    const res = await api.useStreakFreeze();
    const updated = await api.getDashboard();
    const streak = await api.getStreak().catch(() => null);
    setData((prev) => (prev ? { ...prev, dashboard: updated, streak } : prev));
    return res;
  }, []);

  return { data, loading, error, refresh: load, useFreeze };
}
