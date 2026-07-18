"use client";

import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";
import { MotionGrid, MotionItem } from "@/components/ui/motion";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { ACHIEVEMENT_DEFS } from "./constants";

interface AchievementGalleryProps {
  badges: { id: string; name: string; earned: boolean }[];
  stats: { streak: number; xp: number; day: number; fluency: number; sessions: number };
}

export function AchievementGallery({ badges, stats }: AchievementGalleryProps) {
  const items = ACHIEVEMENT_DEFS.map((def) => {
    const apiBadge = badges.find((b) => b.id === def.id);
    const earned = apiBadge?.earned ?? def.threshold(stats);
    const upcoming = !earned && def.id === "live_practice";
    return { ...def, earned, upcoming, name: apiBadge?.name ?? def.name };
  });

  const unlocked = items.filter((i) => i.earned);
  const locked = items.filter((i) => !i.earned && !i.upcoming);
  const upcoming = items.filter((i) => i.upcoming);

  return (
    <section>
      <SectionHeader title="Achievements" subtitle="Unlock rewards as you grow" />
      <MotionGrid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {unlocked.map((item) => (
          <AchievementCard key={item.id} {...item} state="unlocked" />
        ))}
        {upcoming.map((item) => (
          <AchievementCard key={item.id} {...item} state="upcoming" />
        ))}
        {locked.map((item) => (
          <AchievementCard key={item.id} {...item} state="locked" />
        ))}
      </MotionGrid>
    </section>
  );
}

function AchievementCard({
  icon,
  name,
  xp,
  state,
}: {
  icon: string;
  name: string;
  xp: number;
  state: "unlocked" | "locked" | "upcoming";
}) {
  const isLocked = state === "locked";
  const isUpcoming = state === "upcoming";

  return (
    <MotionItem>
      <Card
        className={`relative overflow-hidden text-center !p-5 ${
          isLocked ? "opacity-50 grayscale" : ""
        } ${state === "unlocked" ? "ring-1 ring-warning/30" : ""}`}
      >
        {state === "unlocked" && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-warning/10 to-transparent"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        )}
        <div className="relative mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-muted text-3xl dark:bg-gray-800">
          {isLocked ? <Lock className="h-6 w-6 text-muted" /> : icon}
        </div>
        <h3 className="relative font-semibold">{name}</h3>
        <p className="relative mt-1 text-xs text-muted">+{xp} XP</p>
        <span
          className={`relative mt-3 inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
            state === "unlocked"
              ? "bg-success/10 text-success"
              : isUpcoming
                ? "bg-secondary/10 text-secondary"
                : "bg-surface-muted text-muted"
          }`}
        >
          {state === "unlocked" ? "Unlocked" : isUpcoming ? "Upcoming" : "Locked"}
        </span>
        {isUpcoming && (
          <p className="relative mt-2 flex items-center justify-center gap-1 text-xs text-secondary">
            <Sparkles className="h-3 w-3" /> Try Live Speaking
          </p>
        )}
      </Card>
    </MotionItem>
  );
}
