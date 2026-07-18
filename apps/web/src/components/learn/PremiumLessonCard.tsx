"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Lock,
  Play,
  Star,
  Volume2,
} from "lucide-react";
import { SESSION_STEP_GUIDES } from "@speak-coach/shared/content";
import type { LessonTheme } from "./constants";
import { PremiumVoicePanel } from "./PremiumVoicePanel";
import {
  LearnBadge,
  LearnButton,
  LearnGlass,
  LearnProgressRing,
  XPBadge,
} from "./design-system";
import { cn } from "@/lib/utils";

export function PremiumLessonCard({
  theme,
  stepNum,
  done,
  isCurrent,
  locked,
  expanded,
  onToggle,
  onComplete,
}: {
  theme: LessonTheme;
  stepNum: number;
  done: boolean;
  isCurrent: boolean;
  locked: boolean;
  expanded: boolean;
  onToggle: () => void;
  onComplete: () => void;
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const guide = SESSION_STEP_GUIDES[stepNum - 1];
  const Icon = theme.icon;
  const completion = done ? 100 : isCurrent ? 35 : 0;

  return (
    <div className="relative flex gap-4">
      {/* Timeline node */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "ln-journey-node z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-black shadow-lg transition",
            done && "bg-gradient-to-br from-emerald-400 to-teal-500 text-white",
            isCurrent && !done && "ln-journey-current bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white",
            locked && "bg-slate-200/80 text-muted blur-[0.5px] dark:bg-slate-800",
            !done && !isCurrent && !locked && "bg-white/70 text-muted dark:bg-slate-800"
          )}
        >
          {done ? <CheckCircle2 className="h-6 w-6" /> : locked ? <Lock className="h-4 w-4" /> : stepNum}
        </div>
        {!locked && <div className="ln-journey-connector mt-1 w-0.5 flex-1 min-h-[24px] bg-gradient-to-b from-indigo-300/50 to-transparent" />}
      </div>

      {/* Card */}
      <div className="mb-6 flex-1">
        <motion.div
          layout
          className={cn(
            "ln-lesson-border rounded-[26px] p-[1.5px]",
            isCurrent && !done && "ln-lesson-border-active",
            locked && "opacity-55"
          )}
        >
          <LearnGlass
            className={cn(
              "bg-gradient-to-br p-0",
              theme.cardGradient,
              done && "ln-lesson-done"
            )}
            glow={isCurrent && !done ? "blue" : undefined}
          >
            <button
              type="button"
              disabled={locked}
              onClick={onToggle}
              className="flex w-full items-start gap-4 p-5 text-left"
            >
              <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br text-white shadow-lg ln-icon-float", theme.iconGradient)}>
                <Icon className="h-8 w-8" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {theme.badge === "recommended" && <LearnBadge label="Recommended" tone="primary" />}
                  {theme.badge === "ai" && <LearnBadge label="AI Suggested" tone="ai" />}
                  {theme.badge === "new" && <LearnBadge label="New" tone="new" />}
                  <span className="text-[11px] font-bold text-muted">{theme.difficulty} · {theme.minutes} min</span>
                </div>
                <h3 className="mt-1 text-[22px] font-extrabold leading-tight text-foreground">{theme.name}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <XPBadge xp={theme.xp} />
                  {!done && isCurrent && (
                    <span className="text-xs font-bold text-primary">Continue here →</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LearnProgressRing value={completion} size={52} />
                <ChevronDown className={cn("h-5 w-5 text-muted transition", expanded && "rotate-180")} />
              </div>
            </button>

            <AnimatePresence>
              {expanded && !locked && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-white/40"
                >
                  <div className="space-y-5 p-5 pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Objectives</p>
                      <ul className="mt-2 space-y-1.5">
                        {theme.objectives.map((obj) => (
                          <li key={obj} className="flex items-start gap-2 text-[14px] text-foreground">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            {obj}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Practice Checklist</p>
                      <ul className="mt-2 space-y-2">
                        {guide.instructions.map((inst, j) => (
                          <li key={j} className="flex items-start gap-2 rounded-xl bg-white/50 px-3 py-2 text-[13px] dark:bg-white/5">
                            <span className="font-bold text-primary">{j + 1}.</span>
                            {inst}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {theme.voicePractice && <PremiumVoicePanel />}

                    <div className="rounded-2xl bg-gradient-to-r from-violet-50/90 to-purple-50/90 p-4 dark:from-violet-950/40 dark:to-purple-950/40">
                      <p className="text-[10px] font-bold uppercase text-violet-600">AI Coach Advice</p>
                      <p className="mt-1 text-[14px] font-medium text-foreground">{theme.aiTip}</p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Watch For</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {theme.expectedMistakes.map((m) => (
                          <span key={m} className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!done ? (
                        <LearnButton onClick={onComplete} className="flex-1 sm:flex-none">
                          <Play className="h-4 w-4" fill="currentColor" />
                          Complete Lesson
                        </LearnButton>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-2xl bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" /> Completed
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setBookmarked((b) => !b)}
                        className="rounded-2xl border border-white/60 bg-white/60 p-2.5 dark:bg-white/5"
                        aria-label="Bookmark"
                      >
                        <Bookmark className={cn("h-4 w-4", bookmarked && "fill-primary text-primary")} />
                      </button>
                      <button type="button" className="rounded-2xl border border-white/60 bg-white/60 p-2.5 dark:bg-white/5" aria-label="Favorite">
                        <Star className="h-4 w-4" />
                      </button>
                      <Link href="/coach" className="rounded-2xl border border-white/60 bg-white/60 p-2.5 dark:bg-white/5">
                        <Volume2 className="h-4 w-4 text-primary" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LearnGlass>
        </motion.div>
      </div>
    </div>
  );
}
