"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Clock, MapPin, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { JourneyMilestones } from "./TodaysMission";
import type { JourneyData } from "@speak-coach/shared";
import { TOTAL_DAYS } from "./constants";

export function LearningJourney({ journey, dayNumber }: { journey: JourneyData | null; dayNumber: number }) {
  const days = journey?.days?.slice(Math.max(0, dayNumber - 3), dayNumber + 4) ?? generateFallbackDays(dayNumber);

  return (
    <Card>
      <SectionHeader
        title="Learning Journey"
        subtitle={`Day ${dayNumber} of ${TOTAL_DAYS} — your path to fluency`}
        action={
          <Link href="/journey" className="text-sm font-semibold text-primary hover:underline">
            Full map →
          </Link>
        }
      />

      <div className="relative">
        <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-surface-border dark:bg-gray-700" aria-hidden />
        <ol className="space-y-4" role="list">
          {days.map((day, i) => {
            const isCurrent = day.day === dayNumber;
            const isDone = day.status === "completed" || day.status === "partial";

            return (
              <motion.li
                key={day.day}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="relative flex items-start gap-4 pl-0"
              >
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    isCurrent
                      ? "border-primary bg-primary text-white shadow-glow"
                      : isDone
                        ? "border-success bg-success/10 text-success"
                        : "border-surface-border bg-[var(--card)] text-muted"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : isCurrent ? <MapPin className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                </div>
                <div
                  className={`flex-1 rounded-xl px-4 py-3 ${
                    isCurrent ? "bg-primary/5 ring-1 ring-primary/20" : "bg-surface-muted/60 dark:bg-gray-800/40"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">
                      Day {day.day}
                      {day.isMilestone && day.milestoneLabel && (
                        <span className="ml-2 text-xs font-normal text-secondary">· {day.milestoneLabel}</span>
                      )}
                    </p>
                    <span className="text-xs font-medium text-muted capitalize">{day.status}</span>
                  </div>
                  {isCurrent && (
                    <Link href="/session" className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      <Sparkles className="h-3.5 w-3.5" /> Current lesson
                    </Link>
                  )}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <JourneyMilestones dayNumber={dayNumber} />
    </Card>
  );
}

function generateFallbackDays(dayNumber: number) {
  return Array.from({ length: 7 }, (_, i) => {
    const day = dayNumber - 3 + i;
    return {
      day,
      date: "",
      status: (day < dayNumber ? "completed" : day === dayNumber ? "upcoming" : "upcoming") as "completed" | "upcoming",
      isMilestone: day === 30 || day === 60 || day === 90,
      milestoneLabel: day === 30 ? "Month 1" : day === 60 ? "Month 2" : day === 90 ? "Graduate" : null,
      completedSteps: day < dayNumber ? 10 : 0,
    };
  }).filter((d) => d.day >= 1 && d.day <= TOTAL_DAYS);
}

export function ContinueLearningCard({
  dayNumber,
  sessionComplete,
  fluencyScore,
}: {
  dayNumber: number;
  sessionComplete: boolean;
  fluencyScore: number;
}) {
  const difficulty = fluencyScore < 40 ? "Beginner" : fluencyScore < 70 ? "Intermediate" : "Advanced";
  const recommendation =
    fluencyScore < 50
      ? "Focus on pronunciation drills today"
      : sessionComplete
        ? "Try shadowing to refine your rhythm"
        : "Complete your daily session first";

  return (
    <Card hover className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
      <p className="text-sm font-semibold text-primary">Featured · Continue Learning</p>
      <h3 className="mt-2 text-card-title">
        {sessionComplete ? "Bonus Practice" : "Resume Today's Lesson"}
      </h3>
      <p className="mt-2 text-sm text-muted">{recommendation}</p>

      <div className="mt-5 flex flex-wrap gap-4 text-sm">
        <span className="flex items-center gap-1.5 text-muted">
          <Clock className="h-4 w-4" /> ~8 min
        </span>
        <span className="rounded-full bg-surface-muted px-3 py-0.5 font-medium dark:bg-gray-800">
          {difficulty}
        </span>
        <span className="text-muted">Day {dayNumber}</span>
      </div>

      <Link
        href="/session"
        className="mt-6 inline-flex w-full items-center justify-center rounded-btn bg-primary py-3 text-sm font-bold text-white shadow-glow transition hover:bg-primary-700 sm:w-auto sm:px-8"
      >
        {sessionComplete ? "Extra Practice" : "Resume Lesson"}
      </Link>
    </Card>
  );
}
