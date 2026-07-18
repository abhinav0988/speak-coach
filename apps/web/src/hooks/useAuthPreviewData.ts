"use client";

import { useCallback, useEffect, useState } from "react";
import {
  EMPTY_PREVIEW,
  buildPreviewFromApi,
  readPreviewCache,
  savePreviewCache,
  type PreviewCacheData,
} from "@/lib/preview-cache";
import { api, hasAuthSessionHint } from "@/lib/api";

export function useAuthPreviewData() {
  const [data, setData] = useState<PreviewCacheData>(() => readPreviewCache() ?? EMPTY_PREVIEW);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const cached = readPreviewCache();
    if (cached) setData(cached);

    if (!hasAuthSessionHint()) {
      setLoading(false);
      return;
    }

    try {
      const [dashboard, analytics, insightsRes, leaderboard, journey] = await Promise.all([
        api.getDashboard(),
        api.getAnalytics().catch(() => null),
        api.getAnalyticsInsights().catch(() => ({ insights: [] as string[] })),
        api.getLeaderboard().catch(() => null),
        api.getJourney().catch(() => null),
      ]);

      const next = buildPreviewFromApi({
        dashboard,
        analytics,
        insights: insightsRes.insights,
        leaderboard,
        journeyTargetDays: journey?.targetDays,
        journeyDay: journey?.dayNumber,
      });
      savePreviewCache(next);
      setData(next);
    } catch {
      /* keep cache or empty defaults */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, refresh: load };
}
