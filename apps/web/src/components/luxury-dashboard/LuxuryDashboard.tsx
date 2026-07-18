"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  Brain,
  ChevronRight,
  Crown,
  Flame,
  Gift,
  Heart,
  MessageSquare,
  Mic,
  Moon,
  PenLine,
  Play,
  Sparkles,
  Star,
  Sun,
  Target,
  TrendingUp,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import type { DashboardData } from "@/hooks/useDashboardData";
import { useAuthOptional } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import {
  ACHIEVEMENT_DEFS,
  MISSION_XP_REWARD,
  MOTIVATION_QUOTES,
  PRACTICE_MODULES,
  USER_NAME,
} from "@/components/dashboard/constants";
import { buildMissionTasks } from "@/components/dashboard/TodaysMission";
import { ConfettiCelebration } from "@/components/dashboard/MotivationHub";
import { PracticeHeatmap } from "@/components/analytics/PracticeHeatmap";
import { getDayPeriod, getTimeGreeting } from "@/lib/greeting";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import { AuroraBackground } from "./AuroraBackground";
import { DesktopDashboard } from "@/components/desktop/DesktopDashboard";
import {
  AchievementBadge3D,
  AIOrb,
  AnimatedChart,
  GlassCard,
  GradientBorderCard,
  GradientButton,
  MiniRadar,
  PillBadge,
  ProgressRing,
  SectionLabel,
  StatWidget,
} from "./design-system";

const TIER_CYCLE = ["gold", "silver", "crystal"] as const;
const QUICK_IDS = ["session", "coach", "live", "vocabulary", "grammar", "roleplay", "listening", "shadow"] as const;

function deriveScores(data: DashboardData) {
  const { dashboard, analytics } = data;
  const todayScore = dashboard.recentScores?.[0];
  return {
    pronunciation: Math.min(99, Math.round((todayScore?.pronunciation ?? dashboard.fluencyScore * 0.9))),
    grammar: Math.min(99, Math.round(50 + (analytics?.totals.corrections ?? 0) * 2.5)),
    confidence: Math.min(99, Math.round(40 + dashboard.streak * 3 + (analytics?.todayMinutes ?? 0) * 2)),
    fluency: dashboard.fluencyScore,
    vocabulary: Math.min(99, Math.round(35 + (dashboard.totalSessions ?? 0) * 2)),
    consistency: Math.min(99, Math.round((analytics?.goalProgressPct ?? 0) * 0.85 + dashboard.streak * 2)),
  };
}

