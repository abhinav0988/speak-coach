"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  AnalyticsData,
  ExtendedDashboard,
  JourneyData,
  LeaderboardData,
  PracticeHeatmapData,
  StreakInfo,
  UserProfile,
  UserProfileStats,
  UserSettings,
} from "@speak-coach/shared";
import { api } from "@/lib/api";

export type ProfileData = {
  profile: UserProfile;
  stats: UserProfileStats;
  streak: StreakInfo;
  dashboard: ExtendedDashboard | null;
  analytics: AnalyticsData | null;
  insights: string[];
  journey: JourneyData | null;
  practice: PracticeHeatmapData | null;
  leaderboard: LeaderboardData | null;
  settings: UserSettings | null;
};

export function useProfileData() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    return Promise.all([
      api.getProfile(),
      api.getStreak().catch(() => null),
      api.getDashboard().catch(() => null),
      api.getAnalytics().catch(() => null),
      api.getAnalyticsInsights().catch(() => ({ insights: [] as string[] })),
      api.getJourney().catch(() => null),
      api.getPracticeHeatmap().catch(() => null),
      api.getLeaderboard().catch(() => null),
      api.getSettings().catch(() => null),
    ])
      .then(([profileRes, streak, dashboard, analytics, ins, journey, practice, leaderboard, settingsRes]) => {
        setData({
          profile: profileRes.profile,
          stats: profileRes.stats,
          streak: streak ?? {
            streak: profileRes.stats.streak,
            practicedToday: false,
            freezesAvailable: 0,
            longestStreak: profileRes.stats.streak,
            totalPracticeDays: profileRes.stats.totalPracticeDays,
          },
          dashboard,
          analytics,
          insights: ins.insights,
          journey,
          practice,
          leaderboard,
          settings: settingsRes?.settings ?? null,
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
