"use client";

import Link from "next/link";
import { CheckCircle2, Circle, Flag, Gift, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Card, Progress, SectionHeader } from "@/components/ui/primitives";
import { MISSION_XP_REWARD } from "./constants";

interface MissionTask {
  id: string;
  label: string;
  done: boolean;
}

interface TodaysMissionProps {
  tasks: MissionTask[];
}

export function TodaysMission({ tasks }: TodaysMissionProps) {
  const completed = tasks.filter((t) => t.done).length;
  const pct = Math.round((completed / tasks.length) * 100);
  const allDone = completed === tasks.length;
  const left = tasks.length - completed;
  const qualityBand =
    pct >= 100 ? "World-class" : pct >= 75 ? "Strong momentum" : pct >= 40 ? "In progress" : "Warm-up phase";

  return (
    <Card className="h-full overflow-hidden">
      <SectionHeader
        title="Today's Mission"
        subtitle="Complete all tasks to unlock elite consistency"
      />
      <div className="mb-5 rounded-xl border border-primary/20 bg-primary/5 p-3">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">{qualityBand}</span>
          </div>
          <span className="text-xs text-muted">
            {completed}/{tasks.length} complete
          </span>
        </div>
        <div className="mb-2 flex items-center justify-between">
          <Progress value={pct} className="flex-1 h-3" barClassName="bg-gradient-to-r from-primary via-secondary to-success" />
          <span className="ml-4 text-sm font-bold text-primary">{pct}%</span>
        </div>
        <p className="text-xs text-muted">
          {allDone ? "Mission fully complete. Peak daily consistency achieved." : `${left} task${left > 1 ? "s" : ""} left to complete today.`}
        </p>
      </div>

      <ul className="space-y-3" role="list">
        {tasks.map((task, i) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 rounded-xl border border-transparent bg-surface-muted px-4 py-3 dark:bg-gray-800/50"
          >
            {task.done ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-label="Completed" />
            ) : (
              <Circle className="h-5 w-5 shrink-0 text-surface-border" aria-label="Not completed" />
            )}
            <span className={task.done ? "text-muted line-through" : "font-medium"}>{task.label}</span>
          </motion.li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between rounded-xl border border-secondary/20 bg-secondary/5 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
          <Gift className="h-4 w-4" />
          {allDone ? `+${MISSION_XP_REWARD} XP earned today!` : `Reward: +${MISSION_XP_REWARD} XP`}
        </div>
        {allDone ? (
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-success">
            <Zap className="h-4 w-4" />
            Mission complete
          </span>
        ) : (
          <Link href="/session" className="text-sm font-semibold text-primary hover:underline">
            Continue →
          </Link>
        )}
      </div>
    </Card>
  );
}

export function buildMissionTasks(data: {
  practicedToday?: boolean;
  todaySessionComplete: boolean;
  hasPronunciation: boolean;
  hasVocabulary: boolean;
  correctionsToday?: number;
}): MissionTask[] {
  return [
    { id: "speaking", label: "Speaking Practice", done: !!(data.practicedToday || data.todaySessionComplete) },
    { id: "pronunciation", label: "Pronunciation", done: data.hasPronunciation },
    { id: "vocabulary", label: "Vocabulary", done: data.hasVocabulary },
    { id: "conversation", label: "Conversation", done: data.todaySessionComplete },
    { id: "grammar", label: "Grammar Fix", done: (data.correctionsToday ?? 0) > 0 },
  ];
}

export function JourneyMilestones({ dayNumber }: { dayNumber: number }) {
  const milestones = [7, 30, 60, 90];
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {milestones.map((m) => (
        <span
          key={m}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
            dayNumber >= m
              ? "bg-success/10 text-success"
              : "bg-surface-muted text-muted dark:bg-gray-800"
          }`}
        >
          <Flag className="h-3 w-3" />
          Day {m}
        </span>
      ))}
    </div>
  );
}
