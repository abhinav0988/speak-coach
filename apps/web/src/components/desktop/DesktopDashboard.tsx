"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  Bot,
  Brain,
  ChevronRight,
  Flame,
  Gift,
  Heart,
  MessageSquare,
  Mic,
  PenLine,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  Volume2,
  Zap,
} from "lucide-react";
import type { DashboardData } from "@/hooks/useDashboardData";
import { useAuthOptional } from "@/components/AuthProvider";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ACHIEVEMENT_DEFS, MISSION_XP_REWARD, PRACTICE_MODULES, USER_NAME } from "@/components/dashboard/constants";
import { PracticeHeatmap } from "@/components/analytics/PracticeHeatmap";
import { getDayPeriod, getTimeGreeting } from "@/lib/greeting";
import {
  AchievementBadge3D,
  AIOrb,
  AnimatedChart,
  MiniRadar,
  PillBadge,
  ProgressRing,
  StatWidget,
} from "@/components/luxury-dashboard/design-system";
import { buildDashboardMetrics } from "./dashboard-metrics";
import { DesktopNavbar } from "./DesktopNavbar";
import { DesktopSidebar } from "./DesktopSidebar";
import { StickyAIPanel } from "./StickyAIPanel";
import { DkButton, DkGlass, DkGradientBorder, DkSectionTitle } from "./design-system";
import { cn } from "@/lib/utils";

const TIER = ["gold", "silver", "crystal"] as const;
const QUICK_IDS = ["session", "coach", "live", "vocabulary", "grammar", "roleplay", "listening", "shadow"] as const;

