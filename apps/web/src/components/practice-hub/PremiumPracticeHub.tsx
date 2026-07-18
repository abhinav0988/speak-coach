"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Crown,
  Flame,
  Mic2,
  Play,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Waves,
  Zap,
} from "lucide-react";
import type { AnalyticsData, ExtendedDashboard, LeaderboardData } from "@speak-coach/shared";
import { useAuthOptional } from "@/components/AuthProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import {
  ACHIEVEMENT_DEFS,
  MOTIVATION_QUOTES,
  PRACTICE_CATEGORIES,
  PRACTICE_MODULES,
  QUICK_ACTION_MODULES,
  USER_NAME,
} from "@/components/dashboard/constants";
import { getDayPeriod, getRecommendedModuleId, getTimeGreeting } from "@/lib/greeting";
import { cn } from "@/lib/utils";
import { AmbientScene } from "./AmbientScene";
import { PracticeCard } from "./PracticeCard";
import {
  AchievementCard3D,
  AmbientMesh,
  AnimatedBadge,
  CoinStrip,
  GlassCard,
  GradientButton,
  MiniChart,
  MiniRing,
  PremiumProgress,
  ScoreOrb,
  XPBadge,
} from "./primitives";

export type PremiumPracticeHubProps = {
  dashboard: ExtendedDashboard;
  analytics: AnalyticsData | null;
  insights: string[];
  leaderboard: LeaderboardData | null;
  initialCategory?: string;
};

function buildCompletionMap(dashboard: ExtendedDashboard, analytics: AnalyticsData | null) {
  const sessions = analytics?.totals.sessions ?? dashboard.totalSessions ?? 0;
  const recordings = analytics?.totals.recordings ?? 0;
  const corrections = analytics?.totals.corrections ?? 0;
  const shadowing = analytics?.totals.shadowing ?? 0;
  return {
    session: dashboard.todaySessionComplete ? 100 : Math.min(90, 20 + (sessions % 8) * 10),
    coach: Math.min(100, 20 + corrections * 4),
    live: Math.min(100, recordings * 7),
    shadow: Math.min(100, shadowing * 12),
    roleplay: Math.min(100, 10 + sessions * 3),
    pronunciation: Math.min(100, 25 + Math.round(dashboard.fluencyScore * 0.5)),
    grammar: Math.min(100, corrections * 5),
    vocabulary: Math.min(100, 15 + sessions * 4),
    listening: Math.min(100, recordings * 6),
    challenge: Math.min(100, dashboard.practicedToday ? 80 : 30),
    fillers: Math.min(100, recordings * 5),
  } as Record<string, number>;
}

const TIER_CYCLE = ["gold", "silver", "crystal"] as const;

