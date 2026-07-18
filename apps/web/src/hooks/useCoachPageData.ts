"use client";

import { useCallback, useEffect, useState } from "react";
import type { AnalyticsData, ExtendedDashboard } from "@speak-coach/shared";
import { api } from "@/lib/api";

export function useCoachPageData() {
  const [dashboard, setDashboard] = useState<ExtendedDashboard | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    return Promise.all([
      api.getDashboard().catch(() => null),
      api.getAnalytics().catch(() => null),
      api.getAnalyticsInsights().catch(() => ({ insights: [] as string[] })),
    ])
      .then(([d, a, ins]) => {
        setDashboard(d);
        setAnalytics(a);
        setInsights(ins.insights);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { dashboard, analytics, insights, loading };
}
