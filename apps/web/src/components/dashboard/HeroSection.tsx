"use client";

import Link from "next/link";
import { Flame, Play, Star, Target, TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { AnimatedProgress } from "@/components/ui/motion";
import { Badge } from "@/components/ui/primitives";
import { TOTAL_DAYS } from "./constants";
import { getDayPeriod, getPracticeNudge, getTimeGreeting } from "@/lib/greeting";

interface HeroProps {
  userName: string;
  levelName: string;
  level: number;
  xp: number;
  streak: number;
  fluencyScore: number;
  todayComplete: boolean;
  dayNumber: number;
}

export function HeroSection({
  userName,
  levelName,
  level,
  xp,
  streak,
  fluencyScore,
  todayComplete,
  dayNumber,
}: HeroProps) {
  const progressPct = Math.round((dayNumber / TOTAL_DAYS) * 100);
  const period = getDayPeriod();
  const greeting = getTimeGreeting(period);
  const subtitle = getPracticeNudge(period, todayComplete);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden rounded-card gradient-hero p-6 text-white shadow-elevated sm:p-8 lg:p-10"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Badge className="mb-4 border-0 bg-white/20 text-white backdrop-blur-sm">
            Level {level} · {levelName}
          </Badge>
          <p className="text-sm font-medium text-white/80">{greeting}</p>
          <h1 id="hero-heading" className="mt-1 text-hero text-white sm:text-[2.75rem]">
            {userName}, your dashboard
          </h1>
          <p className="mt-3 max-w-lg text-base text-white/85">{subtitle}</p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill icon={Flame} label="Streak" value={streak} suffix="d" />
            <StatPill icon={Star} label="XP" value={xp} />
            <StatPill icon={TrendingUp} label="Fluency" value={fluencyScore} suffix="%" />
            <StatPill
              icon={Target}
              label="Today"
              display={todayComplete ? "Done ✓" : "Pending"}
            />
          </div>
        </div>

        <div className="w-full lg:max-w-xs">
          <div className="rounded-card glass p-5 text-white">
            <p className="text-sm font-medium text-white/80">Overall Progress</p>
            <p className="mt-1 text-3xl font-bold">
              Day {dayNumber}
              <span className="text-lg font-normal text-white/70"> / {TOTAL_DAYS}</span>
            </p>
            <div className="mt-4">
              <AnimatedProgress value={progressPct} gradient />
            </div>
            <p className="mt-2 text-right text-sm text-white/70">{progressPct}% journey complete</p>
            <Link
              href="/session"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-btn bg-white py-3 text-sm font-bold text-primary shadow-lg transition hover:bg-white/95 active:scale-[0.98]"
            >
              <Play className="h-4 w-4 fill-primary" aria-hidden />
              Continue Learning
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  suffix,
  display,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: number;
  suffix?: string;
  display?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-xl bg-white/15 px-3 py-3 backdrop-blur-sm"
    >
      <div className="flex items-center gap-1 text-xs text-white/70">
        <Icon className="h-3.5 w-3.5" aria-hidden />
        {label}
      </div>
      <p className="mt-1 text-xl font-bold">
        {display ?? (
          <>
            <AnimatedNumber value={value ?? 0} />
            {suffix}
          </>
        )}
      </p>
    </motion.div>
  );
}

export function ComebackBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-warning/30 bg-warning/10 p-5"
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-warning/20 p-2.5">
          <Zap className="h-5 w-5 text-warning" />
        </div>
        <div>
          <p className="font-semibold">Streak reset — bounce back stronger</p>
          <p className="text-sm text-muted">A 5-minute comeback session restarts your momentum.</p>
        </div>
      </div>
      <Link href="/comeback" className="rounded-btn bg-warning px-5 py-2.5 text-sm font-bold text-white hover:bg-warning/90">
        Start Comeback
      </Link>
    </motion.div>
  );
}