export function PremiumPracticeHub({
  dashboard,
  analytics,
  insights,
  leaderboard,
  initialCategory = "all",
}: PremiumPracticeHubProps) {
  const auth = useAuthOptional();
  const displayName = auth?.user?.name?.split(" ")[0] ?? USER_NAME;
  const greeting = getTimeGreeting(getDayPeriod());
  const motivation = useMemo(
    () => MOTIVATION_QUOTES[(dashboard.dayNumber + dashboard.streak) % MOTIVATION_QUOTES.length],
    [dashboard.dayNumber, dashboard.streak]
  );

  const validCategories = new Set(PRACTICE_CATEGORIES.map((c) => c.id));
  const defaultCategory = validCategories.has(initialCategory as (typeof PRACTICE_CATEGORIES)[number]["id"])
    ? initialCategory
    : "all";
  const [category, setCategory] = useState(defaultCategory);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (validCategories.has(initialCategory as (typeof PRACTICE_CATEGORIES)[number]["id"])) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);

  const recommendedId = getRecommendedModuleId(getDayPeriod());
  const completionMap = useMemo(() => buildCompletionMap(dashboard, analytics), [dashboard, analytics]);

  const xp = dashboard.gamification?.xp ?? 0;
  const level = dashboard.gamification?.level ?? 1;
  const levelName = dashboard.gamification?.levelName ?? "Beginner";
  const todayMinutes = analytics?.todayMinutes ?? 0;
  const goalMinutes = analytics?.goalMinutes ?? 15;
  const goalPct = analytics?.goalProgressPct ?? Math.min(100, Math.round((todayMinutes / Math.max(goalMinutes, 1)) * 100));
  const weeklyChart = (analytics?.weeklyStats?.slice(-7).map((w) => w.minutes) ?? [2, 5, 8, 4, 9, 6, todayMinutes]).slice(-7);
  const weeklyXp = analytics?.weeklyStats?.reduce((sum, w) => sum + w.minutes * 8 + w.sessions * 15, 0) ?? xp % 500;
  const coins = Math.floor(xp / 10) + dashboard.streak * 5;
  const dailyXp = Math.min(120, todayMinutes * 8 + (dashboard.practicedToday ? 25 : 0));

  const aiTip = insights[0] ?? "Practice a little today to strengthen your speaking habit.";
  const aiFocus =
    insights.find((i) => /word|pronunciation|grammar|vocabulary|ending|sound/i.test(i))?.split(/[.!]/)[0]?.slice(0, 40) ??
    "Daily Session";

  const earnedAchievements = ACHIEVEMENT_DEFS.filter((a) =>
    a.threshold({
      sessions: dashboard.totalSessions,
      streak: dashboard.streak,
      xp,
      day: dashboard.dayNumber,
      fluency: dashboard.fluencyScore,
    })
  ).slice(0, 3);

  const filtered = useMemo(() => {
    let mods =
      category === "all" ? PRACTICE_MODULES : PRACTICE_MODULES.filter((m) => m.category === category);
    const q = query.trim().toLowerCase();
    if (q) mods = mods.filter((m) => m.title.toLowerCase().includes(q) || m.subtitle.toLowerCase().includes(q));
    return mods;
  }, [category, query]);

  const quickActions = PRACTICE_MODULES.filter((m) =>
    (QUICK_ACTION_MODULES as readonly string[]).includes(m.id)
  );

  const trending = PRACTICE_MODULES.filter((m) => m.badge === "trending" || m.badge === "new").slice(0, 4);
  const recentlyPlayed = [...PRACTICE_MODULES]
    .sort((a, b) => (completionMap[b.id] ?? 0) - (completionMap[a.id] ?? 0))
    .slice(0, 4);

  const pronunciationScore = Math.min(99, Math.round(dashboard.fluencyScore * 0.92));
  const grammarScore = Math.min(99, Math.round(55 + (analytics?.totals.corrections ?? 0) * 3));
  const confidenceScore = Math.min(99, Math.round(40 + dashboard.streak * 4 + todayMinutes * 2));

  const rank = leaderboard?.yourRank ?? null;
  const rankLabel = rank === null ? "—" : String(rank);

  const leaderboardRows = useMemo(() => {
    if (leaderboard?.entries?.length) {
      return leaderboard.entries.slice(0, 3);
    }
    return [
      {
        id: "you",
        name: displayName,
        xp,
        streak: dashboard.streak,
        league: levelName,
        isYou: true,
        rank: 1,
      },
    ];
  }, [leaderboard, displayName, xp, dashboard.streak, levelName]);

  return (
    <div className="ph-screen relative -mx-4 -mt-2 space-y-6 overflow-hidden px-4 pb-10 sm:mx-0 sm:mt-0 sm:px-0">
      <AmbientScene />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="ph-hero-glow relative overflow-hidden rounded-[24px] border border-white/60 bg-white/70 p-5 shadow-[0_48px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:rounded-[28px] sm:p-6"
      >
        <AmbientMesh />

        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="ph-hero-label text-xs font-semibold text-muted sm:text-sm">{greeting} 👋</p>
            <h1 className="ph-hero-title mt-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 bg-clip-text font-bold tracking-tight text-transparent">
              {displayName}
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">{motivation}</p>
          </div>
          <div className="ph-streak-pill flex items-center gap-2 rounded-2xl border border-amber-200/70 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 shadow-inner">
            <Flame className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700/80">Streak</p>
              <p className="ph-stat-value font-bold text-amber-900">
                <AnimatedNumber value={dashboard.streak} suffix=" days" />
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Level", value: level, suffix: "", tone: "text-primary" },
            { label: "XP", value: xp, suffix: "", tone: "text-violet-600" },
            { label: "Fluency", value: dashboard.fluencyScore, suffix: "%", tone: "text-emerald-600" },
            { label: "Rank", value: rank, suffix: "", tone: "text-cyan-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="ph-stat-tile rounded-2xl border border-white/70 bg-gradient-to-br from-white/90 to-slate-50/80 px-3 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{stat.label}</p>
              {stat.label === "Rank" ? (
                <p className={cn("ph-stat-value font-bold", stat.tone)}>{rankLabel}</p>
              ) : (
                <p className={cn("ph-stat-value font-bold", stat.tone)}>
                  <AnimatedNumber value={stat.value as number} suffix={stat.suffix} />
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="relative mt-5">
          <CoinStrip coins={coins} dailyXp={dailyXp} />
        </div>

        <div className="relative mt-4 flex flex-wrap items-center gap-2">
          <AnimatedBadge label={`${levelName} Speaker`} tone="primary" />
          <AnimatedBadge label={`Weekly Goal ${goalPct}%`} tone="ai" />
          {dashboard.practicedToday && <AnimatedBadge label="On Fire" tone="hot" />}
        </div>

        <div className="relative mt-4">
          <PremiumProgress value={goalPct} glow />
          <p className="mt-1.5 text-xs text-muted">
            {todayMinutes} / {goalMinutes} min today · {weeklyXp} XP this week
          </p>
        </div>
      </motion.section>

      {/* Score orbs */}
      <GlassCard className="relative overflow-hidden p-5" hover>
        <AmbientMesh className="opacity-40" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">Skill Pulse</p>
            <p className="text-base font-semibold text-foreground">Your speaking superpowers</p>
          </div>
          <Target className="h-5 w-5 text-primary/60" />
        </div>
        <div className="relative mt-5 flex justify-around gap-2">
          <ScoreOrb label="Pronunciation" value={pronunciationScore} gradient="from-blue-500 to-indigo-600" />
          <ScoreOrb label="Grammar" value={grammarScore} gradient="from-violet-500 to-purple-600" />
          <ScoreOrb label="Confidence" value={confidenceScore} gradient="from-emerald-500 to-teal-600" />
        </div>
      </GlassCard>

      {/* Weekly challenge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="ph-challenge-banner relative overflow-hidden rounded-[28px] border border-violet-200/60 bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED] p-5 text-white shadow-[0_24px_60px_rgba(99,102,241,0.35)]"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80">
              <Crown className="h-4 w-4" />
              Weekly Challenge
            </p>
            <p className="mt-1 text-base font-bold">Speak 5 days · Earn 500 bonus XP</p>
            <p className="mt-1 text-xs text-white/80">
              {Math.min(5, analytics?.weeklyStats?.filter((w) => w.minutes > 0).length ?? dashboard.streak % 6)} / 5 days complete
            </p>
          </div>
          <GradientButton href="/session" className="bg-white/20 shadow-none hover:bg-white/30">
            <Zap className="h-4 w-4" />
            Join Challenge
          </GradientButton>
        </div>
        <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-white/90 shadow-[0_0_16px_rgba(255,255,255,0.5)] transition-all duration-1000"
            style={{ width: `${Math.min(100, ((analytics?.weeklyStats?.filter((w) => w.minutes > 0).length ?? 2) / 5) * 100)}%` }}
          />
        </div>
      </motion.div>

      {/* Search */}
      <GlassCard className="relative flex items-center gap-3 p-3.5" hover>
        <Search className="h-5 w-5 text-primary/70" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons, skills, AI coach…"
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
        />
        <button type="button" aria-label="Voice search" className="rounded-xl bg-cyan-500/15 p-2 text-cyan-700 transition hover:scale-105">
          <Mic2 className="h-4 w-4" />
        </button>
        <button type="button" aria-label="AI search" className="rounded-xl bg-violet-500/15 p-2 text-violet-700 transition hover:scale-105">
          <Sparkles className="h-4 w-4" />
        </button>
      </GlassCard>

      {/* Quick actions */}
      <section className="relative">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="ph-section-title font-bold text-foreground">Quick Start</h2>
          <span className="text-xs font-bold text-primary">Tap to launch</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {quickActions.map((mod, i) => {
            const Icon = mod.icon;
            const progress = completionMap[mod.id] ?? 0;
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, type: "spring", stiffness: 280, damping: 26 }}
              >
                <Link
                  href={mod.href}
                  className="ph-quick-card group flex min-w-[148px] flex-col gap-2.5 rounded-[20px] border border-white/55 bg-white/65 p-3.5 shadow-[0_24px_56px_rgba(15,23,42,0.09)] backdrop-blur-xl sm:min-w-[156px] sm:p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className={cn("flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br text-white shadow-lg sm:h-12 sm:w-12 sm:rounded-[16px]", mod.iconGradient)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <XPBadge xp={mod.xpReward} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground sm:text-sm">{mod.title}</p>
                    <p className="text-xs text-muted">{mod.time} · {progress}% done</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition group-hover:opacity-100">
                    Continue <Play className="h-3 w-3" fill="currentColor" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-orange-500" />
          <h2 className="ph-section-title font-bold text-foreground">Trending Now</h2>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {trending.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="ph-trend-chip flex min-w-[130px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-white/50 bg-white/60 px-4 py-3 text-center shadow-sm backdrop-blur"
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-white", mod.iconGradient)}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-foreground">{mod.title}</p>
                {mod.badge && (
                  <AnimatedBadge
                    label={mod.badge === "trending" ? "Hot" : "New"}
                    tone={mod.badge === "trending" ? "hot" : "new"}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recently played */}
      <section>
        <h2 className="ph-section-title mb-3 font-bold text-foreground">Continue Where You Left Off</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {recentlyPlayed.map((mod) => {
            const Icon = mod.icon;
            const pct = completionMap[mod.id] ?? 0;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="ph-resume-tile group rounded-2xl border border-white/50 bg-white/55 p-3 backdrop-blur transition hover:-translate-y-1"
              >
                <div className="flex items-center gap-2">
                  <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", mod.iconGradient)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold text-foreground">{mod.title}</p>
                    <p className="text-[10px] text-muted">{pct}%</p>
                  </div>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200/80">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Filter */}
      <section>
        <div className="ph-segmented relative flex gap-1 overflow-x-auto rounded-2xl border border-white/50 bg-white/50 p-1 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur scrollbar-none">
          {PRACTICE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={cn(
                  "relative z-10 flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
                  active ? "text-white" : "text-muted hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="ph-segment-pill"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] shadow-[0_8px_24px_rgba(37,99,235,0.35)]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative h-4 w-4" />
                <span className="relative">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Practice cards */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="ph-section-title bg-gradient-to-r from-slate-900 to-violet-900 bg-clip-text font-bold tracking-tight text-transparent">
              Practice Modes
            </h2>
            <p className="text-xs text-muted sm:text-sm">{filtered.length} ways to level up today</p>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((mod, i) => (
            <PracticeCard
              key={mod.id}
              module={mod}
              completion={completionMap[mod.id] ?? 0}
              isRecommended={mod.id === recommendedId}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* Bottom section */}
      <section className="grid gap-4 lg:grid-cols-2">
        <GlassCard className="relative overflow-hidden p-5" hover>
          <AmbientMesh className="opacity-30" />
          <p className="relative text-xs font-bold uppercase tracking-wider text-muted">Today&apos;s Progress</p>
          <div className="relative mt-3 flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedNumber value={todayMinutes} suffix=" min" />
              </p>
              <p className="text-xs text-muted">of {goalMinutes} min goal</p>
            </div>
            <MiniRing value={goalPct} size={64} />
          </div>
          <div className="relative mt-4">
            <MiniChart values={weeklyChart} />
          </div>
        </GlassCard>

        <GlassCard className="p-5" hover>
          <p className="text-xs font-bold uppercase tracking-wider text-muted">Daily Mission</p>
          <p className="mt-2 text-base font-semibold text-foreground">
            {dashboard.practicedToday ? "Streak protected today ✓" : "Complete one session to save your streak"}
          </p>
          <div className="mt-3">
            <PremiumProgress value={dashboard.todaySessionComplete ? 100 : goalPct} glow />
          </div>
          <GradientButton href="/session" className="mt-4 w-full">
            <Play className="h-4 w-4" fill="currentColor" />
            Continue Last Session
          </GradientButton>
        </GlassCard>

        <GlassCard className="p-5" hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Achievements</p>
            </div>
            <Link href="/rewards" className="text-xs font-bold text-primary">
              View all
            </Link>
          </div>
          <div className="mt-3 flex gap-3">
            {earnedAchievements.length > 0 ? (
              earnedAchievements.map((a, i) => (
                <AchievementCard3D
                  key={a.id}
                  icon={a.icon}
                  name={a.name}
                  tier={TIER_CYCLE[i % TIER_CYCLE.length]}
                />
              ))
            ) : (
              <p className="text-sm text-muted">Complete your first session to unlock badges.</p>
            )}
          </div>
        </GlassCard>

        <div className="ph-ai-border relative overflow-hidden rounded-[24px] border border-white/50 bg-white/70 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <AmbientMesh className="opacity-25" />
          <p className="relative flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
            <Sparkles className="h-4 w-4 text-secondary" />
            AI Coach
          </p>
          <p className="relative mt-2 text-sm leading-relaxed text-foreground">{aiTip}</p>
          <div className="relative mt-2 inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">
            <Waves className="h-3 w-3" />
            Today&apos;s Focus: {aiFocus}
          </div>
          <GradientButton href="/coach" className="relative mt-4 w-full">
            <Zap className="h-4 w-4" />
            Practice Now
          </GradientButton>
        </div>

        {/* Leaderboard preview */}
        <GlassCard className="relative overflow-hidden p-5 lg:col-span-2" hover>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted">Leaderboard Preview</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">Top 3</span>
          </div>
          <div className="mt-4 space-y-2">
            {leaderboardRows.map((row) => (
                <div
                  key={row.id}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5",
                    row.isYou ? "bg-gradient-to-r from-primary/10 to-violet-500/10 ring-1 ring-primary/20" : "bg-white/50"
                  )}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-white">
                    {row.rank}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">
                      {row.name} {row.isYou && <span className="text-xs text-primary">(You)</span>}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-violet-600">{row.xp} XP</p>
                </div>
              ))}
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
