"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsData, ExtendedDashboard, JourneyData, StreakInfo } from "@speak-coach/shared";
import { api } from "@/lib/api";

export type LearnContextData = {
  dashboard: ExtendedDashboard;
  analytics: AnalyticsData | null;
  insights: string[];
  journey: JourneyData | null;
  streak: StreakInfo | null;
};

export function useLearnData() {
  const [data, setData] = useState<LearnContextData | null>(null);
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
      api.getStreak().catch(() => null),
    ])
      .then(([dashboard, analytics, ins, journey, streak]) => {
        setData({ dashboard, analytics, insights: ins.insights, journey, streak });
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
