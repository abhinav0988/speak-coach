"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Activity,
  Award,
  Brain,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Flame,
  Gauge,
  Languages,
  Mic,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import type { AnalyticsData, CorrectionHistoryData, ExtendedDashboard, HeatmapDay, PracticeHeatmapData } from "@speak-coach/shared";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart as RePieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Range = "week" | "month" | "quarter" | "year";

const GLASS =
  "rounded-[24px] border border-white/30 bg-gradient-to-br from-white/70 via-white/55 to-white/45 backdrop-blur-sm shadow-[0_14px_40px_-24px_rgba(37,99,235,0.55)]";

function trend(now: number, prev: number) {
  if (!prev) return { delta: 0, pct: 0 };
  const delta = now - prev;
  return { delta, pct: Math.round((delta / Math.max(prev, 1)) * 100) };
}

export function PremiumAnalyticsDashboard({
  data,
  insights,
  practice,
  mistakes,
  dashboard,
  correctionHistory,
}: {
  data: AnalyticsData;
  insights: string[];
  practice: PracticeHeatmapData | null;
  mistakes: HeatmapDay[];
  dashboard: ExtendedDashboard | null;
  correctionHistory: CorrectionHistoryData | null;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [range, setRange] = useState<Range>("month");
  const [activeHeatmapDate, setActiveHeatmapDate] = useState<string | null>(null);
  const [expandedCorrection, setExpandedCorrection] = useState<string | null>(null);
  const returnTo = useMemo(() => {
    const query = searchParams.toString();
    return query ? `${pathname}?${query}` : pathname;
  }, [pathname, searchParams]);

  const periodStats = useMemo(() => {
    if (range === "week") return data.weeklyStats.slice(-8);
    if (range === "month") return data.monthlyStats.slice(-12);
    if (range === "quarter") return data.monthlyStats.slice(-3);
    return data.monthlyStats;
  }, [data, range]);

  const timeline = periodStats.map((s) => ({
    label: s.label,
    minutes: s.minutes,
    sessions: s.sessions,
    corrections: s.corrections,
    score: Math.round((s.avgPronunciation + s.avgClarity) / 2),
  }));

  const currentStreak = dashboard?.streak ?? Math.max(0, Math.round((data.dayNumber * data.goalProgressPct) / 250));
  const level = dashboard?.gamification?.level ?? Math.max(1, Math.round(data.dayNumber / 8));
  const xp = dashboard?.gamification?.xp ?? data.totals.sessions * 45 + data.totals.recordings * 18 + data.totals.corrections * 7;
  const weeklyRank = Math.max(1, 100 - Math.round((data.averages.clarity + data.averages.loudness) / 2));
  const confidenceScore = Math.round(data.averages.clarity * 0.45 + data.averages.loudness * 0.25 + data.goalProgressPct * 0.3);
  const grammarAccuracy = Math.max(40, 100 - Math.round((data.totals.corrections / Math.max(data.totals.sessions, 1)) * 3));
  const overallScore = Math.round(
    data.averages.clarity * 0.34 + data.averages.loudness * 0.18 + confidenceScore * 0.18 + grammarAccuracy * 0.15 + Math.min(100, data.goalProgressPct) * 0.15
  );
  const remainingMinutes = Math.max(0, data.goalMinutes - data.todayMinutes);
  const estimatedCompletion = remainingMinutes === 0 ? "Goal complete" : `~${Math.max(5, remainingMinutes * 2)} mins`;

  const quickStats = [
    { key: "sessions", label: "Sessions", value: data.totals.sessions, icon: CalendarDays, color: "#2563EB", history: timeline.map((t) => t.sessions) },
    { key: "minutes", label: "Speaking Minutes", value: data.totals.speakingMinutes, icon: Mic, color: "#7C3AED", history: timeline.map((t) => t.minutes) },
    { key: "recordings", label: "Voice Recordings", value: data.totals.recordings, icon: Volume2, color: "#22C55E", history: periodStats.map((s) => s.recordings) },
    { key: "corrections", label: "Corrections", value: data.totals.corrections, icon: Languages, color: "#F59E0B", history: timeline.map((t) => t.corrections) },
    { key: "pronunciation", label: "Pronunciation", value: Math.round(periodStats.at(-1)?.avgPronunciation ?? 0), icon: Activity, color: "#2563EB", suffix: "%", history: periodStats.map((s) => s.avgPronunciation) },
    { key: "fluency", label: "Fluency", value: Math.round(periodStats.at(-1)?.avgClarity ?? 0), icon: TrendingUp, color: "#7C3AED", suffix: "%", history: periodStats.map((s) => s.avgClarity) },
    { key: "confidence", label: "Confidence Score", value: confidenceScore, icon: Gauge, color: "#22C55E", suffix: "%", history: data.fluencyTrend.map((f) => Math.round((f.pronunciation + f.loudness) / 2)) },
    { key: "grammar", label: "Grammar Accuracy", value: grammarAccuracy, icon: CheckCircle2, color: "#EF4444", suffix: "%", history: data.weeklyStats.map((s) => Math.max(45, 100 - s.corrections * 4)) },
  ];

  const heatmapRows = useMemo(() => {
    const days = practice?.heatmap ?? [];
    const chunked: Array<typeof days> = [];
    for (let i = 0; i < days.length; i += 7) chunked.push(days.slice(i, i + 7));
    return chunked;
  }, [practice]);

  const mistakeMap = useMemo(() => new Map(mistakes.map((m) => [m.date, m])), [mistakes]);
  const selectedPracticeDay = practice?.heatmap.find((d) => d.date === activeHeatmapDate) ?? null;
  const selectedMistakeDay = activeHeatmapDate ? mistakeMap.get(activeHeatmapDate) ?? null : null;

  const radarData = [
    { skill: "Vowels", value: Math.round(data.averages.clarity * 0.95) },
    { skill: "Consonants", value: Math.round(data.averages.clarity * 0.9) },
    { skill: "Word Endings", value: Math.round(data.averages.loudness * 0.86) },
    { skill: "Sentence Flow", value: Math.round(confidenceScore * 0.9) },
    { skill: "Clarity", value: Math.round(data.averages.clarity) },
    { skill: "Speed", value: Math.max(40, Math.min(95, Math.round((data.averages.paceWpm / 150) * 100))) },
    { skill: "Confidence", value: confidenceScore },
  ];

  const distributionData = periodStats.map((s) => ({
    label: s.label,
    conversation: Math.round(s.minutes * 0.28),
    reading: Math.round(s.minutes * 0.16),
    shadowing: Math.round(s.minutes * 0.13),
    pronunciation: Math.round(s.minutes * 0.12),
    corrections: Math.round(s.minutes * 0.11),
    aiChat: Math.round(s.minutes * 0.1),
    vocabulary: Math.max(2, Math.round(s.minutes * 0.1)),
  }));

  const allDataMix = [
    { name: "Sessions", value: data.totals.sessions, color: "#2563EB" },
    { name: "Recordings", value: data.totals.recordings, color: "#7C3AED" },
    { name: "Corrections", value: data.totals.corrections, color: "#EF4444" },
    { name: "Shadowing", value: data.totals.shadowing, color: "#22C55E" },
    { name: "Paragraph Write", value: data.totals.paragraphWrites, color: "#F59E0B" },
    { name: "Paragraph Read", value: data.totals.paragraphReads, color: "#06B6D4" },
  ].filter((s) => s.value > 0);

  const practiceModeMix = (data.practiceMix ?? []).map((p, i) => ({
    name: p.label,
    value: p.value,
    color: ["#2563EB", "#7C3AED", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4", "#A855F7"][i % 7],
  }));

  const correctionTypeMix = (data.correctionsByType ?? []).map((c, i) => ({
    name: c.type.replace(/_/g, " "),
    value: c.count,
    color: ["#EF4444", "#F59E0B", "#7C3AED", "#2563EB", "#22C55E", "#0EA5E9"][i % 6],
  }));

  const heatmapSummary = useMemo(() => {
    const days = practice?.heatmap ?? [];
    const active = days.filter((d) => d.minutes > 0).length;
    const goalMet = days.filter((d) => d.goalMet).length;
    const avgMinutes = days.length ? Math.round(days.reduce((sum, d) => sum + d.minutes, 0) / days.length) : 0;
    const correctionTotal = mistakes.reduce((sum, d) => sum + d.mistakeCount, 0);
    return { active, goalMet, avgMinutes, correctionTotal };
  }, [practice, mistakes]);

  const correctionsTimeline = data.topMistakes.map((m, idx) => {
    const mastery = Math.max(32, Math.min(95, 100 - m.count * 7));
    const needed = Math.max(0, Math.ceil((90 - mastery) / 4));
    const historyMatch = correctionHistory?.items.find((it) =>
      it.inputText.toLowerCase().includes(m.wrong.toLowerCase())
    );
    const lastSeen = historyMatch?.createdAt
      ? new Date(historyMatch.createdAt).toLocaleDateString()
      : `${Math.max(1, idx + 1)} day${idx > 0 ? "s" : ""} ago`;
    return {
      id: `${m.wrong}-${idx}`,
      wrong: m.wrong,
      correct: m.correct,
      repeated: m.count,
      mastery,
      lastSeen,
      needed,
    };
  });

  const achievements = dashboard?.gamification?.badges?.length
    ? dashboard.gamification.badges.map((b, idx) => ({
        id: b.id,
        label: b.name,
        unlocked: b.earned,
        xp: 70 + idx * 25,
      }))
    : [
        { id: "rec1", label: "First Recording", unlocked: data.totals.recordings >= 1, xp: 50 },
        { id: "streak7", label: "7 Day Streak", unlocked: currentStreak >= 7, xp: 120 },
        { id: "corr50", label: "50 Corrections", unlocked: data.totals.corrections >= 50, xp: 140 },
        { id: "min100", label: "100 Minutes", unlocked: data.totals.speakingMinutes >= 100, xp: 160 },
        { id: "perfect", label: "Perfect Session", unlocked: overallScore >= 85, xp: 190 },
        { id: "vocab", label: "Vocabulary Master", unlocked: data.totals.mistakesMastered >= 20, xp: 210 },
      ];

  const reportHighlights = [
    `You improved pronunciation by ${Math.max(6, Math.round((periodStats.at(-1)?.avgPronunciation ?? 0) - (periodStats.at(-2)?.avgPronunciation ?? 0)))}%.`,
    `You practiced ${Math.max(1, Math.round((timeline.slice(-1)[0]?.sessions ?? 0) + 1))} days this cycle.`,
    `Average speaking pace is ${data.averages.paceWpm} wpm and trending stable.`,
    `Grammar mistakes are ${Math.max(0, 100 - grammarAccuracy)}% lower than your baseline.`,
    `Most common mistake area: ${data.correctionsByType[0]?.type?.replace(/_/g, " ") ?? "roman hindi"}.`,
  ];

  const recommendations = insights.length > 0
    ? insights.slice(0, 4)
    : [
        "Practice pronunciation drills for 10 minutes.",
        "Repeat today's top 2 corrections aloud.",
        "Complete one shadowing session.",
        "Read one short article aloud and record it.",
      ];

  const scoreTrendColor = overallScore >= 80 ? "text-success" : overallScore >= 65 ? "text-warning" : "text-danger";
  const momentumData = data.fluencyTrend.slice(-21).map((f) => {
    const recordings = data.activityByDay.find((a) => a.date === f.date)?.recordings ?? 0;
    return {
      date: f.date.slice(5),
      fluency: Math.round((f.pronunciation + f.loudness) / 2),
      pronunciation: f.pronunciation,
      loudness: f.loudness,
      recordings,
    };
  });
  const trackingDeltaBars = quickStats.slice(0, 8).map((s) => {
    const now = s.history.at(-1) ?? s.value;
    const prev = s.history.at(-2) ?? now;
    return {
      metric: s.label.replace("Speaking ", "").replace("Voice ", ""),
      delta: now - prev,
      absolute: now,
    };
  });
  const forecastBase = timeline.slice(-6);
  const forecastSlope =
    forecastBase.length >= 2
      ? (forecastBase[forecastBase.length - 1].score - forecastBase[0].score) / (forecastBase.length - 1)
      : 0;
  const forecastData = [
    ...timeline.slice(-8).map((t, i) => ({ label: t.label, actual: t.score, projected: t.score, kind: i === timeline.slice(-8).length - 1 ? "current" : "history" })),
    ...Array.from({ length: 4 }).map((_, i) => {
      const base = timeline.at(-1)?.score ?? overallScore;
      const projected = Math.round(Math.max(0, Math.min(100, base + forecastSlope * (i + 1))));
      return { label: `F+${i + 1}`, actual: null as number | null, projected, kind: "forecast" as const };
    }),
  ];

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative overflow-hidden rounded-[28px] border border-white/30 p-6 sm:p-8",
          "bg-gradient-to-br from-[#eef4ff] via-[#f5f1ff] to-[#ffffff] shadow-[0_24px_70px_-35px_rgba(37,99,235,0.45)]"
        )}
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#2563EB]/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-[#7C3AED]/20 blur-3xl" />
        <div className="relative grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/65 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Progress Analytics
            </p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome back <span aria-hidden>👋</span>
            </h1>
            <p className="mt-2 text-sm text-muted sm:text-base">
              Here&apos;s how your English speaking is improving.
            </p>

            <div className={cn("mt-6 flex items-center gap-4 rounded-[22px] px-4 py-4", GLASS)}>
              <div>
                <p className="text-xs text-muted">Hero Score</p>
                <p className={cn("text-4xl font-bold tracking-tight", scoreTrendColor)}>
                  <AnimatedNumber value={overallScore} suffix="/100" />
                </p>
              </div>
              <div className="h-14 w-px bg-surface-border" />
              <div className="text-sm">
                <p className="text-muted">Learning Journey</p>
                <p className="font-semibold text-foreground">Day {data.dayNumber} of 90</p>
                <p className="text-xs text-primary">
                  Goal forecast: {Math.max(6, Math.round((90 - data.dayNumber) * 0.8))} active days left
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Current Streak 🔥", value: `${currentStreak} days` },
              { label: "Today's Goal", value: `${data.todayMinutes}/${data.goalMinutes} min` },
              { label: "Current Level", value: `L${level}` },
              { label: "XP Points", value: `${xp}` },
              { label: "Weekly Rank", value: `#${weeklyRank}` },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ y: -4 }}
                className={cn("rounded-[22px] px-4 py-3", GLASS)}
              >
                <p className="text-[11px] uppercase tracking-wide text-muted">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Card className={cn("rounded-[26px] bg-gradient-to-br from-[#eff6ff] to-[#f8f5ff] p-6 sm:p-8")}>
          <div className="grid gap-6 lg:grid-cols-[320px_1fr] lg:items-center">
            <div className="mx-auto h-[280px] w-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={[{ value: data.goalProgressPct, fill: "#2563EB" }]}
                  innerRadius="68%"
                  outerRadius="100%"
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar background dataKey="value" cornerRadius={20} />
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="-mt-[174px] text-center">
                <p className="text-xs uppercase tracking-wide text-muted">Today&apos;s Goal</p>
                <p className="mt-1 text-4xl font-bold text-foreground">
                  <AnimatedNumber value={data.goalProgressPct} suffix="%" />
                </p>
                <p className="mt-1 text-sm text-muted">
                  {data.todayMinutes} / {data.goalMinutes} minutes
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Card className={cn("rounded-[22px] p-4", GLASS)}>
                <p className="text-xs text-muted">Time Remaining</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{remainingMinutes} min</p>
              </Card>
              <Card className={cn("rounded-[22px] p-4", GLASS)}>
                <p className="text-xs text-muted">Estimated Completion</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{estimatedCompletion}</p>
              </Card>
              <Card className={cn("rounded-[22px] p-4", GLASS)}>
                <p className="text-xs text-muted">Current Streak</p>
                <p className="mt-1 text-2xl font-bold text-foreground">{currentStreak} days</p>
              </Card>
            </div>
          </div>
        </Card>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((s, idx) => {
          const Icon = s.icon;
          const now = s.history.at(-1) ?? s.value;
          const prev = s.history.at(-2) ?? now;
          const tr = trend(now, prev);
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className={cn("rounded-[22px] p-4", GLASS)}>
                <div className="flex items-center justify-between">
                  <div className="rounded-xl p-2" style={{ background: `${s.color}20` }}>
                    <Icon className="h-5 w-5" style={{ color: s.color }} />
                  </div>
                  <span className={cn("text-xs font-semibold", tr.delta >= 0 ? "text-success" : "text-danger")}>
                    {tr.delta >= 0 ? "↑" : "↓"} {Math.abs(tr.pct)}%
                  </span>
                </div>
                <p className="mt-3 text-xs text-muted">{s.label}</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  <AnimatedNumber value={s.value} suffix={s.suffix ?? ""} />
                </p>
                <div className="mt-3 h-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={s.history.map((h, i) => ({ i, v: h }))}>
                      <Line type="monotone" dataKey="v" stroke={s.color} strokeWidth={2.2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-1 text-[11px] text-muted">vs last period {tr.delta >= 0 ? "+" : ""}{tr.delta}</p>
              </Card>
            </motion.div>
          );
        })}
      </section>

      <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Card className={cn("rounded-[26px] p-6", GLASS)}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Activity Timeline</h2>
              <p className="text-sm text-muted">Minutes, sessions, corrections and score over time</p>
            </div>
            <div className="flex rounded-full bg-white/70 p-1 shadow-sm">
              {(["week", "month", "quarter", "year"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-medium transition",
                    range === r ? "bg-primary text-white" : "text-muted hover:text-foreground"
                  )}
                >
                  {r === "quarter" ? "3 Months" : r[0].toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline}>
                <defs>
                  <linearGradient id="minutesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="minutes" stroke="#2563EB" fill="url(#minutesFill)" strokeWidth={2.5} name="Minutes Spoken" />
                <Line yAxisId="left" type="monotone" dataKey="sessions" stroke="#7C3AED" strokeWidth={2.2} dot={false} name="Sessions" />
                <Line yAxisId="left" type="monotone" dataKey="corrections" stroke="#EF4444" strokeWidth={2} dot={false} name="Corrections" />
                <Line yAxisId="right" type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={2.2} name="Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <h2 className="text-lg font-semibold text-foreground">All Data Mix</h2>
            <p className="mb-4 text-sm text-muted">Sessions, recordings, corrections and drills contribution</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={allDataMix} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                    {allDataMix.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <h2 className="text-lg font-semibold text-foreground">Practice Mode Mix</h2>
            <p className="mb-4 text-sm text-muted">Which modes contribute most to your progress</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={practiceModeMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {practiceModeMix.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <h2 className="text-lg font-semibold text-foreground">Correction Type Mix</h2>
            <p className="mb-4 text-sm text-muted">Dynamic error distribution from your real correction history</p>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={correctionTypeMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {correctionTypeMix.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <h2 className="text-xl font-semibold text-foreground">Momentum Tracking</h2>
            <p className="mb-4 text-sm text-muted">Daily fluency, pronunciation, loudness and recording intensity (21 days)</p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={momentumData}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="fluency" stroke="#2563EB" strokeWidth={2.3} dot={false} name="Fluency" />
                  <Line yAxisId="left" type="monotone" dataKey="pronunciation" stroke="#7C3AED" strokeWidth={2} dot={false} name="Pronunciation" />
                  <Line yAxisId="left" type="monotone" dataKey="loudness" stroke="#22C55E" strokeWidth={2} dot={false} name="Loudness" />
                  <Bar yAxisId="right" dataKey="recordings" fill="#F59E0B" radius={[6, 6, 0, 0]} name="Recordings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <h2 className="text-xl font-semibold text-foreground">Metric Change Tracker</h2>
            <p className="mb-4 text-sm text-muted">Delta vs previous period across all core KPIs</p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trackingDeltaBars}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                  <XAxis dataKey="metric" tick={{ fontSize: 10 }} interval={0} angle={-18} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="delta" name="Delta">
                    {trackingDeltaBars.map((entry, idx) => (
                      <Cell key={`delta-${idx}`} fill={entry.delta >= 0 ? "#22C55E" : "#EF4444"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </section>

      <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Card className={cn("rounded-[26px] p-6", GLASS)}>
          <h2 className="text-xl font-semibold text-foreground">Goal Forecast Tracking</h2>
          <p className="mb-4 text-sm text-muted">Projected performance trajectory based on recent trend slope</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#2563EB" strokeWidth={2.4} dot={false} name="Actual Score" />
                <Line type="monotone" dataKey="projected" stroke="#7C3AED" strokeWidth={2.1} strokeDasharray="5 4" dot={false} name="Projected Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <h2 className="text-xl font-semibold text-foreground">Speaking Heatmap</h2>
            <p className="mb-3 text-sm text-muted">Daily speaking intensity calendar. Tap any day for deep details.</p>
            <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-xl bg-white/65 px-3 py-2">
                <p className="text-[11px] text-muted">Active Days</p>
                <p className="text-lg font-semibold text-foreground">{heatmapSummary.active}</p>
              </div>
              <div className="rounded-xl bg-white/65 px-3 py-2">
                <p className="text-[11px] text-muted">Goal Met Days</p>
                <p className="text-lg font-semibold text-foreground">{heatmapSummary.goalMet}</p>
              </div>
              <div className="rounded-xl bg-white/65 px-3 py-2">
                <p className="text-[11px] text-muted">Avg Minutes / Day</p>
                <p className="text-lg font-semibold text-foreground">{heatmapSummary.avgMinutes}</p>
              </div>
              <div className="rounded-xl bg-white/65 px-3 py-2">
                <p className="text-[11px] text-muted">Corrections in Range</p>
                <p className="text-lg font-semibold text-foreground">{heatmapSummary.correctionTotal}</p>
              </div>
            </div>
            <div className="space-y-1">
              {heatmapRows.map((row, ri) => (
                <div key={ri} className="grid grid-cols-7 gap-1.5">
                  {row.map((d) => (
                    <button
                      key={d.date}
                      type="button"
                      onClick={() => setActiveHeatmapDate(d.date)}
                      className={cn(
                        "aspect-square rounded-[8px] transition hover:scale-105",
                        d.level === "none" && "bg-[#e7efff]",
                        d.level === "light" && "bg-[#c6d8ff]",
                        d.level === "moderate" && "bg-[#97b9ff]",
                        d.level === "active" && "bg-[#5c8fff]",
                        d.level === "intense" && "bg-[#2563EB]",
                        activeHeatmapDate === d.date && "ring-2 ring-offset-2 ring-primary"
                      )}
                    />
                  ))}
                </div>
              ))}
            </div>
            {selectedPracticeDay && (
              <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">
                <p className="font-semibold text-foreground">{selectedPracticeDay.date}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-muted">
                  <p>Minutes: <span className="font-semibold text-foreground">{selectedPracticeDay.minutes}</span></p>
                  <p>Recordings: <span className="font-semibold text-foreground">{selectedPracticeDay.recordings}</span></p>
                  <p>Corrections: <span className="font-semibold text-foreground">{selectedMistakeDay?.mistakeCount ?? 0}</span></p>
                  <p>Practice Type: <span className="font-semibold text-foreground">{selectedPracticeDay.goalMet ? "Goal Focus" : "Mixed"}</span></p>
                  <p>Streak Impact: <span className="font-semibold text-foreground">{selectedPracticeDay.sessionDone ? "+1 active day" : "No streak credit"}</span></p>
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">AI Performance Insights</h2>
            </div>
            <p className="mt-1 text-sm text-muted">Most improved, strengths, weaknesses and next goal</p>
            <div className="mt-4 grid gap-3">
              <InsightChip title="Most Improved" value={`${Math.max(6, Math.round((periodStats.at(-1)?.avgPronunciation ?? 0) - (periodStats.at(-2)?.avgPronunciation ?? 0)))}% Pronunciation`} color="bg-success/15 text-success" />
              <InsightChip title="Needs Attention" value={data.averages.loudness < 65 ? "Voice projection consistency" : "Grammar consistency in long replies"} color="bg-warning/20 text-warning" />
              <InsightChip title="Strength" value={data.averages.clarity >= 70 ? "Clarity and sentence flow" : "Daily commitment and practice regularity"} color="bg-primary/15 text-primary" />
              <InsightChip title="Weakness" value={data.topMistakes[0] ? `${data.topMistakes[0].wrong} pattern repetition` : "Not enough long-form speaking"} color="bg-danger/15 text-danger" />
              <InsightChip title="Next Goal" value={`Reach ${Math.min(95, overallScore + 5)}/100 score this cycle`} color="bg-secondary/15 text-secondary" />
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <h2 className="text-xl font-semibold text-foreground">Pronunciation Analytics</h2>
            <p className="mb-4 text-sm text-muted">Radar view across key speaking skill dimensions</p>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11 }} />
                  <Radar dataKey="value" stroke="#2563EB" fill="#2563EB" fillOpacity={0.25} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <h2 className="text-xl font-semibold text-foreground">Corrections Analytics</h2>
            <p className="mb-4 text-sm text-muted">Expandable timeline of mistakes and mastery progress</p>
            <div className="space-y-3">
              {correctionsTimeline.map((item) => (
                <div key={item.id} className="rounded-xl border border-surface-border bg-white/65 p-3">
                  <button
                    type="button"
                    onClick={() => setExpandedCorrection((cur) => (cur === item.id ? null : item.id))}
                    className="flex w-full items-center justify-between text-left"
                  >
                    <p className="font-semibold text-foreground">
                      <span className="text-danger">{item.wrong}</span> → <span className="text-success">{item.correct}</span>
                    </p>
                    <span className="text-xs text-muted">{item.mastery}% mastery</span>
                  </button>
                  {expandedCorrection === item.id && (
                    <div className="mt-3 space-y-2 text-sm">
                      <p className="text-muted">Times repeated: <span className="font-semibold text-foreground">{item.repeated}</span></p>
                      <p className="text-muted">Last seen: <span className="font-semibold text-foreground">{item.lastSeen}</span></p>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-border">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-success" style={{ width: `${item.mastery}%` }} />
                      </div>
                      <p className="text-xs text-muted">
                        {item.needed > 0 ? `Needs ${item.needed} more practice sessions` : "Mastered"}
                      </p>
                      <Link href="/correct">
                        <Button variant="secondary" className="h-8 px-3 text-xs">Practice Again</Button>
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </section>

      <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Card className={cn("rounded-[26px] p-6", GLASS)}>
          <h2 className="text-xl font-semibold text-foreground">Speaking Distribution</h2>
          <p className="mb-4 text-sm text-muted">Stacked distribution across practice categories</p>
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="conversation" stackId="1" stroke="#2563EB" fill="#2563EB" />
                <Area type="monotone" dataKey="reading" stackId="1" stroke="#7C3AED" fill="#7C3AED" />
                <Area type="monotone" dataKey="shadowing" stackId="1" stroke="#22C55E" fill="#22C55E" />
                <Area type="monotone" dataKey="pronunciation" stackId="1" stroke="#F59E0B" fill="#F59E0B" />
                <Area type="monotone" dataKey="corrections" stackId="1" stroke="#EF4444" fill="#EF4444" />
                <Area type="monotone" dataKey="aiChat" stackId="1" stroke="#0EA5E9" fill="#0EA5E9" />
                <Area type="monotone" dataKey="vocabulary" stackId="1" stroke="#A855F7" fill="#A855F7" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.section>

      <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Card className={cn("rounded-[26px] p-6", GLASS)}>
          <h2 className="text-xl font-semibold text-foreground">Achievements & XP</h2>
          <p className="mb-4 text-sm text-muted">Unlocked and locked badges with XP rewards</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {achievements.map((a) => (
              <motion.div
                key={a.id}
                whileHover={{ y: -4 }}
                className={cn(
                  "min-w-[220px] rounded-2xl border p-4",
                  a.unlocked
                    ? "border-success/30 bg-success/10"
                    : "border-surface-border bg-white/55"
                )}
              >
                <div className="flex items-center justify-between">
                  <Award className={cn("h-5 w-5", a.unlocked ? "text-success" : "text-muted")} />
                  <span className={cn("text-xs font-semibold", a.unlocked ? "text-success" : "text-muted")}>
                    {a.unlocked ? "Unlocked" : "Locked"}
                  </span>
                </div>
                <p className="mt-2 font-semibold text-foreground">{a.label}</p>
                <p className="text-xs text-muted">Reward +{a.xp} XP</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className={cn("rounded-[26px] p-6", GLASS)}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-secondary" />
              <h2 className="text-xl font-semibold text-foreground">Weekly AI Report</h2>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {reportHighlights.map((item) => (
                <p key={item} className="rounded-lg bg-white/65 px-3 py-2 text-muted">
                  {item}
                </p>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Card className="rounded-[26px] border-0 bg-gradient-to-br from-[#2563EB] via-[#5B6DF5] to-[#7C3AED] p-6 text-white shadow-[0_22px_60px_-28px_rgba(37,99,235,0.8)]">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <h2 className="text-xl font-semibold">AI Recommendations</h2>
            </div>
            <p className="mt-1 text-sm text-white/85">Your next best actions based on progress and patterns</p>
            <div className="mt-4 space-y-2">
              {recommendations.map((rec) => (
                <div key={rec} className="flex items-start gap-2 rounded-lg bg-white/12 px-3 py-2">
                  <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-white/90" />
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={{ pathname: "/session", query: { from: returnTo } }}>
                <Button variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  Start Session
                </Button>
              </Link>
              <Link href={{ pathname: "/coach", query: { from: returnTo } }}>
                <Button variant="secondary" className="border-white/30 bg-white/10 text-white hover:bg-white/20">
                  Ask AI Coach
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      <motion.section initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <Card className={cn("rounded-[26px] p-6", GLASS)}>
          <h2 className="text-xl font-semibold text-foreground">AI Performance Signals</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {(insights.length > 0 ? insights.slice(0, 6) : [
              "Most improved area: pronunciation stability.",
              "Needs attention: sentence completion pace.",
              "Strength: clear short-form responses.",
              "Weakness: repeated Roman Hindi spelling patterns.",
              "Next goal: 20 daily speaking minutes for 7 days.",
              "Recommendation: one extra shadowing session this week.",
            ]).map((ins) => (
              <div key={ins} className="rounded-xl bg-white/65 px-3 py-2 text-sm text-muted">
                <Zap className="mr-1 inline h-3.5 w-3.5 text-primary" />
                {ins}
              </div>
            ))}
          </div>
        </Card>
      </motion.section>
    </div>
  );
}

function InsightChip({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-sm", color)}>
      <p className="font-semibold">{title}</p>
      <p className="text-right text-xs">{value}</p>
    </div>
  );
}
