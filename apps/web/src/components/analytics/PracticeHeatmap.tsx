"use client";

import { useState, type ReactNode } from "react";
import type { PracticeHeatmapDay } from "@speak-coach/shared";
import { Card } from "@/components/ui/primitives";
import { ChartDetailPanel } from "./ChartDetail";
import { cn } from "@/lib/utils";

const LEVEL_COLORS: Record<PracticeHeatmapDay["level"], string> = {
  none: "bg-surface-muted dark:bg-gray-800",
  light: "bg-primary/25 dark:bg-primary/30",
  moderate: "bg-primary/45 dark:bg-primary/50",
  active: "bg-success/55 dark:bg-success/50",
  intense: "bg-success dark:bg-success/80",
};

const LEVEL_LABELS: Record<PracticeHeatmapDay["level"], string> = {
  none: "No practice",
  light: "Light",
  moderate: "Moderate",
  active: "Goal met",
  intense: "Strong day",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function padWeekStart(days: PracticeHeatmapDay[]): (PracticeHeatmapDay | null)[] {
  if (days.length === 0) return [];
  const first = new Date(days[0].date + "T12:00:00");
  const dow = first.getDay();
  const mondayOffset = dow === 0 ? 6 : dow - 1;
  const padded: (PracticeHeatmapDay | null)[] = Array(mondayOffset).fill(null);
  return [...padded, ...days];
}

export function PracticeHeatmap({
  days,
  goalMinutes,
  summary,
  compact = false,
}: {
  days: PracticeHeatmapDay[];
  goalMinutes: number;
  summary?: { activeDays: number; goalMetDays: number; totalMinutes: number };
  compact?: boolean;
}) {
  const [selected, setSelected] = useState<PracticeHeatmapDay | null>(null);
  const padded = padWeekStart(days);
  const rows: (PracticeHeatmapDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    rows.push(padded.slice(i, i + 7));
  }

  const cellClass = compact
    ? "h-3 w-3 rounded-sm"
    : "aspect-square w-full rounded-md";

  return (
    <div className="space-y-4">
      {summary && (
        <div className="flex flex-wrap gap-4 text-sm">
          <span>
            <strong className="text-foreground">{summary.activeDays}</strong>
            <span className="text-muted"> active days</span>
          </span>
          <span>
            <strong className="text-foreground">{summary.goalMetDays}</strong>
            <span className="text-muted"> goal days</span>
          </span>
          <span>
            <strong className="text-foreground">{summary.totalMinutes}</strong>
            <span className="text-muted"> min total</span>
          </span>
          <span className="text-muted">Goal: {goalMinutes} min/day</span>
        </div>
      )}

      <p className="text-xs text-muted">Tap a day to see minutes, recordings & session status</p>

      <div className={compact ? "overflow-x-auto" : ""}>
        {!compact && (
          <div className="mb-1 grid grid-cols-7 gap-1 pl-0">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-center text-[10px] font-medium text-muted">
                {d}
              </span>
            ))}
          </div>
        )}
        <div className={`grid grid-cols-7 gap-1 ${compact ? "min-w-[280px]" : ""}`}>
          {rows.flatMap((row, ri) =>
            row.map((d, ci) =>
              d ? (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setSelected(d)}
                  className={cn(
                    cellClass,
                    LEVEL_COLORS[d.level],
                    "transition-transform hover:scale-110 hover:ring-2 hover:ring-primary/40 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    selected?.date === d.date && "ring-2 ring-primary scale-110"
                  )}
                  aria-label={`${d.date}: ${d.minutes} minutes`}
                  title={`${d.date}: ${d.minutes} min`}
                />
              ) : (
                <div key={`empty-${ri}-${ci}`} className={cellClass} />
              )
            )
          )}
        </div>
      </div>

      {selected && (
        <ChartDetailPanel
          title={formatHeatmapDate(selected.date)}
          rows={[
            { label: "Practice level", value: LEVEL_LABELS[selected.level], highlight: true },
            { label: "Speaking minutes", value: `${selected.minutes} min` },
            { label: "Voice recordings", value: selected.recordings },
            { label: "Daily session", value: selected.sessionDone ? "Complete ✓" : "Not finished" },
            { label: "Goal", value: `${goalMinutes} min/day` },
          ]}
          onClear={() => setSelected(null)}
        />
      )}

      <div className="flex flex-wrap gap-3 text-xs text-muted">
        {Object.entries(LEVEL_COLORS).map(([level, color]) => (
          <span key={level} className="flex items-center gap-1.5">
            <span className={`inline-block h-3 w-3 rounded-sm ${color}`} />
            {LEVEL_LABELS[level as PracticeHeatmapDay["level"]]}
          </span>
        ))}
      </div>
    </div>
  );
}

function formatHeatmapDate(dateStr: string) {
  try {
    return new Date(dateStr + "T12:00:00").toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function PracticeHeatmapCard({
  days,
  goalMinutes,
  summary,
  title = "Practice Calendar",
  subtitle,
}: {
  days: PracticeHeatmapDay[];
  goalMinutes: number;
  summary: { activeDays: number; goalMetDays: number; totalMinutes: number };
  title?: string;
  subtitle?: ReactNode;
}) {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="mt-1 text-xs text-muted">{subtitle}</p>}
      </div>
      <PracticeHeatmap days={days} goalMinutes={goalMinutes} summary={summary} />
    </Card>
  );
}
