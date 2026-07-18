"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AnalyticsData,
  CorrectionHistoryData,
  ExtendedDashboard,
  HeatmapDay,
  LeaderboardData,
  PracticeHeatmapData,
  StreakInfo,
} from "@speak-coach/shared";
import { api } from "@/lib/api";

export type ProgressData = {
  analytics: AnalyticsData;
  insights: string[];
  practice: PracticeHeatmapData | null;
  mistakes: HeatmapDay[];
  dashboard: ExtendedDashboard | null;
  correctionHistory: CorrectionHistoryData | null;
  leaderboard: LeaderboardData | null;
  streak: StreakInfo | null;
};

export function useProgressData() {
  const [data, setData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    return Promise.all([
      api.getAnalytics(),
      api.getAnalyticsInsights(),
      api.getPracticeHeatmap(),
      api.getHeatmap().catch(() => ({ heatmap: [] as HeatmapDay[] })),
      api.getDashboard().catch(() => null),
      api.getCorrectionHistory().catch(() => null),
      api.getLeaderboard().catch(() => null),
      api.getStreak().catch(() => null),
    ])
      .then(([analytics, ins, practice, mistakeHeatmap, dashboard, correctionHistory, leaderboard, streak]) => {
        setData({
          analytics,
          insights: ins.insights,
          practice,
          mistakes: mistakeHeatmap.heatmap ?? [],
          dashboard,
          correctionHistory,
          leaderboard,
          streak,
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

  return { data, loading, error, refresh: load };
}