export function DesktopDashboard({ data, onUseFreeze }: { data: DashboardData; onUseFreeze?: () => Promise<unknown> }) {
  const auth = useAuthOptional();
  const firstName = auth?.user?.name?.split(" ")[0] ?? USER_NAME;
  const greeting = getTimeGreeting(getDayPeriod());
  const m = useMemo(() => buildDashboardMetrics(data), [data]);
  const { dashboard, heatmap, leaderboard } = data;
  const [mistakeIdx, setMistakeIdx] = useState(0);

  const mistakes = m.mistakes;
  const currentMistake = mistakes[mistakeIdx % Math.max(mistakes.length, 1)];
  const masteryPct = mistakes.length ? Math.min(100, Math.round(100 - (currentMistake?.repeatCount ?? 1) * 12)) : 100;
  const quickModules = PRACTICE_MODULES.filter((mod) => (QUICK_IDS as readonly string[]).includes(mod.id));
  const allMissionDone = m.missionDone === m.missionTasks.length;
  const weeklyQuestPct = Math.min(100, ((m.analytics?.weeklyStats?.filter((w) => w.minutes > 0).length ?? 2) / 5) * 100);
  const longestStreak = Math.max(dashboard.streak, m.streak?.longestStreak ?? dashboard.streak, dashboard.totalPracticeDays ?? 0);
  const rankLabel = m.rank === null ? "—" : `#${m.rank}`;

  return (
    <div className="dk-shell hidden w-full lg:block">
      <div className="dk-aurora pointer-events-none fixed inset-0 -z-10" aria-hidden />

      <div className="flex w-full items-start">
        <DesktopSidebar />

        <div className="min-w-0 flex-1">
          <DesktopNavbar m={m} />

          <div className="mx-auto flex w-full max-w-[1700px] items-start gap-8 px-10 pb-10">
            <main className="min-w-0 flex-1 space-y-8">
              {/* HERO */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <DkGradientBorder>
                  <div className="relative grid grid-cols-12 gap-6 p-8">
                    <div className="col-span-12 xl:col-span-8">
                      <p className="text-[16px] font-medium text-muted">{greeting},</p>
                      <h1 className="mt-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-800 bg-clip-text text-[56px] font-black leading-[1.05] tracking-tight text-transparent">
                        {firstName} 👋
                      </h1>
                      <p className="mt-3 max-w-xl text-[16px] text-muted">
                        {m.goalRemaining > 0
                          ? `You're only ${m.goalRemaining} minutes away from today's goal.`
                          : "You've crushed today's goal. Keep the momentum going!"}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-[13px] text-rose-500">
                        <Heart className="h-4 w-4 fill-rose-400 text-rose-400" />
                        {m.motivation}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <DkButton href="/session"><Play className="h-4 w-4" fill="currentColor" /> Continue Learning</DkButton>
                        <DkButton href="/coach" variant="ghost"><Bot className="h-4 w-4" /> AI Coach</DkButton>
                        {m.resume && (
                          <DkButton href="/session" variant="ghost"><Zap className="h-4 w-4" /> Resume {m.resume.label}</DkButton>
                        )}
                      </div>
                      <div className="mt-6 flex flex-wrap gap-4">
                        {[
                          { l: "Weekly XP", v: m.weeklyXp, s: "" },
                          { l: "Coins", v: m.coins, s: "" },
                          { l: "Rank", v: m.rank, s: "" },
                          { l: "Focus", v: m.dailyScore, s: "%" },
                        ].map((x) => (
                          <div key={x.l} className="rounded-2xl bg-white/45 px-4 py-2 dark:bg-white/5">
                            <p className="text-[10px] font-bold uppercase text-muted">{x.l}</p>
                            <p className="text-xl font-black">
                              {x.l === "Rank" ? (m.rank === null ? "—" : m.rank) : <AnimatedNumber value={x.v as number} suffix={x.s} />}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-12 flex items-center justify-center gap-6 xl:col-span-4">
                      <ProgressRing value={m.dailyScore} size={110} label="Daily Score" />
                      <ProgressRing value={m.goalPct} size={110} label="Today" />
                    </div>
                  </div>
                </DkGradientBorder>
              </motion.section>

              {/* AI HERO */}
              <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <DkGradientBorder>
                  <div className="flex items-center gap-6 p-6">
                    <AIOrb />
                    <div className="flex-1">
                      <PillBadge tone="ai">AI Coach · Today&apos;s Recommendation</PillBadge>
                      <p className="mt-3 text-[22px] font-bold leading-snug">&ldquo;{m.aiTip}&rdquo;</p>
                      <p className="mt-2 text-[13px] text-muted">
                        Estimated +6% fluency · {m.goalRemaining > 0 ? `${m.goalRemaining} min to goal` : "Goal complete"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2">
                      <DkButton href="/session"><Play className="h-4 w-4" fill="currentColor" /> Start Session</DkButton>
                      <DkButton href="/coach" variant="ghost"><Bot className="h-4 w-4" /> Ask AI</DkButton>
                    </div>
                  </div>
                </DkGradientBorder>
              </motion.section>

              {/* GAMIFICATION BAR */}
              <section>
                <DkGlass className="p-5" glow>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-6">
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase text-muted">Level</p>
                        <p className="text-2xl font-black text-primary">{m.level}</p>
                        <p className="text-[11px] text-muted">{m.levelName}</p>
                      </div>
                      <div className="h-12 w-px bg-white/40" />
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase text-muted">Coins</p>
                        <p className="text-2xl font-black text-amber-600">🪙 <AnimatedNumber value={m.coins} /></p>
                      </div>
                      <div className="h-12 w-px bg-white/40" />
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase text-muted">League</p>
                        <p className="text-2xl font-black text-violet-600">{m.league}</p>
                      </div>
                      <div className="h-12 w-px bg-white/40" />
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase text-muted">Weekly XP</p>
                        <p className="text-2xl font-black text-emerald-600">+{m.weeklyXp}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href="/rewards?tab=daily"><PillBadge tone="amber">🎁 Daily Reward</PillBadge></Link>
                      <Link href="/rewards?tab=spin"><PillBadge tone="hot">🎰 Lucky Spin</PillBadge></Link>
                      <Link href="/rewards?tab=chest"><PillBadge tone="success">📦 Treasure Chest</PillBadge></Link>
                    </div>
                  </div>
                </DkGlass>
              </section>

              {/* MISSION + STREAK */}
              <section className="grid grid-cols-1 gap-6 2xl:grid-cols-5">
                <DkGlass className="p-6 2xl:col-span-3" glow>
                  <DkSectionTitle title="Today's Mission" subtitle={`${m.missionDone}/${m.missionTasks.length} tasks · +${MISSION_XP_REWARD} XP`} />
                  <div className="flex gap-6">
                    <ProgressRing value={m.missionPct} size={100} sublabel={`+${MISSION_XP_REWARD} XP`} />
                    <div className="flex-1 space-y-2">
                      {m.missionTasks.map((task, i) => (
                        <motion.div
                          key={task.id}
                          whileHover={{ x: 4 }}
                          className={cn(
                            "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                            task.done ? "border-emerald-200/60 bg-emerald-50/50 line-through text-muted" : "border-white/50 bg-white/30"
                          )}
                        >
                          <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold", task.done ? "bg-emerald-500 text-white" : "bg-slate-200")}>
                            {task.done ? "✓" : i + 1}
                          </span>
                          {task.label}
                          <span className="ml-auto text-[11px] text-muted">+15 XP</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  {allMissionDone && (
                    <p className="mt-4 text-center text-sm font-bold text-emerald-600">🎉 Mission complete! +{MISSION_XP_REWARD} XP earned</p>
                  )}
                </DkGlass>

                <DkGlass className="p-6 2xl:col-span-2" glow>
                  <DkSectionTitle title="Streak" subtitle="Keep the fire alive" />
                  <div className="flex items-center justify-center py-2">
                    <div className="text-center">
                      <span className="text-5xl">🔥</span>
                      <p className="mt-2 text-4xl font-black text-orange-600"><AnimatedNumber value={dashboard.streak} /></p>
                      <p className="text-[13px] font-semibold text-muted">day streak</p>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-3 text-center">
                    <div className="rounded-xl bg-white/50 p-3 dark:bg-white/5">
                      <p className="text-[10px] font-bold uppercase text-muted">Longest</p>
                      <p className="text-xl font-black">{longestStreak}d</p>
                    </div>
                    <div className="rounded-xl bg-white/50 p-3 dark:bg-white/5">
                      <p className="text-[10px] font-bold uppercase text-muted">Freezes</p>
                      <p className="text-xl font-black">{dashboard.freezesAvailable ?? 0}</p>
                    </div>
                  </div>
                  {(dashboard.freezesAvailable ?? 0) > 0 && onUseFreeze && (
                    <DkButton className="mt-4 w-full" variant="ghost" onClick={() => void onUseFreeze()}>
                      Use Streak Freeze
                    </DkButton>
                  )}
                  <div className="mt-4 flex justify-between gap-1">
                    {(m.analytics?.weeklyStats?.slice(-7) ?? []).map((w, i) => (
                      <div
                        key={i}
                        className={cn("h-8 flex-1 rounded-lg", w.minutes > 0 ? "bg-gradient-to-t from-orange-400 to-amber-300" : "bg-slate-200/60")}
                        title={`${w.label}: ${w.minutes} min`}
                      />
                    ))}
                  </div>
                </DkGlass>
              </section>

              {/* JOURNEY */}
              <section>
                <DkSectionTitle title="Learning Journey" subtitle={`Day ${dashboard.dayNumber} of 90 · ${m.journeyProgressPct}% complete`} />
                <DkGlass className="p-6" glow>
                  <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-none">
                    {m.milestones.map((ms) => (
                      <div key={ms.day} className="flex w-28 shrink-0 flex-col items-center">
                        <div className={cn(
                          "flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-black shadow-lg",
                          ms.completed ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white" : ms.reached ? "bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white" : "bg-white/50 text-muted"
                        )}>
                          {ms.completed ? "✓" : ms.day}
                        </div>
                        <p className="mt-2 text-center text-[11px] font-bold">{ms.label}</p>
                      </div>
                    ))}
                  </div>
                  {m.journeyDays.length > 0 && (
                    <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-none">
                      {m.journeyDays.map((d) => (
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
                </DkGlass>
              </section>

              {/* LIVE STATS */}
              <section>
                <DkSectionTitle title="Live Stats" subtitle="Real-time learning intelligence" />
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                  <StatWidget icon={Mic} label="Speaking Min" value={m.todayMinutes} suffix="m" trend={12} sparkline={m.weeklyChart} gradient="from-blue-500 to-indigo-600" />
                  <StatWidget icon={Star} label="XP" value={m.xp} trend={8} gradient="from-violet-500 to-purple-600" />
                  <StatWidget icon={Flame} label="Streak" value={dashboard.streak} suffix="d" trend={5} gradient="from-orange-400 to-red-500" />
                  <StatWidget icon={BookOpen} label="Vocabulary" value={m.scores.vocabulary} suffix="%" trend={3} gradient="from-emerald-500 to-teal-500" />
                  <StatWidget icon={PenLine} label="Grammar" value={m.scores.grammar} suffix="%" trend={-2} gradient="from-pink-500 to-rose-500" />
                  <StatWidget icon={Brain} label="Confidence" value={m.scores.confidence} suffix="%" trend={6} gradient="from-cyan-500 to-blue-500" />
                  <StatWidget icon={TrendingUp} label="Fluency" value={m.scores.fluency} suffix="%" trend={4} gradient="from-indigo-500 to-violet-600" />
                  <StatWidget icon={Volume2} label="Pronunciation" value={m.scores.pronunciation} suffix="%" trend={7} gradient="from-amber-400 to-orange-500" />
                </div>
              </section>

              {/* AI INSIGHTS */}
              <section>
                <DkGradientBorder>
                  <div className="p-6">
                    <div className="mb-5 flex items-start gap-3">
                      <AIOrb />
                      <DkSectionTitle title="AI Insights" subtitle="Personalized intelligence for today" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                      {[
                        { title: "Today's Strength", value: m.aiStrength, icon: "💪", color: "from-emerald-50 to-teal-50" },
                        { title: "Needs Attention", value: m.aiAttention, icon: "🎯", color: "from-rose-50 to-orange-50" },
                        { title: "Suggested Exercise", value: "Pronunciation drill · 8 min", icon: "🎤", color: "from-blue-50 to-indigo-50" },
                        { title: "Weekly Improvement", value: `+${Math.round(m.scores.fluency * 0.06)}% fluency`, icon: "📈", color: "from-violet-50 to-purple-50" },
                      ].map((item) => (
                        <div key={item.title} className={cn("rounded-2xl bg-gradient-to-br p-4", item.color)}>
                          <span className="text-2xl">{item.icon}</span>
                          <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted">{item.title}</p>
                          <p className="mt-1 text-[16px] font-bold leading-snug">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </DkGradientBorder>
              </section>

              {/* PROGRESS INTELLIGENCE */}
              <section className="grid grid-cols-1 gap-6 2xl:grid-cols-3">
                <DkGlass className="p-6 2xl:col-span-2" glow>
                  <DkSectionTitle title="Weekly Analytics" subtitle="Speaking minutes trend" action={<Link href="/analytics" className="text-sm font-bold text-primary">Full report →</Link>} />
                  <AnimatedChart values={m.weeklyChart} className="mt-2 h-40" />
                  <p className="mt-3 text-sm text-muted">{m.todayMinutes} min today · {m.goalMinutes} min goal</p>
                </DkGlass>
                <DkGlass className="p-6" glow>
                  <p className="text-[11px] font-bold uppercase text-muted">Confidence radar</p>
                  <MiniRadar scores={[
                    { label: "Grammar", value: m.scores.grammar },
                    { label: "Fluency", value: m.scores.fluency },
                    { label: "Pronunciation", value: m.scores.pronunciation },
                    { label: "Confidence", value: m.scores.confidence },
                    { label: "Consistency", value: m.scores.consistency },
                  ]} />
                </DkGlass>
              </section>

              {/* ACHIEVEMENTS */}
              <section>
                <DkSectionTitle title="Achievements" subtitle="Your badge cabinet" action={<Link href="/rewards" className="text-sm font-bold text-primary">View all</Link>} />
                <div className="grid grid-cols-3 gap-4 xl:grid-cols-6">
                  {ACHIEVEMENT_DEFS.slice(0, 6).map((a, i) => {
                    const earned = m.earnedAchievements.some((e) => e.id === a.id);
                    return <AchievementBadge3D key={a.id} icon={a.icon} name={a.name} earned={earned} tier={TIER[i % 3]} />;
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Daily", "Weekly", "Monthly", "Milestones"].map((cat) => (
                    <PillBadge key={cat} tone="primary">{cat}</PillBadge>
                  ))}
                </div>
              </section>

              {/* MISTAKE CENTER */}
              <section>
                <DkSectionTitle title="Mistake Center" subtitle="Swipe through flashcards · master every error" />
                {mistakes.length === 0 ? (
                  <DkGlass className="p-8 text-center" glow>
                    <span className="text-4xl">✨</span>
                    <p className="mt-3 text-[22px] font-bold">No repeated mistakes yet</p>
                    <DkButton href="/session" className="mt-4">Start practicing</DkButton>
                  </DkGlass>
                ) : (
                  <DkGlass className="p-6" glow>
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
                        <p className="mt-3 flex items-center gap-1.5 text-sm font-bold text-primary">
                          <Volume2 className="h-4 w-4" /> Pronunciation
                        </p>
                      </div>
                    </motion.div>
                    <p className="mt-4 text-sm text-muted">AI: Focus on the &ldquo;{currentMistake?.correct}&rdquo; sound — repeat 3× slowly.</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-muted">Mastery</p>
                        <p className="text-lg font-black">{masteryPct}%</p>
                      </div>
                      <div className="flex gap-2">
                        <DkButton variant="ghost" onClick={() => setMistakeIdx((i) => (i + 1) % mistakes.length)}>
                          Next <ChevronRight className="h-4 w-4" />
                        </DkButton>
                        <DkButton href="/coach">Practice Again</DkButton>
                      </div>
                    </div>
                  </DkGlass>
                )}
              </section>

              {/* RECENT ACTIVITY */}
              <section>
                <DkSectionTitle title="Recent Activity" subtitle="Your learning story unfolds here" />
                <DkGlass className="p-6">
                  <div className="ld-timeline space-y-0">
                    {[
                      { icon: Play, label: "Today's lesson", desc: dashboard.practicedToday ? "Session in progress" : "Not started yet", time: "Today", grad: "from-blue-500 to-indigo-600" },
                      { icon: Trophy, label: "Achievement", desc: m.earnedAchievements[0]?.name ?? "Keep going to unlock", time: "Recent", grad: "from-amber-400 to-orange-500" },
                      { icon: PenLine, label: "Correction", desc: mistakes[0] ? `${mistakes[0].wrong} → ${mistakes[0].correct}` : "No corrections yet", time: "Today", grad: "from-rose-500 to-pink-500" },
                      { icon: Sparkles, label: "AI Feedback", desc: `${m.aiTip.slice(0, 60)}…`, time: "Now", grad: "from-violet-500 to-purple-600" },
                    ].map((item, i) => (
                      <div key={i} className="ld-timeline-item relative flex gap-4 pb-8 last:pb-0">
                        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", item.grad)}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 border-b border-white/40 pb-6 last:border-0">
                          <div className="flex items-center justify-between">
                            <p className="font-bold">{item.label}</p>
                            <span className="text-[11px] text-muted">{item.time}</span>
                          </div>
                          <p className="mt-0.5 text-[13px] text-muted">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </DkGlass>
              </section>

              {/* QUICK ACTIONS */}
              <section>
                <DkSectionTitle title="Quick Actions" subtitle="Launch any mode instantly" />
                <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                  {quickModules.map((mod) => {
                    const Icon = mod.icon;
                    return (
                      <motion.div key={mod.id} whileHover={{ y: -6, scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Link href={mod.href} className="ld-quick-action group block rounded-[24px] border border-white/55 bg-white/55 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl">
                          <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition group-hover:scale-110", mod.iconGradient)}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <p className="mt-3 text-[16px] font-extrabold">{mod.title}</p>
                          <p className="text-[13px] text-muted">{mod.time}</p>
                          <span className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary opacity-0 transition group-hover:opacity-100">
                            Launch <ArrowRight className="h-3 w-3" />
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </section>

              {/* LEADERBOARD + WEEKLY QUEST */}
              <section className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
                <DkGlass className="p-6" glow>
                  <DkSectionTitle title="Leaderboard" subtitle={`${m.league} · Rank ${rankLabel}`} />
                  {(leaderboard?.entries ?? []).slice(0, 5).map((row) => (
                    <div key={row.id} className={cn("mb-2 flex items-center gap-3 rounded-2xl px-4 py-3", row.isYou ? "bg-violet-500/10 ring-1 ring-violet-500/25" : "bg-white/30")}>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-black text-white">{row.rank}</span>
                      <div className="flex-1">
                        <span className="font-bold">{row.name} {row.isYou && <span className="text-xs text-primary">(You)</span>}</span>
                        <p className="text-[10px] font-semibold text-muted">{row.league} · {row.streak}d streak</p>
                      </div>
                      <span className="font-extrabold text-violet-600">{row.xp} XP</span>
                    </div>
                  ))}
                  <Link href="/rewards?tab=challenge" className="mt-2 block text-center text-sm font-bold text-primary">View all rewards →</Link>
                </DkGlass>

                <DkGlass className="p-6" glow>
                  <DkSectionTitle title="Weekly Quest" subtitle="Challenge friends · earn bonus rewards" />
                  <div className="space-y-3">
                    <div className="rounded-2xl bg-gradient-to-r from-[#2563EB]/10 to-[#7C3AED]/10 p-4">
                      <p className="font-bold">Speak 5 days this week</p>
                      <p className="text-[13px] text-muted">Reward: 500 XP + Treasure Chest</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/60">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] transition-all duration-1000" style={{ width: `${weeklyQuestPct}%` }} />
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
                          <p className="mt-1 text-[11px] font-bold">{item.label}</p>
                        </Link>
                      ))}
                    </div>
                    <DkButton href="/challenge" className="w-full" variant="ghost">Start Weekly Challenge</DkButton>
                  </div>
                </DkGlass>
              </section>

              {heatmap && (
                <section>
                  <DkSectionTitle title="Practice Heatmap" />
                  <DkGlass className="p-6" glow>
                    <PracticeHeatmap days={heatmap.heatmap} goalMinutes={heatmap.goalMinutes} summary={heatmap.summary} compact />
                  </DkGlass>
                </section>
              )}

              {/* FOOTER MOTIVATION */}
              <section>
                <DkGradientBorder>
                  <div className="flex items-center gap-6 p-8">
                    <div className="flex-1">
                      <p className="text-[13px] font-bold uppercase tracking-wider text-muted">Motivation</p>
                      <p className="mt-1 text-[22px] font-bold italic">&ldquo;{m.motivation}&rdquo;</p>
                      <p className="mt-2 text-[13px] text-muted">
                        <Sparkles className="mr-1 inline h-4 w-4 text-violet-500" />
                        AI Suggestion: {m.aiTip.slice(0, 80)}…
                      </p>
                      <p className="mt-1 text-[13px] font-semibold text-amber-600">
                        🎁 Upcoming reward: Level {m.level + 1} unlock at {m.level * 200 + 200} XP
                      </p>
                    </div>
                    <DkButton href="/session" className="shrink-0">
                      Continue Learning <ArrowRight className="h-4 w-4" />
                    </DkButton>
                  </div>
                </DkGradientBorder>
              </section>
            </main>

            <StickyAIPanel m={m} />
          </div>
        </div>
      </div>
    </div>
  );
}
