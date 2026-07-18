"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Brain,
  Calendar,
  Download,
  Flame,
  Gauge,
  Languages,
  Mic,
  Share2,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import type { ProgressData } from "@/hooks/useProgressData";
import { useAuthOptional } from "@/components/AuthProvider";
import { ACHIEVEMENT_DEFS, USER_NAME } from "@/components/dashboard/constants";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils";
import {
  FloatingAIOrb,
  MetricCard,
  PrBadge3D,
  PrButton,
  PrChart,
  PrGlass,
  PrGradientBorder,
  PrHeatmap,
  PrRadar,
  PrRing,
  ProgressAurora,
  SectionTitle,
} from "./design-system";

const RECOMMENDATIONS = [
  { title: "Practice Pronunciation", href: "/sound-gym", gradient: "from-emerald-500 to-teal-600", icon: Volume2 },
  { title: "Review Roman Hindi", href: "/correct", gradient: "from-rose-500 to-pink-600", icon: Languages },
  { title: "Shadowing Session", href: "/shadowing", gradient: "from-blue-500 to-indigo-600", icon: Mic },
  { title: "Grammar Fix", href: "/correct", gradient: "from-orange-500 to-amber-600", icon: BookOpen },
  { title: "Vocabulary Drill", href: "/vocabulary", gradient: "from-violet-500 to-purple-600", icon: Sparkles },
  { title: "Conversation Practice", href: "/roleplay", gradient: "from-pink-500 to-rose-600", icon: Brain },
];

const TIER_CYCLE = ["gold", "silver", "crystal", "diamond"] as const;

function forecastScore(base: number, days: number, growth: number) {
  return Math.min(99, Math.round(base + growth * Math.log(days + 1) * 3));
}

