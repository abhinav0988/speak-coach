"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Flame,
  Play,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import { SESSION_STEPS } from "@speak-coach/shared";
import { api } from "@/lib/api";
import { useAuthOptional } from "@/components/AuthProvider";
import { ConfettiCelebration } from "@/components/dashboard/MotivationHub";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { ConnectionError } from "@/components/ui/ConnectionError";
import { Skeleton } from "@/components/ui/primitives";
import { getDayPeriod, getTimeGreeting } from "@/lib/greeting";
import { useLearnData } from "@/hooks/useLearnData";
import { USER_NAME } from "@/components/dashboard/constants";
import { LESSON_THEMES, SCORE_DIMENSIONS, type ScoreKey } from "./constants";
import {
  AIOrb,
  LearnAurora,
  LearnButton,
  LearnGlass,
  LearnGradientBorder,
  LearnProgressRing,
  LessonCompleteSheet,
} from "./design-system";
import { PremiumLessonCard } from "./PremiumLessonCard";
import { cn } from "@/lib/utils";

const MISSION_LABELS = ["Warm-up", "Pronunciation", "Grammar", "Vocabulary", "Conversation"];

type Scores = Record<ScoreKey, number>;

const DEFAULT_SCORES: Scores = {
  motivation: 7,
  pronunciation: 7,
  romanHindi: 7,
  spokenEn: 7,
  spokenHi: 7,
  loudness: 7,
  clarity: 7,
};

