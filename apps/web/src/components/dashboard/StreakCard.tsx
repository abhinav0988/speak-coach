"use client";

import { useState } from "react";
import { Flame, Snowflake } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Button, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function StreakCard({
  streak,
  practicedToday,
  freezesAvailable,
  totalPracticeDays,
  onUseFreeze,
  className,
}: {
  streak: number;
  practicedToday: boolean;
  freezesAvailable: number;
  totalPracticeDays?: number;
  onUseFreeze?: () => Promise<{ message: string } | void>;
  className?: string;
}) {
  const [freezeMsg, setFreezeMsg] = useState("");
  const [freezing, setFreezing] = useState(false);

  const handleFreeze = async () => {
    if (!onUseFreeze) return;
    setFreezing(true);
    setFreezeMsg("");
    try {
      const res = await onUseFreeze();
      if (res?.message) setFreezeMsg(res.message);
    } finally {
      setFreezing(false);
    }
  };

  const showFreeze = freezesAvailable > 0 && !practicedToday && onUseFreeze;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-2xl",
              streak > 0 ? "bg-orange-500/15" : "bg-surface-muted dark:bg-gray-800"
            )}
          >
            <Flame className={cn("h-7 w-7", streak > 0 ? "text-orange-500" : "text-muted")} />
          </div>
          <div>
            <p className="text-sm text-muted">Current streak</p>
            <p className="text-3xl font-bold text-foreground">
              <AnimatedNumber value={streak} suffix=" days" />
            </p>
            <p className="mt-1 text-xs text-muted">
              {practicedToday
                ? "✓ Practiced today — streak safe"
                : streak > 0
                  ? "Practice today to keep your streak"
                  : "Start practicing to build a streak"}
            </p>
          </div>
        </div>

        {totalPracticeDays != null && (
          <div className="text-right">
            <p className="text-xs text-muted">Total practice days</p>
            <p className="text-xl font-bold text-foreground">{totalPracticeDays}</p>
          </div>
        )}
      </div>

      {showFreeze && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50/80 p-4 dark:border-sky-900 dark:bg-sky-950/30">
          <div className="flex items-center gap-3">
            <Snowflake className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            <div>
              <p className="text-sm font-semibold text-foreground">Streak freeze available</p>
              <p className="text-xs text-muted">Protect your streak if you can&apos;t practice today — 1 per week</p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleFreeze} disabled={freezing}>
            {freezing ? "Applying…" : "Use freeze"}
          </Button>
        </div>
      )}

      {freezeMsg && <p className="mt-3 text-sm text-primary">{freezeMsg}</p>}
    </Card>
  );
}