export function LuxuryDashboard({ data, onUseFreeze }: { data: DashboardData; onUseFreeze?: () => Promise<unknown> }) {
  const auth = useAuthOptional();
  const isDesktop = useIsDesktop();
  const { theme, toggle: toggleTheme } = useTheme();
  const firstName = auth?.user?.name?.split(" ")[0] ?? USER_NAME;
  const greeting = getTimeGreeting(getDayPeriod());
  const celebratedRef = useRef(false);
  const [celebrate, setCelebrate] = useState(false);
  const [mistakeIdx, setMistakeIdx] = useState(0);

  const { dashboard, analytics, insights, journey, heatmap, resume, streak, leaderboard } = data;
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
  const rankLabel = rank === null ? "—" : `#${rank}`;
  const league = leaderboard?.league ?? levelName;
  const dailyScore = Math.min(100, Math.round(goalPct * 0.4 + dashboard.fluencyScore * 0.35 + (dashboard.practicedToday ? 25 : 0)));
  const scores = deriveScores(data);

  const motivation = useMemo(
    () => MOTIVATION_QUOTES[(dashboard.dayNumber + dashboard.streak) % MOTIVATION_QUOTES.length],
    [dashboard.dayNumber, dashboard.streak]
  );

  const todayScore = dashboard.recentScores?.[0];
  const missionTasks = buildMissionTasks({
    practicedToday: dashboard.practicedToday,
    todaySessionComplete: dashboard.todaySessionComplete,
    hasPronunciation: (todayScore?.pronunciation ?? 0) > 0,
    hasVocabulary: dashboard.todaySessionComplete,
    correctionsToday: dashboard.correctionsToday,
  }).map((t) => ({
    ...t,
    label:
      t.id === "speaking"
        ? "Warm-up"
        : t.id === "pronunciation"
          ? "Pronunciation"
          : t.id === "conversation"
            ? "Conversation"
            : t.id === "grammar"
              ? "Grammar"
              : t.id === "vocabulary"
                ? "Vocabulary"
                : t.label,
  }));

  const missionDone = missionTasks.filter((t) => t.done).length;
  const missionPct = Math.round((missionDone / missionTasks.length) * 100);
  const allMissionDone = missionDone === missionTasks.length;

  useEffect(() => {
    if (allMissionDone && !celebratedRef.current) {
      celebratedRef.current = true;
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 3000);
      return () => clearTimeout(t);
    }
  }, [allMissionDone]);

  const aiTip = insights[0] ?? "Practice pronunciation for 8 minutes to increase your fluency by 6%.";
  const aiStrength = insights.find((i) => /great|strong|good|improved/i.test(i)) ?? "Clear pronunciation on common words";
  const aiAttention = insights.find((i) => /focus|work on|improve|attention/i.test(i)) ?? dashboard.topMistakes?.[0]?.wrong ?? "Word endings";
  const weeklyChart = analytics?.weeklyStats?.slice(-7).map((w) => w.minutes) ?? [3, 6, 8, 5, 10, 7, todayMinutes];

  const earnedAchievements = ACHIEVEMENT_DEFS.filter((a) =>
    a.threshold({
      sessions: dashboard.totalSessions,
      streak: dashboard.streak,
      xp,
      day: dashboard.dayNumber,
      fluency: dashboard.fluencyScore,
    })
  );

  const mistakes = dashboard.topMistakes?.slice(0, 8) ?? [];
  const currentMistake = mistakes[mistakeIdx % Math.max(mistakes.length, 1)];
  const masteryPct = mistakes.length ? Math.min(100, Math.round(100 - (currentMistake?.repeatCount ?? 1) * 12)) : 100;

  const quickModules = PRACTICE_MODULES.filter((m) =>
    (QUICK_IDS as readonly string[]).includes(m.id)
  );

  const journeyDays = journey?.days?.slice(-14) ?? [];
  const milestones = journey?.milestones ?? [
    { day: 1, label: "Day 1", reached: true, completed: true },
    { day: 7, label: "Week 1", reached: dashboard.dayNumber >= 7, completed: dashboard.dayNumber >= 7 },
    { day: 30, label: "Month 1", reached: dashboard.dayNumber >= 30, completed: dashboard.dayNumber >= 30 },
    { day: 90, label: "Day 90", reached: dashboard.dayNumber >= 90, completed: dashboard.dayNumber >= 90 },
  ];

  const fadeUp = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" } };

  return (
    <>
      {/* Mobile + tablet — unchanged */}
      <div className="relative mx-auto w-full min-w-0 max-w-wide space-y-8 max-lg:block lg:hidden md:space-y-10">
      <AuroraBackground />
      {celebrate && <ConfettiCelebration show={celebrate} />}

      {/* ── HERO ── */}
      <motion.section {...fadeUp} transition={{ duration: 0.5 }}>
        <GradientBorderCard animated className="overflow-hidden">
          <div className="relative p-6 sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-400/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 left-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-[16px] font-semibold text-muted">{greeting},</p>
                <h1 className="ld-display mt-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 bg-clip-text text-[42px] font-black leading-none tracking-tight text-transparent dark:from-slate-100 dark:via-indigo-200 dark:to-violet-200 sm:text-[48px]">
                  {firstName} 👋
                </h1>
                <p className="mt-3 text-[16px] text-muted">
                  {goalRemaining > 0
                    ? `You're only ${goalRemaining} minutes away from today's goal.`
                    : "You've crushed today's goal. Keep the momentum going!"}
                </p>
                <p className="mt-2 flex items-center gap-2 text-[13px] text-rose-500">
                  <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
                  {motivation}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  className="ld-glass flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 text-foreground shadow-sm transition hover:-translate-y-0.5"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-600" />}
                </button>
                <ProgressRing value={dailyScore} size={100} label="Daily Score" />
              </div>
            </div>

            <div className="relative mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {[
                { icon: Flame, label: "Streak", value: dashboard.streak, suffix: "d", grad: "from-orange-400 to-red-500" },
                { icon: Star, label: "XP", value: xp, suffix: "", grad: "from-violet-500 to-purple-600" },
                { icon: Crown, label: "Rank", value: rank, suffix: "", grad: "from-amber-400 to-orange-500" },
                { icon: TrendingUp, label: "Speaking", value: dashboard.fluencyScore, suffix: "%", grad: "from-emerald-500 to-teal-500" },
                { icon: Target, label: "Focus", value: dailyScore, suffix: "", grad: "from-blue-500 to-indigo-600" },
              ].map((s) => (
                <div key={s.label} className="ld-stat-pill flex items-center gap-3 rounded-2xl border border-white/60 bg-white/50 px-3 py-3 backdrop-blur">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", s.grad)}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{s.label}</p>
                    {s.label === "Rank" ? (
                      <p className="text-lg font-black text-foreground">{rank === null ? "—" : rank}</p>
                    ) : (
                      <p className="text-lg font-black text-foreground">
                        <AnimatedNumber value={s.value as number} suffix={s.suffix} />
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GradientBorderCard>
      </motion.section>

      {/* ── AI HERO ── */}
      <motion.section {...fadeUp} transition={{ delay: 0.05 }}>
        <GradientBorderCard animated>
          <div className="relative flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
            <AIOrb />
            <div className="flex-1">
              <PillBadge tone="ai">AI Coach · Today&apos;s Recommendation</PillBadge>
              <p className="mt-3 text-[22px] font-bold leading-snug text-foreground">&ldquo;{aiTip}&rdquo;</p>
              <p className="mt-2 text-[13px] text-muted">
                Estimated +6% fluency · {goalRemaining > 0 ? `${goalRemaining} min to goal` : "Goal complete"}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-[200px]">
              <GradientButton href="/session">
                <Play className="h-4 w-4" fill="currentColor" />
                Start Session
              </GradientButton>
              <GradientButton href="/coach" variant="ghost">
                <Bot className="h-4 w-4" />
                Ask AI
              </GradientButton>
              {resume && (
                <GradientButton href="/session" variant="ghost">
                  <Zap className="h-4 w-4" />
                  Resume {resume.label}
                </GradientButton>
              )}
            </div>
          </div>
        </GradientBorderCard>
      </motion.section>

      {/* ── GAMIFICATION BAR ── */}
      <motion.section {...fadeUp}>
        <GlassCard className="p-4" glow="purple">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-muted">Level</p>
                <p className="text-2xl font-black text-primary">{level}</p>
                <p className="text-[11px] text-muted">{levelName}</p>
              </div>
              <div className="h-12 w-px bg-white/40" />
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-muted">Coins</p>
                <p className="text-2xl font-black text-amber-600">🪙 <AnimatedNumber value={coins} /></p>
              </div>
              <div className="h-12 w-px bg-white/40" />
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-muted">League</p>
                <p className="text-2xl font-black text-violet-600">{league}</p>
              </div>
              <div className="h-12 w-px bg-white/40 dark:bg-white/10" />
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase text-muted">Weekly XP</p>
                <p className="text-2xl font-black text-emerald-600">
                  +{analytics?.weeklyStats?.reduce((s, w) => s + w.minutes * 8, 0) ?? 0}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/rewards?tab=daily"><PillBadge tone="amber">🎁 Daily Reward</PillBadge></Link>
              <Link href="/rewards?tab=spin"><PillBadge tone="hot">🎰 Lucky Spin</PillBadge></Link>
              <Link href="/rewards?tab=chest"><PillBadge tone="success">📦 Treasure Chest</PillBadge></Link>
            </div>
          </div>
        </GlassCard>
      </motion.section>

      {/* ── TODAY'S MISSION + STREAK ── */}
      <div className="grid gap-6 lg:grid-cols-5">
        <motion.section {...fadeUp} className="lg:col-span-3">
          <GlassCard className="h-full p-6" glow="blue">
            <SectionLabel title="Today's Mission" subtitle="Complete all tasks to unlock bonus XP" />
            <div className="flex flex-wrap items-center gap-6">
              <ProgressRing value={missionPct} size={96} sublabel={`+${MISSION_XP_REWARD} XP`} />
              <ul className="flex-1 space-y-2.5">
                {missionTasks.map((task, i) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 transition",
                      task.done
                        ? "border-emerald-200/60 bg-emerald-50/60"
                        : "border-white/50 bg-white/40"
                    )}
                  >
                    <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", task.done ? "bg-emerald-500 text-white" : "bg-slate-200 text-muted")}>
                      {task.done ? "✓" : i + 1}
                    </span>
                    <span className={cn("text-[16px] font-semibold", task.done && "text-muted line-through")}>{task.label}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            {allMissionDone && (
              <motion.p initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="mt-4 text-center text-sm font-bold text-emerald-600">
                🎉 Mission complete! +{MISSION_XP_REWARD} XP earned
              </motion.p>
            )}
          </GlassCard>
        </motion.section>

        <motion.section {...fadeUp} className="lg:col-span-2">
          <GlassCard className="h-full p-6" glow="pink">
            <SectionLabel title="Streak" subtitle="Keep the fire alive" />
            <div className="flex items-center justify-center py-4">
              <div className="ld-fire relative text-center">
                <span className="text-6xl">🔥</span>
                <p className="mt-2 text-4xl font-black text-orange-600">
                  <AnimatedNumber value={dashboard.streak} />
                </p>
                <p className="text-[13px] font-semibold text-muted">day streak</p>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-white/50 p-3">
                <p className="text-[10px] font-bold uppercase text-muted">Longest</p>
                <p className="text-xl font-black">{Math.max(dashboard.streak, streak?.longestStreak ?? dashboard.streak, dashboard.totalPracticeDays ?? 0)}d</p>
              </div>
              <div className="rounded-xl bg-white/50 p-3">
                <p className="text-[10px] font-bold uppercase text-muted">Freezes</p>
                <p className="text-xl font-black">{dashboard.freezesAvailable ?? 0}</p>
              </div>
            </div>
            {(dashboard.freezesAvailable ?? 0) > 0 && onUseFreeze && (
              <GradientButton className="mt-4 w-full" variant="ghost" onClick={() => void onUseFreeze()}>
                Use Streak Freeze
              </GradientButton>
            )}
            <div className="mt-4 flex justify-between gap-1">
              {(analytics?.weeklyStats?.slice(-7) ?? []).map((w, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-8 flex-1 rounded-lg",
                    w.minutes > 0 ? "bg-gradient-to-t from-orange-400 to-amber-300" : "bg-slate-200/60"
                  )}
                  title={`${w.label}: ${w.minutes} min`}
                />
              ))}
            </div>
          </GlassCard>
        </motion.section>
      </div>

      {/* ── LEARNING JOURNEY ── */}
      <motion.section {...fadeUp}>
        <SectionLabel title="Learning Journey" subtitle={`Day ${dashboard.dayNumber} of 90 · ${journey?.progressPct ?? Math.round((dashboard.dayNumber / 90) * 100)}% complete`} />
        <GlassCard className="p-6" hover={false}>
          <div className="relative overflow-x-auto pb-4">
            <div className="ld-journey-line absolute left-8 right-8 top-8 h-1 rounded-full bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#EC4899] opacity-30" />
            <div className="relative flex min-w-max gap-4 px-2">
              {milestones.map((m) => (
                <div key={m.day} className="flex w-24 flex-col items-center">
                  <div
                    className={cn(
                      "ld-journey-node flex h-16 w-16 items-center justify-center rounded-2xl border-2 text-sm font-black shadow-lg transition",
                      m.completed
                        ? "border-emerald-400 bg-gradient-to-br from-emerald-400 to-teal-500 text-white"
                        : m.reached
                          ? "border-primary bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white ld-journey-current"
                          : "border-slate-200 bg-white/60 text-muted blur-[0.5px]"
                    )}
                  >
                    {m.completed ? "✓" : m.day}
                  </div>
                  <p className="mt-2 text-center text-[11px] font-bold text-foreground">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
          {journeyDays.length > 0 && (
            <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none">
              {journeyDays.map((d) => (
                <div
                  key={d.day}
                  className={cn(
                    "shrink-0 rounded-xl px-3 py-2 text-center text-[11px] font-bold",
                    d.status === "completed" ? "bg-emerald-100 text-emerald-700" : d.status === "partial" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-muted"
                  )}
                >
                  D{d.day}
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </motion.section>

      {/* ── LIVE STATS ── */}
      <motion.section {...fadeUp}>
        <SectionLabel title="Live Stats" subtitle="Real-time learning intelligence" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-4">
          <StatWidget icon={Mic} label="Speaking Min" value={todayMinutes} suffix="m" trend={12} sparkline={weeklyChart} gradient="from-blue-500 to-indigo-600" />
          <StatWidget icon={Star} label="XP" value={xp} trend={8} gradient="from-violet-500 to-purple-600" />
          <StatWidget icon={Flame} label="Streak" value={dashboard.streak} suffix="d" trend={5} gradient="from-orange-400 to-red-500" />
          <StatWidget icon={BookOpen} label="Vocabulary" value={scores.vocabulary} suffix="%" trend={3} gradient="from-emerald-500 to-teal-500" />
          <StatWidget icon={PenLine} label="Grammar" value={scores.grammar} suffix="%" trend={-2} gradient="from-pink-500 to-rose-500" />
          <StatWidget icon={Brain} label="Confidence" value={scores.confidence} suffix="%" trend={6} gradient="from-cyan-500 to-blue-500" />
          <StatWidget icon={TrendingUp} label="Fluency" value={scores.fluency} suffix="%" trend={4} gradient="from-indigo-500 to-violet-600" />
          <StatWidget icon={Volume2} label="Pronunciation" value={scores.pronunciation} suffix="%" trend={7} gradient="from-amber-400 to-orange-500" />
        </div>
      </motion.section>

      {/* ── AI INSIGHTS ── */}
      <motion.section {...fadeUp}>
        <GradientBorderCard animated>
          <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-3 md:col-span-2 lg:col-span-4">
              <AIOrb />
              <div>
                <SectionLabel title="AI Insights" subtitle="Personalized intelligence for today" />
              </div>
            </div>
            {[
              { title: "Today's Strength", value: aiStrength, icon: "💪", color: "from-emerald-50 to-teal-50" },
              { title: "Needs Attention", value: aiAttention, icon: "🎯", color: "from-rose-50 to-orange-50" },
              { title: "Suggested Exercise", value: "Pronunciation drill · 8 min", icon: "🎤", color: "from-blue-50 to-indigo-50" },
              { title: "Weekly Improvement", value: `+${Math.round(scores.fluency * 0.06)}% fluency`, icon: "📈", color: "from-violet-50 to-purple-50" },
            ].map((item) => (
              <div key={item.title} className={cn("rounded-2xl bg-gradient-to-br p-4", item.color)}>
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted">{item.title}</p>
                <p className="mt-1 text-[16px] font-bold leading-snug text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </GradientBorderCard>
      </motion.section>

      {/* ── PROGRESS INTELLIGENCE ── */}
      <motion.section {...fadeUp}>
        <SectionLabel title="Progress Intelligence" subtitle="Analytics that feel alive" action={<Link href="/analytics" className="text-sm font-bold text-primary">Full analytics →</Link>} />
        <div className="grid gap-6 lg:grid-cols-3">
          <GlassCard className="p-5 lg:col-span-2" glow="blue">
            <p className="text-[13px] font-bold uppercase tracking-wider text-muted">Weekly Speaking</p>
            <AnimatedChart values={weeklyChart} className="mt-4" />
            <p className="mt-3 text-sm text-muted">{todayMinutes} min today · {goalMinutes} min goal</p>
          </GlassCard>
          <GlassCard className="p-5" glow="purple">
            <p className="text-[13px] font-bold uppercase tracking-wider text-muted">Confidence Radar</p>
            <MiniRadar
              scores={[
                { label: "Grammar", value: scores.grammar },
                { label: "Fluency", value: scores.fluency },
                { label: "Pronunciation", value: scores.pronunciation },
                { label: "Confidence", value: scores.confidence },
                { label: "Consistency", value: scores.consistency },
              ]}
            />
          </GlassCard>
          {heatmap && (
            <GlassCard className="p-5 lg:col-span-3" glow="cyan">
              <p className="mb-4 text-[13px] font-bold uppercase tracking-wider text-muted">Practice Heatmap</p>
              <PracticeHeatmap days={heatmap.heatmap} goalMinutes={heatmap.goalMinutes} summary={heatmap.summary} compact />
            </GlassCard>
          )}
        </div>
      </motion.section>

      {/* ── ACHIEVEMENTS ── */}
      <motion.section {...fadeUp}>
        <SectionLabel title="Achievements" subtitle="Premium badges earned through mastery" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {ACHIEVEMENT_DEFS.slice(0, 6).map((a, i) => {
            const earned = earnedAchievements.some((e) => e.id === a.id);
            return (
              <AchievementBadge3D
                key={a.id}
                icon={a.icon}
                name={a.name}
                earned={earned}
                tier={TIER_CYCLE[i % TIER_CYCLE.length]}
              />
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Daily", "Weekly", "Monthly", "Milestones"].map((cat) => (
            <PillBadge key={cat} tone="primary">{cat}</PillBadge>
          ))}
        </div>
      </motion.section>

      {/* ── MISTAKE CENTER ── */}
      <motion.section {...fadeUp}>
        <SectionLabel title="Mistake Center" subtitle="Swipe through flashcards · master every error" />
        {mistakes.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <span className="text-4xl">✨</span>
            <p className="mt-3 text-[22px] font-bold">No repeated mistakes yet</p>
            <GradientButton href="/session" className="mt-4">Start practicing</GradientButton>
          </GlassCard>
        ) : (
          <GlassCard className="p-6" glow="pink">
            <motion.div
              key={currentMistake?.wrong}
              initial={{ opacity: 0, rotateY: -10 }}
              animate={{ opacity: 1, rotateY: 0 }}
              className="grid gap-4 md:grid-cols-2"
            >
              <div className="rounded-2xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-pink-50 p-5">
                <p className="text-[10px] font-bold uppercase text-rose-600">Wrong Word</p>
                <p className="mt-2 text-3xl font-black line-through decoration-rose-400">{currentMistake?.wrong}</p>
              </div>
              <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
                <p className="text-[10px] font-bold uppercase text-emerald-600">Correct Word</p>
                <p className="mt-2 text-3xl font-black text-emerald-700">{currentMistake?.correct}</p>
                <button type="button" className="mt-3 flex items-center gap-1.5 text-sm font-bold text-primary">
                  <Volume2 className="h-4 w-4" /> Pronunciation
                </button>
              </div>
            </motion.div>
            <p className="mt-4 text-sm text-muted">AI: Focus on the &ldquo;{currentMistake?.correct}&rdquo; sound — repeat 3× slowly.</p>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-muted">Mastery</p>
                <p className="text-lg font-black text-foreground">{masteryPct}%</p>
              </div>
              <div className="flex gap-2">
                <GradientButton variant="ghost" onClick={() => setMistakeIdx((i) => (i + 1) % mistakes.length)}>
                  Next <ChevronRight className="h-4 w-4" />
                </GradientButton>
                <GradientButton href="/coach">Practice Again</GradientButton>
              </div>
            </div>
          </GlassCard>
        )}
      </motion.section>

      {/* ── RECENT ACTIVITY ── */}
      <motion.section {...fadeUp}>
        <SectionLabel title="Recent Activity" subtitle="Your learning story unfolds here" />
        <GlassCard className="p-6">
          <div className="ld-timeline space-y-0">
            {[
              { icon: Play, label: "Today's lesson", desc: dashboard.practicedToday ? "Session in progress" : "Not started yet", time: "Today", grad: "from-blue-500 to-indigo-600" },
              { icon: Trophy, label: "Achievement", desc: earnedAchievements[0]?.name ?? "Keep going to unlock", time: "Recent", grad: "from-amber-400 to-orange-500" },
              { icon: PenLine, label: "Correction", desc: mistakes[0] ? `${mistakes[0].wrong} → ${mistakes[0].correct}` : "No corrections yet", time: "Today", grad: "from-rose-500 to-pink-500" },
              { icon: Sparkles, label: "AI Feedback", desc: aiTip.slice(0, 60) + "…", time: "Now", grad: "from-violet-500 to-purple-600" },
            ].map((item, i) => (
              <div key={i} className="ld-timeline-item relative flex gap-4 pb-8 last:pb-0">
                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", item.grad)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 border-b border-white/40 pb-6 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-foreground">{item.label}</p>
                    <span className="text-[11px] text-muted">{item.time}</span>
                  </div>
                  <p className="mt-0.5 text-[13px] text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.section>

      {/* ── QUICK ACTIONS ── */}
      <motion.section {...fadeUp}>
        <SectionLabel title="Quick Actions" subtitle="Launch any mode instantly" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {quickModules.map((mod, i) => {
            const Icon = mod.icon;
            return (
              <motion.div key={mod.id} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href={mod.href} className="ld-quick-action group block rounded-[24px] border border-white/55 bg-white/55 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                  <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-110", mod.iconGradient)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-[16px] font-extrabold text-foreground">{mod.title}</p>
                  <p className="text-[13px] text-muted">{mod.time}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition group-hover:opacity-100">
                    Launch <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ── LEADERBOARD + GAMIFICATION ── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section {...fadeUp}>
          <GlassCard className="p-6" glow="amber">
            <SectionLabel
              title="Leaderboard"
              subtitle={leaderboard ? `${league} League · Rank ${rankLabel}` : "Global league standings"}
            />
            {(leaderboard?.entries ?? []).slice(0, 5).map((row) => (
                <div
                  key={row.id}
                  className={cn(
                    "mb-2 flex items-center gap-3 rounded-2xl px-4 py-3",
                    row.isYou ? "bg-gradient-to-r from-primary/10 to-violet-500/10 ring-1 ring-primary/25 dark:from-primary/20 dark:to-violet-500/20" : "bg-white/40 dark:bg-white/5"
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-white">
                    {row.rank}
                  </span>
                  <div className="flex-1">
                    <span className="font-bold text-foreground">
                      {row.name} {row.isYou && <span className="text-xs text-primary">(You)</span>}
                    </span>
                    <p className="text-[10px] font-semibold text-muted">{row.league} · {row.streak}d streak</p>
                  </div>
                  <span className="font-extrabold text-violet-600">{row.xp} XP</span>
                </div>
              ))}
            <Link href="/rewards?tab=challenge" className="mt-2 block text-center text-sm font-bold text-primary">
              View all rewards →
            </Link>
          </GlassCard>
        </motion.section>

        <motion.section {...fadeUp}>
          <GlassCard className="p-6" glow="cyan">
            <SectionLabel title="Weekly Quest" subtitle="Challenge friends · earn bonus rewards" />
            <div className="space-y-3">
              <div className="rounded-2xl bg-gradient-to-r from-[#2563EB]/10 to-[#7C3AED]/10 p-4">
                <p className="font-bold text-foreground">Speak 5 days this week</p>
                <p className="text-[13px] text-muted">Reward: 500 XP + Treasure Chest</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/60">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all duration-1000"
                    style={{ width: `${Math.min(100, ((analytics?.weeklyStats?.filter((w) => w.minutes > 0).length ?? 2) / 5) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { icon: Gift, label: "Daily Reward", href: "/rewards?tab=daily" },
                  { icon: Award, label: "Badges", href: "/rewards" },
                  { icon: MessageSquare, label: "Challenge", href: "/rewards?tab=challenge" },
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="rounded-2xl bg-white/50 p-3 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white/5">
                    <item.icon className="mx-auto h-5 w-5 text-primary" />
                    <p className="mt-1 text-[11px] font-bold text-foreground">{item.label}</p>
                  </Link>
                ))}
              </div>
              <GradientButton href="/challenge" className="mt-3 w-full" variant="ghost">
                Start Weekly Challenge
              </GradientButton>
            </div>
          </GlassCard>
        </motion.section>
      </div>

      {/* ── FOOTER ── */}
      <motion.section {...fadeUp}>
        <GradientBorderCard animated>
          <div className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
            <div className="flex-1">
              <p className="text-[13px] font-bold uppercase tracking-wider text-muted">Motivation</p>
              <p className="mt-1 text-[22px] font-bold italic text-foreground">&ldquo;{motivation}&rdquo;</p>
              <p className="mt-2 text-[13px] text-muted">
                <Sparkles className="mr-1 inline h-4 w-4 text-violet-500" />
                AI Suggestion: {aiTip.slice(0, 80)}…
              </p>
              <p className="mt-1 text-[13px] font-semibold text-amber-600">
                🎁 Upcoming reward: Level {level + 1} unlock at {level * 200 + 200} XP
              </p>
            </div>
            <GradientButton href="/session" className="shrink-0">
              Continue Learning
              <ArrowRight className="h-4 w-4" />
            </GradientButton>
          </div>
        </GradientBorderCard>
      </motion.section>
      </div>

      {/* Desktop ≥ 1024px — premium SaaS layout */}
      {isDesktop && <DesktopDashboard data={data} onUseFreeze={onUseFreeze} />}
    </>
  );
}