export function PremiumLearnExperience() {
  const searchParams = useSearchParams();
  const auth = useAuthOptional();
  const firstName = auth?.user?.name?.split(" ")[0] ?? USER_NAME;
  const greeting = getTimeGreeting(getDayPeriod());
  const { data: learnData, loading: ctxLoading, error: ctxError, refresh } = useLearnData();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [dayNumber, setDayNumber] = useState(1);
  const [steps, setSteps] = useState<Array<{ step_number: number; status: string }>>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [scores, setScores] = useState<Scores>(DEFAULT_SCORES);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [homeworkAssigned, setHomeworkAssigned] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [lastCompleted, setLastCompleted] = useState<{ name: string; xp: number } | null>(null);
  const celebratedAllRef = useRef(false);

  useEffect(() => {
    async function init() {
      try {
        const today = await api.getTodaySession();
        if (today.session && (today.session as { id: string }).id) {
          setSessionId((today.session as { id: string }).id);
          setDayNumber((today.session as { day_number: number }).day_number ?? 1);
          setSteps(today.steps as Array<{ step_number: number; status: string }>);
          const firstPending = (today.steps as Array<{ step_number: number; status: string }>).find((s) => s.status !== "done");
          setExpandedStep(firstPending?.step_number ?? 1);
        } else {
          const s = await api.startSession();
          setSessionId(s.id);
          setDayNumber(s.dayNumber);
          setSteps(SESSION_STEPS.map((_, i) => ({ step_number: i + 1, status: "pending" })));
          setExpandedStep(1);
        }
      } finally {
        setSessionLoading(false);
      }
    }
    void init();
  }, []);

  const completed = steps.filter((s) => s.status === "done").length;
  const progressPct = Math.round((completed / SESSION_STEPS.length) * 100);
  const currentStepNum = steps.find((s) => s.status !== "done")?.step_number ?? SESSION_STEPS.length;
  const fromParam = searchParams.get("from");
  const backHref = fromParam?.startsWith("/") ? fromParam : "/";

  const dashboard = learnData?.dashboard;
  const analytics = learnData?.analytics;
  const insights = learnData?.insights ?? [];
  const streak = learnData?.streak;

  const xp = dashboard?.gamification?.xp ?? 0;
  const level = dashboard?.gamification?.level ?? 1;
  const levelName = dashboard?.gamification?.levelName ?? "Beginner";
  const todayMinutes = analytics?.todayMinutes ?? 0;
  const goalMinutes = analytics?.goalMinutes ?? 15;
  const goalRemaining = Math.max(0, goalMinutes - todayMinutes);
  const fluency = dashboard?.fluencyScore ?? 0;
  const estimatedMin = Math.max(5, (SESSION_STEPS.length - completed) * 4);

  const aiTip = insights[0] ?? "Focus on pronunciation today — 8 minutes can boost fluency by 6%.";
  const aiWeakness = insights.find((i) => /focus|improve|work on/i.test(i))?.slice(0, 50) ?? "Word endings";
  const aiStrength = insights.find((i) => /great|strong|good/i.test(i))?.slice(0, 50) ?? "Clear volume";
  const recommendedStep = currentStepNum;

  const missionDone = useMemo(() => {
    const todayScore = dashboard?.recentScores?.[0];
    return [
      completed > 0,
      (todayScore?.pronunciation ?? 0) > 0 || completed >= 2,
      (dashboard?.correctionsToday ?? 0) > 0 || completed >= 7,
      completed >= 9,
      dashboard?.todaySessionComplete ?? completed >= 6,
    ];
  }, [completed, dashboard]);

  const markDone = async (stepNumber: number) => {
    if (!sessionId) return;
    await api.updateStep(sessionId, { stepNumber, status: "done", durationSec: 60 });
    setSteps((prev) => prev.map((s) => (s.step_number === stepNumber ? { ...s, status: "done" } : s)));
    const theme = LESSON_THEMES[stepNumber - 1];
    setLastCompleted({ name: theme.name, xp: theme.xp });
    setSheetOpen(true);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2800);
    if (stepNumber < SESSION_STEPS.length) setExpandedStep(stepNumber + 1);
  };

  useEffect(() => {
    if (progressPct === 100 && !celebratedAllRef.current) {
      celebratedAllRef.current = true;
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 3500);
    }
  }, [progressPct]);

  const saveScores = async () => {
    if (!sessionId) return;
    await api.saveScores(sessionId, scores);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const assignHomework = async () => {
    if (!sessionId) return;
    await api.assignHomework(sessionId, { dayNumber, scores });
    setHomeworkAssigned(true);
  };

  const continueLesson = () => {
    setExpandedStep(currentStepNum);
    window.requestAnimationFrame(() => {
      document
        .getElementById(`lesson-step-${currentStepNum}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const shareLesson = async () => {
    const text = `I just completed ${lastCompleted?.name ?? "a lesson"} on Speak Coach and earned +${lastCompleted?.xp ?? 0} XP.`;
    const url = window.location.origin;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Speak Coach progress", text, url });
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
      }
    } catch {
      // Ignore cancelled native share sheets.
    }
  };

  const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-30px" } };

  if (sessionLoading || ctxLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 rounded-[28px]" />
        <Skeleton className="h-40 rounded-[24px]" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-[24px]" />
        ))}
      </div>
    );
  }

  if (ctxError || !learnData) {
    return <ConnectionError title="Learn module couldn't load" onRetry={refresh} />;
  }

  const dash = learnData.dashboard;

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-narrow space-y-8 md:space-y-10">
      <LearnAurora />
      {celebrate && <ConfettiCelebration show={celebrate} />}
      {lastCompleted && (
        <LessonCompleteSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          onShare={() => void shareLesson()}
          xp={lastCompleted.xp}
          lessonName={lastCompleted.name}
          aiSummary={`Great work on ${lastCompleted.name}. Your speaking confidence is trending up.`}
        />
      )}

      <Link
        href={backHref}
        className="ln-glass relative inline-flex items-center gap-2 rounded-2xl border border-white/60 px-4 py-2 text-sm font-bold text-muted transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      {/* HERO */}
      <motion.section {...fadeUp}>
        <LearnGradientBorder animated>
          <div className="relative p-6 sm:p-8">
            <p className="text-[16px] font-semibold text-muted">{greeting},</p>
            <h1 className="mt-1 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-900 bg-clip-text text-[40px] font-black leading-none tracking-tight text-transparent dark:from-slate-100 dark:via-indigo-200 dark:to-violet-200">
              {firstName} 👋
            </h1>
            <p className="mt-3 text-[16px] text-muted">
              Today&apos;s Learning Goal · Day {dayNumber} · {goalRemaining > 0 ? `${goalRemaining} min to goal` : "Goal crushed!"}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-6">
              <LearnProgressRing value={progressPct} size={108} label="Today" />
              <div className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { icon: Star, label: "XP", value: xp, suffix: "" },
                  { icon: Trophy, label: "Level", value: level, suffix: "" },
                  { icon: Flame, label: "Streak", value: streak?.streak ?? dash.streak, suffix: "d" },
                  { icon: TrendingUp, label: "Speaking", value: fluency, suffix: "%" },
                ].map((s) => (
                  <div key={s.label} className="ln-stat rounded-2xl border border-white/50 bg-white/45 px-3 py-2.5 dark:bg-white/5">
                    <p className="text-[9px] font-bold uppercase text-muted">{s.label}</p>
                    <p className="text-xl font-black text-foreground">
                      <AnimatedNumber value={s.value} suffix={s.suffix} />
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-[13px] text-muted">
              Est. {estimatedMin} min remaining · {levelName} · Speaking score {fluency}%
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <LearnButton onClick={continueLesson}>
                <Play className="h-4 w-4" fill="currentColor" />
                Continue Lesson
              </LearnButton>
              <LearnButton href="/coach" variant="ghost">
                <Bot className="h-4 w-4" />
                AI Coach
              </LearnButton>
            </div>
          </div>
        </LearnGradientBorder>
      </motion.section>

      {/* AI COACH */}
      <motion.section {...fadeUp}>
        <LearnGlass className="p-5" glow="purple">
          <div className="flex gap-4">
            <AIOrb />
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">AI Learning Coach</p>
              <p className="mt-1 text-[16px] font-bold text-foreground">Today&apos;s focus: {aiTip.slice(0, 70)}…</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-xl bg-emerald-50/80 p-2.5 dark:bg-emerald-950/30">
                  <p className="text-[10px] font-bold text-emerald-700">Strongest</p>
                  <p className="text-[13px] font-semibold">{aiStrength}</p>
                </div>
                <div className="rounded-xl bg-rose-50/80 p-2.5 dark:bg-rose-950/30">
                  <p className="text-[10px] font-bold text-rose-700">Needs attention</p>
                  <p className="text-[13px] font-semibold">{aiWeakness}</p>
                </div>
              </div>
              <p className="mt-2 text-[12px] text-muted">
                Recommended: Lesson {recommendedStep} · Est. +6% improvement
              </p>
              <LearnButton href="/coach" className="mt-3" variant="ghost">
                <Sparkles className="h-4 w-4" />
                Practice with AI
              </LearnButton>
            </div>
          </div>
        </LearnGlass>
      </motion.section>

      {/* DAILY MISSIONS + STREAK */}
      <div className="grid gap-6 lg:grid-cols-5">
        <motion.section {...fadeUp} className="lg:col-span-3">
          <LearnGlass className="p-5" glow="blue">
            <h2 className="text-[22px] font-black text-foreground">Daily Missions</h2>
            <p className="text-[13px] text-muted">Complete all for bonus XP</p>
            <ul className="mt-4 space-y-2">
              {MISSION_LABELS.map((label, i) => (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3",
                    missionDone[i] ? "bg-emerald-50/70 dark:bg-emerald-950/30" : "bg-white/40 dark:bg-white/5"
                  )}
                >
                  <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold", missionDone[i] ? "bg-emerald-500 text-white" : "bg-slate-200 text-muted")}>
                    {missionDone[i] ? "✓" : i + 1}
                  </span>
                  <span className={cn("font-semibold", missionDone[i] && "text-muted line-through")}>{label}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-center text-sm font-bold text-violet-600">+120 XP reward when all complete</p>
          </LearnGlass>
        </motion.section>

        <motion.section {...fadeUp} className="lg:col-span-2">
          <LearnGlass className="p-5 text-center" glow="pink">
            <div className="ln-fire text-5xl">🔥</div>
            <p className="mt-2 text-4xl font-black text-orange-600">
              <AnimatedNumber value={streak?.streak ?? dash.streak} />
            </p>
            <p className="text-[13px] font-semibold text-muted">day streak</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-left">
              <div className="rounded-xl bg-white/50 p-2.5 dark:bg-white/5">
                <p className="text-[9px] font-bold uppercase text-muted">Longest</p>
                <p className="font-black">{Math.max(streak?.longestStreak ?? 0, dash.streak)}d</p>
              </div>
              <div className="rounded-xl bg-white/50 p-2.5 dark:bg-white/5">
                <p className="text-[9px] font-bold uppercase text-muted">Freezes</p>
                <p className="font-black">{dash.freezesAvailable ?? 0}</p>
              </div>
            </div>
          </LearnGlass>
        </motion.section>
      </div>

      {/* LEARNING PATH */}
      <motion.section {...fadeUp}>
        <div className="mb-6">
          <h2 className="text-[28px] font-black tracking-tight text-foreground">Today&apos;s Learning Path</h2>
          <p className="text-[13px] text-muted">
            {completed} of {SESSION_STEPS.length} lessons · {progressPct}% complete
          </p>
        </div>
        <div className="relative">
          <div className="ln-path-line absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#6366F1] via-[#7C3AED] to-[#EC4899]/30" />
          {LESSON_THEMES.map((theme, i) => {
            const stepNum = i + 1;
            const step = steps.find((s) => s.step_number === stepNum);
            const done = step?.status === "done";
            const isCurrent = !done && currentStepNum === stepNum;
            const locked = !done && stepNum > currentStepNum;
            return (
              <div key={theme.id} id={`lesson-step-${stepNum}`} className="scroll-mt-24">
                <PremiumLessonCard
                  theme={theme}
                  stepNum={stepNum}
                  done={done}
                  isCurrent={isCurrent}
                  locked={locked}
                  expanded={expandedStep === stepNum}
                  onToggle={() => setExpandedStep(expandedStep === stepNum ? null : stepNum)}
                  onComplete={() => void markDone(stepNum)}
                />
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* PROGRESS */}
      <motion.section {...fadeUp}>
        <LearnGlass className="p-5" glow="cyan">
          <h2 className="text-[22px] font-black">Your Progress</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <LearnProgressRing value={progressPct} size={72} />
              <p className="mt-1 text-[11px] font-bold text-muted">Daily</p>
            </div>
            <div className="rounded-2xl bg-white/50 p-3 text-center dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase text-muted">Weekly XP</p>
              <p className="text-2xl font-black text-violet-600">
                +{analytics?.weeklyStats?.reduce((s, w) => s + w.minutes * 8, 0) ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-white/50 p-3 text-center dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase text-muted">Speaking</p>
              <p className="text-2xl font-black">{todayMinutes}m</p>
            </div>
            <div className="rounded-2xl bg-white/50 p-3 text-center dark:bg-white/5">
              <p className="text-[10px] font-bold uppercase text-muted">Streak</p>
              <p className="text-2xl font-black">{dash.streak}d</p>
            </div>
          </div>
        </LearnGlass>
      </motion.section>

      {/* SESSION SCORES */}
      <motion.section {...fadeUp}>
        <LearnGradientBorder>
          <div className="p-6">
            <h2 className="text-[28px] font-black text-foreground">Session Reflection</h2>
            <p className="text-[13px] text-muted">Tap to rate how you felt today (1–10)</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {SCORE_DIMENSIONS.map((dim) => (
                <div key={dim.key} className="rounded-[20px] border border-white/50 bg-white/40 p-4 dark:bg-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{dim.emoji}</span>
                    <span className={cn("rounded-full bg-gradient-to-r px-3 py-1 text-sm font-black text-white", dim.color)}>
                      {scores[dim.key]}/10
                    </span>
                  </div>
                  <p className="mt-2 font-bold text-foreground">{dim.label}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setScores((s) => ({ ...s, [dim.key]: n }))}
                        className={cn(
                          "h-8 w-8 rounded-full text-xs font-bold transition",
                          scores[dim.key] === n
                            ? "bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-md scale-110"
                            : "bg-white/70 text-muted hover:bg-white dark:bg-white/10"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-2xl bg-violet-50/80 p-3 text-[13px] dark:bg-violet-950/30">
              <span className="font-bold text-violet-600">AI · </span>
              Strong clarity today. Push pronunciation 1 point higher tomorrow for a fluency boost.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <LearnButton onClick={() => void saveScores()}>
                {saved ? "Saved ✓" : "Save Reflection"}
              </LearnButton>
              <LearnButton variant="ghost" onClick={() => void assignHomework()} disabled={homeworkAssigned}>
                {homeworkAssigned ? "Homework Assigned ✓" : "Assign Homework"}
              </LearnButton>
              {progressPct === 100 && (
                <LearnButton href="/" variant="ghost">
                  <Target className="h-4 w-4" />
                  Dashboard
                </LearnButton>
              )}
            </div>
          </div>
        </LearnGradientBorder>
      </motion.section>

      {/* ACHIEVEMENTS STRIP */}
      <motion.section {...fadeUp}>
        <h2 className="mb-4 text-[22px] font-black">Achievements</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {(dash.gamification?.badges ?? []).slice(0, 6).map((b, i) => (
            <div
              key={b.id}
              className={cn(
                "ln-badge-3d rounded-[20px] bg-gradient-to-br p-3 text-center",
                b.earned
                  ? i % 3 === 0
                    ? "from-amber-200 to-yellow-300"
                    : i % 3 === 1
                      ? "from-slate-200 to-gray-300"
                      : "from-cyan-200 to-blue-300"
                  : "from-slate-100 to-slate-200 opacity-50 blur-[0.5px]"
              )}
            >
              <span className="text-2xl">{b.earned ? "🏆" : "🔒"}</span>
              <p className="mt-1 text-[10px] font-bold leading-tight">{b.name}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* FLOATING CONTINUE */}
      {progressPct < 100 && (
        <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md sm:bottom-8">
          <LearnButton className="w-full shadow-[0_20px_50px_rgba(37,99,235,0.4)]" onClick={continueLesson}>
            <Zap className="h-4 w-4" />
            Continue Lesson {currentStepNum}
          </LearnButton>
        </div>
      )}
    </div>
  );
}
