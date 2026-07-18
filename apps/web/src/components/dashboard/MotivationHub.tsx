"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Flame, Gift, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card, Progress, SectionHeader } from "@/components/ui/primitives";
import { MOTIVATION_QUOTES } from "./constants";

interface MotivationHubProps {
  streak: number;
  xp: number;
  level: number;
  levelName: string;
  dayNumber: number;
  xpToNextLevel?: number;
}

export function MotivationHub({
  streak,
  xp,
  level,
  levelName,
  dayNumber,
  xpToNextLevel = 500,
}: MotivationHubProps) {
  const quote = useMemo(() => MOTIVATION_QUOTES[(dayNumber + streak) % MOTIVATION_QUOTES.length], [dayNumber, streak]);
  const levelProgress = Math.min(100, Math.round((xp % xpToNextLevel) / xpToNextLevel * 100));
  const consistencyScore = Math.min(100, Math.round(streak * 8 + levelProgress * 0.4));
  const performanceTier =
    consistencyScore >= 85 ? "Elite" : consistencyScore >= 65 ? "Advanced" : consistencyScore >= 40 ? "Developing" : "Starter";

  return (
    <section>
      <SectionHeader title="Motivation & Consistency" subtitle="World-class fluency is built through repeatable daily quality" />
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 bg-gradient-to-br from-secondary/5 to-primary/5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-secondary/10 p-2.5">
              <Sparkles className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-secondary">Daily Inspiration</p>
              <p className="mt-2 text-lg font-medium leading-relaxed">&ldquo;{quote}&rdquo;</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-warning">
            <Flame className="h-5 w-5" />
            <span className="font-semibold">Streak</span>
          </div>
          <p className="mt-2 text-3xl font-bold">
            <AnimatedNumber value={streak} suffix=" days" />
          </p>
          <p className="mt-1 text-sm text-muted">
            {streak === 0 ? "Start today!" : streak < 7 ? "Build toward 7 days" : "You're on fire!"}
          </p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              <span className="font-semibold">Level {level}</span>
            </div>
            <span className="text-sm text-muted">{levelName}</span>
          </div>
          <div className="mt-4">
            <Progress value={levelProgress} barClassName="bg-gradient-to-r from-warning to-secondary" />
          </div>
          <p className="mt-2 text-sm text-muted">
            <AnimatedNumber value={xp} /> XP · {xpToNextLevel - (xp % xpToNextLevel)} to next level
          </p>
        </Card>

        <Card>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Consistency score</p>
            <span className="text-xs font-semibold text-primary">{performanceTier}</span>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2">
            <p className="text-3xl font-bold text-foreground">
              <AnimatedNumber value={consistencyScore} suffix="/100" />
            </p>
            <div className="mt-2">
              <Progress value={consistencyScore} barClassName="bg-gradient-to-r from-primary to-success" />
            </div>
            <p className="mt-2 text-xs text-muted">Based on streak strength + level momentum</p>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2.5">
                <Gift className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Upcoming Reward</p>
                <p className="text-sm text-muted">Complete today&apos;s mission for +80 XP</p>
              </div>
            </div>
            <Link href="/session" className="rounded-btn bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700">
              Earn Reward
            </Link>
          </div>
        </Card>
      </div>
    </section>
  );
}

export function ConfettiCelebration({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ["#2563EB", "#7C3AED", "#22C55E", "#F59E0B", "#EF4444"][i % 5],
          }}
          initial={{ top: "-5%", opacity: 1, rotate: 0 }}
          animate={{
            top: "105%",
            opacity: [1, 1, 0],
            rotate: Math.random() * 720,
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{ duration: 2 + Math.random(), delay: Math.random() * 0.5, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
