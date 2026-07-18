import type { DashboardData } from "@/hooks/useDashboardData";
import {
  ACHIEVEMENT_DEFS,
  MOTIVATION_QUOTES,
} from "@/components/dashboard/constants";
import { buildMissionTasks } from "@/components/dashboard/TodaysMission";

export function buildDashboardMetrics(data: DashboardData) {
  const { dashboard, analytics, insights, journey, resume, streak, leaderboard } = data;
  const g = dashboard.gamification;
  const xp = g?.xp ?? 0;
  const level = g?.level ?? 1;
  const levelName = g?.levelName ?? "Beginner";
  const todayMinutes = analytics?.todayMinutes ?? 0;
  const goalMinutes = analytics?.goalMinutes ?? 15;
  const goalRemaining = Math.max(0, goalMinutes - todayMinutes);
  const goalPct = analytics?.goalProgressPct ?? Math.min(100, Math.round((todayMinutes / Math.max(goalMinutes, 1)) * 100));
  const coins = Math.floor(xp / 10) + dashboard.streak * 5;
  const rank = leaderboard?.yourRank ?? null;
  const league = leaderboard?.league ?? levelName;
  const dailyScore = Math.min(100, Math.round(goalPct * 0.4 + dashboard.fluencyScore * 0.35 + (dashboard.practicedToday ? 25 : 0)));
  const todayScore = dashboard.recentScores?.[0];
  const weeklyXp = analytics?.weeklyStats?.reduce((s, w) => s + w.minutes * 8, 0) ?? 0;
  const weeklyChart = analytics?.weeklyStats?.slice(-7).map((w) => w.minutes) ?? [3, 6, 8, 5, 10, 7, todayMinutes];

  const scores = {
    pronunciation: Math.min(99, Math.round((todayScore?.pronunciation ?? dashboard.fluencyScore * 0.9))),
    grammar: Math.min(99, Math.round(50 + (analytics?.totals.corrections ?? 0) * 2.5)),
    confidence: Math.min(99, Math.round(40 + dashboard.streak * 3 + todayMinutes * 2)),
    fluency: dashboard.fluencyScore,
    vocabulary: Math.min(99, Math.round(35 + (dashboard.totalSessions ?? 0) * 2)),
    consistency: Math.min(99, Math.round(goalPct * 0.85 + dashboard.streak * 2)),
  };

  const aiTip = insights[0] ?? "Practice pronunciation for 8 minutes to increase fluency by 6%.";
  const aiStrength = insights.find((i) => /great|strong|good|improved/i.test(i)) ?? "Clear pronunciation";
  const aiAttention = insights.find((i) => /focus|work on|improve|attention/i.test(i)) ?? dashboard.topMistakes?.[0]?.wrong ?? "Word endings";
  const motivation = MOTIVATION_QUOTES[(dashboard.dayNumber + dashboard.streak) % MOTIVATION_QUOTES.length];

  const missionTasks = buildMissionTasks({
    practicedToday: dashboard.practicedToday,
    todaySessionComplete: dashboard.todaySessionComplete,
    hasPronunciation: (todayScore?.pronunciation ?? 0) > 0,
    hasVocabulary: dashboard.todaySessionComplete,
    correctionsToday: dashboard.correctionsToday,
  }).map((t) => ({
    ...t,
    label:
      t.id === "speaking" ? "Warm-up" : t.id === "pronunciation" ? "Pronunciation" : t.id === "conversation" ? "Conversation" : t.id === "grammar" ? "Grammar" : t.id === "vocabulary" ? "Vocabulary" : t.label,
  }));

  const missionDone = missionTasks.filter((t) => t.done).length;
  const missionPct = Math.round((missionDone / missionTasks.length) * 100);

  const earnedAchievements = ACHIEVEMENT_DEFS.filter((a) =>
    a.threshold({ sessions: dashboard.totalSessions, streak: dashboard.streak, xp, day: dashboard.dayNumber, fluency: dashboard.fluencyScore })
  );

  const milestones = journey?.milestones ?? [
    { day: 1, label: "Day 1", reached: true, completed: true },
    { day: 7, label: "Week 1", reached: dashboard.dayNumber >= 7, completed: dashboard.dayNumber >= 7 },
    { day: 30, label: "Month 1", reached: dashboard.dayNumber >= 30, completed: dashboard.dayNumber >= 30 },
    { day: 90, label: "Day 90", reached: dashboard.dayNumber >= 90, completed: dashboard.dayNumber >= 90 },
  ];

  const journeyDays = journey?.days?.slice(-14) ?? [];
  const journeyProgressPct = journey?.progressPct ?? Math.round((dashboard.dayNumber / 90) * 100);

  return {
    dashboard, analytics, insights, journey, resume, streak, leaderboard,
    xp, level, levelName, league, todayMinutes, goalMinutes, goalRemaining, goalPct,
    coins, rank, dailyScore, scores, aiTip, aiStrength, aiAttention,
    motivation, missionTasks, missionDone, missionPct, earnedAchievements,
    milestones, journeyDays, journeyProgressPct, weeklyXp, weeklyChart,
    mistakes: dashboard.topMistakes?.slice(0, 8) ?? [],
  };
}

export type DashboardMetrics = ReturnType<typeof buildDashboardMetrics>;