export function ProgressIntelligence({ data }: { data: ProgressData }) {
  const auth = useAuthOptional();
  const firstName = auth?.user?.name?.split(" ")[0] ?? USER_NAME;
  const [heatmapRange, setHeatmapRange] = useState<"week" | "month" | "year">("month");
  const [celebrate, setCelebrate] = useState(false);

  const { analytics: a, insights, practice, dashboard: d, correctionHistory, leaderboard, streak } = data;

  const xp = d?.gamification?.xp ?? a.totals.sessions * 45 + a.totals.recordings * 18;
  const level = d?.gamification?.level ?? Math.max(1, Math.round(a.dayNumber / 8));
  const rank = leaderboard?.yourRank ?? null;
  const rankLabel = rank === null ? "—" : `#${rank}`;
  const currentStreak = streak?.streak ?? d?.streak ?? 0;
  const fluency = d?.fluencyScore ?? Math.round(a.averages.clarity * 0.85);
  const confidence = Math.round(a.averages.clarity * 0.45 + a.averages.loudness * 0.25 + a.goalProgressPct * 0.3);
  const grammar = Math.max(40, 100 - Math.round((a.totals.corrections / Math.max(a.totals.sessions, 1)) * 3));
  const pronunciation = Math.round(a.averages.clarity * 0.9 + a.averages.loudness * 0.1);
  const vocabulary = Math.min(99, 35 + (d?.totalSessions ?? a.totals.sessions) * 2);
  const completedSessions = d?.totalSessions ?? 0;
  const hasMeaningfulProgress =
    completedSessions > 0 ||
    xp > 0 ||
    d?.todaySessionComplete === true;
  const overviewSessions = hasMeaningfulProgress ? Math.max(completedSessions, a.totals.sessions) : 0;
  const overviewGrammar = hasMeaningfulProgress ? grammar : 0;
  const overviewVocabulary = hasMeaningfulProgress ? vocabulary : 0;
  const heroScore = hasMeaningfulProgress
    ? Math.round(confidence * 0.3 + fluency * 0.35 + grammar * 0.2 + a.goalProgressPct * 0.15)
    : 0;
  const remaining = Math.max(0, a.goalMinutes - a.todayMinutes);
  const estimated = remaining === 0 ? "Complete!" : `~${remaining * 2} min`;

  const weeklyChart = a.weeklyStats.slice(-7).map((w) => w.minutes);
  const weeklyLabels = a.weeklyStats.slice(-7).map((w) => w.label.slice(0, 3));
  const monthlyChart = a.monthlyStats.slice(-6).map((m) => m.minutes);
  const scoreTrend = a.scoreTrendWeekly.map((s) => Math.round((s.pronunciation + s.clarity) / 2));
  const xpCurve = a.weeklyStats.slice(-8).map((w, i) => w.minutes * 8 + w.sessions * 15 + i * 10);

  const mostImproved = insights.find((i) => /improved|better|great|strong/i.test(i)) ?? "Speaking clarity trending up";
  const weakest = insights.find((i) => /focus|work on|attention|weak/i.test(i)) ?? a.topMistakes[0]?.wrong ?? "Word endings";
  const aiRec = insights[0] ?? "Practice pronunciation for 8 minutes to boost fluency by 6%.";

  const radarPronunciation = [
    { label: "Clarity", value: Math.round(a.averages.clarity) },
    { label: "Speed", value: Math.min(99, Math.round(a.averages.paceWpm / 2)) },
    { label: "Confidence", value: confidence },
    { label: "Vowels", value: pronunciation },
    { label: "Flow", value: fluency },
    { label: "Projection", value: Math.round(a.averages.loudness) },
  ];

  const mistakeCategories = a.correctionsByType.length > 0
    ? a.correctionsByType
    : [
        { type: "grammar", count: a.totals.corrections },
        { type: "pronunciation", count: Math.round(a.totals.corrections * 0.4) },
        { type: "vocabulary", count: Math.round(a.totals.corrections * 0.2) },
      ];

  const earnedAchievements = ACHIEVEMENT_DEFS.filter((ach) =>
    ach.threshold({ sessions: a.totals.sessions, streak: currentStreak, xp, day: a.dayNumber, fluency })
  );

  const heatmapDays = useMemo(() => {
    if (heatmapRange === "week") return practice?.heatmap.slice(-7) ?? [];
    if (heatmapRange === "year") return practice?.heatmap ?? [];
    return practice?.heatmap.slice(-35) ?? [];
  }, [heatmapRange, practice]);

  const peakDay = practice?.summary ? `${practice.summary.goalMetDays} goal days` : "—";
  const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-40px" } };

  const timeline = [
    { icon: Mic, label: "Latest session", desc: `${a.todayMinutes} min today`, time: "Today", grad: "from-blue-500 to-indigo-600" },
    { icon: Trophy, label: "Achievement", desc: earnedAchievements[0]?.name ?? "Keep going", time: "Recent", grad: "from-amber-400 to-orange-500" },
    { icon: Zap, label: "Level progress", desc: `Level ${level} · ${xp} XP`, time: "Now", grad: "from-violet-500 to-purple-600" },
    { icon: Sparkles, label: "AI insight", desc: aiRec.slice(0, 50), time: "Live", grad: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-wide space-y-8 md:space-y-10">
      <ProgressAurora />
      <FloatingAIOrb tip={aiRec} />

      {/* HERO */}
      <motion.section {...fade}>
        <PrGradientBorder animated>
          <div className="relative p-6 sm:p-8">
            <p className="text-[13px] font-bold uppercase tracking-widest text-primary">Progress Intelligence</p>
            <h1 className="mt-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 bg-clip-text text-[40px] font-black leading-none tracking-tight text-transparent dark:from-slate-100 dark:via-indigo-200 dark:to-violet-200">
              {firstName}&apos;s Journey
            </h1>
            <p className="mt-2 text-[16px] text-muted">AI-powered analytics · Day {a.dayNumber}</p>

            <div className="mt-6 flex flex-wrap items-center gap-8">
              <PrRing value={heroScore} size={128} label="Hero Score" />
              <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { label: "Level", value: level, suffix: "" },
                  { label: "XP", value: xp, suffix: "" },
                  { label: "Rank", value: rank, suffix: "" },
                  { label: "Streak", value: currentStreak, suffix: "d" },
                  { label: "Today Goal", value: a.goalProgressPct, suffix: "%" },
                  { label: "ETA", value: remaining, suffix: "m" },
                ].map((s) => (
                  <div key={s.label} className="pr-stat rounded-2xl border border-white/50 bg-white/45 px-3 py-2.5 dark:bg-white/5">
                    <p className="text-[9px] font-bold uppercase text-muted">{s.label}</p>
                    <p className="text-xl font-black">
                      {s.label === "Rank" ? (rank === null ? "—" : rank) : <AnimatedNumber value={s.value as number} suffix={s.suffix} />}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-[13px] text-muted">Estimated completion: {estimated}</p>
          </div>
        </PrGradientBorder>
      </motion.section>

      {/* AI INSIGHT HERO */}
      <motion.section {...fade}>
        <PrGradientBorder animated>
          <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="md:col-span-2 lg:col-span-4 flex items-start gap-4">
              <div className="pr-ai-orb flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#EC4899] text-2xl shadow-lg">✨</div>
              <div>
                <SectionTitle title="AI Performance Brief" subtitle="Where you are · Where you're going" />
              </div>
            </div>
            {[
              { title: "Most Improved", value: mostImproved.slice(0, 45), color: "from-emerald-50 to-teal-50 dark:from-emerald-950/30" },
              { title: "Needs Focus", value: weakest, color: "from-rose-50 to-orange-50 dark:from-rose-950/30" },
              { title: "Confidence", value: `${confidence}%`, color: "from-violet-50 to-purple-50 dark:from-violet-950/30" },
              { title: "Predicted +7d", value: `+${forecastScore(fluency, 7, 2) - fluency}% fluency`, color: "from-blue-50 to-indigo-50 dark:from-blue-950/30" },
              { title: "Next Milestone", value: `Level ${level + 1}`, color: "from-amber-50 to-yellow-50 dark:from-amber-950/30" },
              { title: "Est. Time", value: estimated, color: "from-cyan-50 to-sky-50 dark:from-cyan-950/30" },
              { title: "AI Recommendation", value: aiRec.slice(0, 60), color: "from-pink-50 to-fuchsia-50 dark:from-pink-950/30" },
            ].map((item) => (
              <div key={item.title} className={cn("rounded-2xl bg-gradient-to-br p-4", item.color)}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{item.title}</p>
                <p className="mt-1 text-[15px] font-bold leading-snug">{item.value}</p>
              </div>
            ))}
            <div className="md:col-span-2 lg:col-span-4">
              <PrButton href="/session"><Zap className="h-4 w-4" />Start Recommended Session</PrButton>
            </div>
          </div>
        </PrGradientBorder>
      </motion.section>

      {/* KPI OVERVIEW */}
      <motion.section {...fade}>
        <SectionTitle title="Overview" subtitle="Your command center metrics" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          <MetricCard icon={Calendar} label="Sessions" value={overviewSessions} trend={8} sparkline={weeklyChart} gradient="from-blue-500 to-indigo-600" />
          <MetricCard icon={Mic} label="Speaking Min" value={a.totals.speakingMinutes} trend={12} sparkline={weeklyChart} gradient="from-violet-500 to-purple-600" />
          <MetricCard icon={TrendingUp} label="Fluency" value={fluency} suffix="%" trend={5} gradient="from-emerald-500 to-teal-600" />
          <MetricCard icon={Volume2} label="Pronunciation" value={pronunciation} suffix="%" trend={7} gradient="from-cyan-500 to-blue-600" />
          <MetricCard icon={BookOpen} label="Grammar" value={overviewGrammar} suffix="%" trend={-2} gradient="from-orange-500 to-amber-600" />
          <MetricCard icon={Sparkles} label="Vocabulary" value={overviewVocabulary} suffix="%" trend={4} gradient="from-pink-500 to-rose-600" />
          <MetricCard icon={Brain} label="Confidence" value={confidence} suffix="%" trend={6} gradient="from-indigo-500 to-violet-600" />
          <MetricCard icon={Flame} label="Streak" value={currentStreak} suffix="d" trend={3} gradient="from-orange-400 to-red-500" />
          <MetricCard icon={Star} label="Level" value={level} gradient="from-amber-400 to-orange-500" />
          <MetricCard icon={Award} label="XP" value={xp} trend={10} sparkline={xpCurve} gradient="from-violet-500 to-fuchsia-600" />
          <MetricCard icon={Target} label="Completion" value={a.goalProgressPct} suffix="%" gradient="from-blue-500 to-cyan-600" />
          <MetricCard icon={Gauge} label="Weekly Goal" value={a.goalProgressPct} suffix="%" gradient="from-emerald-500 to-green-600" />
        </div>
      </motion.section>

      {/* CHARTS */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section {...fade}>
          <PrGlass className="p-5" glow="blue">
            <SectionTitle title="Weekly Progress" subtitle="Speaking minutes" />
            <PrChart values={weeklyChart.length ? weeklyChart : [2, 4, 6, 5, 8, 7, a.todayMinutes]} labels={weeklyLabels} />
          </PrGlass>
        </motion.section>
        <motion.section {...fade}>
          <PrGlass className="p-5" glow="purple">
            <SectionTitle title="Monthly Growth" subtitle="Practice volume" />
            <PrChart values={monthlyChart.length ? monthlyChart : [10, 15, 12, 18, 20, 22]} />
          </PrGlass>
        </motion.section>
        <motion.section {...fade}>
          <PrGlass className="p-5" glow="cyan">
            <SectionTitle title="Pronunciation Trend" />
            <PrChart values={scoreTrend.length ? scoreTrend : [60, 62, 65, 68, 70, 72, fluency]} />
          </PrGlass>
        </motion.section>
        <motion.section {...fade}>
          <PrGlass className="p-5" glow="pink">
            <SectionTitle title="XP Curve" />
            <PrChart values={xpCurve.length ? xpCurve : [50, 80, 120, 100, 150, 180, xp % 200]} />
          </PrGlass>
        </motion.section>
      </div>

      {/* HEATMAP */}
      <motion.section {...fade}>
        <PrGlass className="p-6" glow="amber">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <SectionTitle title="Consistency Heatmap" subtitle={`${practice?.summary.activeDays ?? 0} active days · Peak: ${peakDay}`} />
            <div className="flex gap-1 rounded-2xl border border-white/50 bg-white/40 p-1 dark:bg-white/5">
              {(["week", "month", "year"] as const).map((r) => (
                <button key={r} type="button" onClick={() => setHeatmapRange(r)}
                  className={cn("rounded-xl px-3 py-1.5 text-xs font-bold capitalize", heatmapRange === r ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white" : "text-muted")}>
                  {r}
                </button>
              ))}
            </div>
          </div>
          <PrHeatmap days={heatmapDays} />
          <div className="mt-4 flex flex-wrap gap-4 text-[12px] text-muted">
            <span>Practice days: {practice?.summary.activeDays ?? 0}</span>
            <span>Goal met: {practice?.summary.goalMetDays ?? 0}</span>
            <span>Total: {practice?.summary.totalMinutes ?? 0} min</span>
          </div>
        </PrGlass>
      </motion.section>

      {/* PRONUNCIATION RADAR + AI PERFORMANCE */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.section {...fade}>
          <PrGlass className="p-6" glow="cyan">
            <SectionTitle title="Pronunciation Radar" subtitle="Multi-dimensional voice analysis" />
            <PrRadar scores={radarPronunciation} />
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {radarPronunciation.map((s) => (
                <span key={s.label} className="rounded-full bg-white/50 px-2 py-0.5 text-[10px] font-bold dark:bg-white/5">{s.label} {s.value}%</span>
              ))}
            </div>
          </PrGlass>
        </motion.section>
        <motion.section {...fade}>
          <PrGlass className="p-6" glow="purple">
            <SectionTitle title="AI Performance" />
            <div className="space-y-3">
              {[
                { icon: "💪", label: "Strength", value: mostImproved.slice(0, 50) },
                { icon: "🎯", label: "Weakness", value: weakest },
                { icon: "📈", label: "Most Improved", value: `+${Math.round(fluency * 0.06)}% this week` },
                { icon: "⚠️", label: "Risk Area", value: a.topMistakes[0] ? `"${a.topMistakes[0].wrong}"` : "None detected" },
                { icon: "🔥", label: "Motivation", value: `${Math.min(99, 60 + currentStreak * 3)}%` },
                { icon: "💎", label: "Predicted Score", value: `${forecastScore(heroScore, 30, 3)} in 30d` },
              ].map((row) => (
                <div key={row.label} className="flex items-start gap-3 rounded-2xl bg-white/40 p-3 dark:bg-white/5">
                  <span className="text-xl">{row.icon}</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-muted">{row.label}</p>
                    <p className="text-[14px] font-semibold">{row.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </PrGlass>
        </motion.section>
      </div>

      {/* MISTAKE ANALYTICS */}
      <motion.section {...fade}>
        <SectionTitle title="Mistake Analytics" subtitle="Grouped by category · trend & confidence" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mistakeCategories.map((cat, i) => (
            <PrGlass key={cat.type} className="p-5" glow={i % 2 === 0 ? "pink" : "blue"}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{cat.type}</p>
              <p className="mt-1 text-3xl font-black">{cat.count}</p>
              <p className="text-[12px] text-muted">errors tracked</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/80">
                <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" style={{ width: `${Math.min(100, cat.count * 5)}%` }} />
              </div>
              <PrButton href="/mistakes" variant="ghost" className="mt-4 w-full text-xs">Practice Again</PrButton>
            </PrGlass>
          ))}
        </div>
      </motion.section>

      {/* AI RECOMMENDATIONS CAROUSEL */}
      <motion.section {...fade}>
        <SectionTitle title="AI Recommendations" subtitle="Personalized next steps" />
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {RECOMMENDATIONS.map((rec) => {
            const Icon = rec.icon;
            return (
              <motion.div key={rec.title} whileHover={{ y: -6 }} className="shrink-0">
                <Link href={rec.href} className="block w-[200px] rounded-[24px] border border-white/55 bg-white/55 p-5 shadow-lg backdrop-blur-xl dark:bg-slate-900/50">
                  <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", rec.gradient)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-3 text-[16px] font-extrabold">{rec.title}</p>
                  <span className="mt-2 inline-flex text-xs font-bold text-primary">Start →</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* FORECAST */}
      <motion.section {...fade}>
        <PrGradientBorder>
          <div className="p-6">
            <SectionTitle title="AI Forecast" subtitle="Predicted trajectory" />
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { days: 7, fluency: forecastScore(fluency, 7, 2), conf: forecastScore(confidence, 7, 1.5), level },
                { days: 30, fluency: forecastScore(fluency, 30, 2.5), conf: forecastScore(confidence, 30, 2), level: level + 1 },
                { days: 90, fluency: forecastScore(fluency, 90, 3), conf: forecastScore(confidence, 90, 2.5), level: level + 2 },
              ].map((f) => (
                <div key={f.days} className="rounded-2xl bg-gradient-to-br from-indigo-50/90 to-violet-50/90 p-4 dark:from-indigo-950/40 dark:to-violet-950/40">
                  <p className="text-[10px] font-bold uppercase text-violet-600">{f.days} days</p>
                  <p className="mt-2 text-2xl font-black">{f.fluency}% fluency</p>
                  <p className="text-[13px] text-muted">Confidence {f.conf}% · Level {f.level}</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <PrChart values={[fluency, forecastScore(fluency, 7, 2), forecastScore(fluency, 30, 2.5), forecastScore(fluency, 90, 3)]}
                labels={["Now", "7d", "30d", "90d"]} />
            </div>
          </div>
        </PrGradientBorder>
      </motion.section>

      {/* ACHIEVEMENTS */}
      <motion.section {...fade}>
        <SectionTitle title="Achievement Gallery" subtitle="Trophy cabinet" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {ACHIEVEMENT_DEFS.slice(0, 6).map((ach, i) => {
            const earned = earnedAchievements.some((e) => e.id === ach.id);
            return (
              <PrBadge3D key={ach.id} icon={ach.icon} name={ach.name} tier={TIER_CYCLE[i % TIER_CYCLE.length]} earned={earned} />
            );
          })}
        </div>
      </motion.section>

      {/* LEADERBOARD */}
      {leaderboard && (
        <motion.section {...fade}>
          <PrGlass className="p-6" glow="amber">
            <SectionTitle title="Leaderboard" subtitle={`${leaderboard.league} League · Rank ${rankLabel}`} />
            {leaderboard.entries.slice(0, 5).map((row) => (
              <div key={row.id} className={cn("mb-2 flex items-center gap-3 rounded-2xl px-4 py-3", row.isYou ? "bg-gradient-to-r from-primary/10 to-violet-500/10 ring-1 ring-primary/25" : "bg-white/40 dark:bg-white/5")}>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-white">{row.rank}</span>
                <span className="flex-1 font-bold">{row.name} {row.isYou && <span className="text-xs text-primary">(You)</span>}</span>
                <span className="font-extrabold text-violet-600">{row.xp} XP</span>
              </div>
            ))}
          </PrGlass>
        </motion.section>
      )}

      {/* TIMELINE */}
      <motion.section {...fade}>
        <SectionTitle title="Learning Timeline" subtitle="Your story unfolds" />
        <PrGlass className="p-6">
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={i} className="pr-timeline-item relative flex gap-4 pb-8 last:pb-0">
                <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", item.grad)}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 border-b border-white/30 pb-6 last:border-0">
                  <div className="flex justify-between">
                    <p className="font-bold">{item.label}</p>
                    <span className="text-[11px] text-muted">{item.time}</span>
                  </div>
                  <p className="text-[13px] text-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </PrGlass>
      </motion.section>

      {/* ACTIONS */}
      <motion.section {...fade} className="flex flex-wrap gap-3">
        <PrButton href="/reports"><Download className="h-4 w-4" />Weekly Report</PrButton>
        <PrButton variant="ghost" onClick={() => { setCelebrate(true); setTimeout(() => setCelebrate(false), 2500); }}>
          <Share2 className="h-4 w-4" />Share Progress
        </PrButton>
        <PrButton variant="ghost" href="/voice-timeline"><Mic className="h-4 w-4" />Voice Replay</PrButton>
        <PrButton variant="ghost" href="/heatmap"><Calendar className="h-4 w-4" />Full Heatmap</PrButton>
      </motion.section>

      {celebrate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pointer-events-none fixed inset-0 z-[300] flex items-center justify-center">
          <p className="text-6xl">🎉</p>
        </motion.div>
      )}
    </div>
  );
}
