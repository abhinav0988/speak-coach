"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Clock, Play, Sparkles, Timer, Zap } from "lucide-react";
import {
  formatLiveClock,
  getDayPeriod,
  getPracticeNudge,
  getTimeGreeting,
} from "@/lib/greeting";
import { useAuth } from "@/components/AuthProvider";
import { USER_NAME } from "./constants";

const QUICK_START = [
  {
    href: "/session",
    label: "Daily Session",
    sub: "8 min",
    icon: Play,
    className: "from-primary to-blue-600",
  },
  {
    href: "/coach",
    label: "AI Coach",
    sub: "Chat",
    icon: Bot,
    className: "from-violet-500 to-purple-600",
  },
  {
    href: "/challenge",
    label: "60s Burst",
    sub: "Quick",
    icon: Timer,
    className: "from-orange-500 to-rose-500",
  },
] as const;

export function PracticeHubWelcome({
  practicedToday = false,
  streak = 0,
}: {
  practicedToday?: boolean;
  streak?: number;
}) {
  const { user } = useAuth();
  const displayName = user?.name?.split(" ")[0] ?? USER_NAME;
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const period = getDayPeriod(now ?? undefined);
  const greeting = getTimeGreeting(period);
  const nudge = getPracticeNudge(period, practicedToday);

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Practice Hub
            </span>
            {now && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatLiveClock(now)}
              </span>
            )}
            {streak > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-semibold text-warning">
                <Zap className="h-3 w-3" />
                {streak}-day streak
              </span>
            )}
          </div>
          <h2 className="mt-3 text-section text-foreground">
            {greeting}, {displayName}
          </h2>
          <p className="mt-2 max-w-xl text-muted">{nudge}</p>
          <p className="mt-2 text-xs text-muted">
            Press <kbd className="rounded border border-surface-border px-1.5 py-0.5 font-mono dark:border-gray-700">⌘K</kbd> to find any feature instantly
          </p>
        </motion.div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {QUICK_START.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.06 }}
            >
              <Link
                href={item.href}
                className={`group flex items-center gap-4 rounded-card bg-gradient-to-br ${item.className} p-4 text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-elevated`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{item.label}</p>
                  <p className="text-sm text-white/80">{item.sub}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
