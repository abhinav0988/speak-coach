"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Flame } from "lucide-react";
import { api } from "@/lib/api";
import type { HeatmapDay, PracticeHeatmapData } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Card, Skeleton } from "@/components/ui/primitives";
import { PracticeHeatmap } from "@/components/analytics/PracticeHeatmap";
import { ChartDetailPanel } from "@/components/analytics/ChartDetail";
import { cn } from "@/lib/utils";

type Tab = "practice" | "mistakes";

const MISTAKE_COLORS = {
  none: "bg-surface-muted dark:bg-gray-800",
  low: "bg-warning/40",
  medium: "bg-orange-400/60",
  high: "bg-danger/70",
  clean: "bg-success/60",
};

const MISTAKE_LABELS: Record<keyof typeof MISTAKE_COLORS, string> = {
  none: "No data",
  low: "Few mistakes",
  medium: "Some mistakes",
  high: "Many mistakes",
  clean: "Clean day",
};

export default function HeatmapPage() {
  const [tab, setTab] = useState<Tab>("practice");
  const [practice, setPractice] = useState<PracticeHeatmapData | null>(null);
  const [mistakes, setMistakes] = useState<HeatmapDay[]>([]);
  const [selectedMistake, setSelectedMistake] = useState<HeatmapDay | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getPracticeHeatmap(), api.getHeatmap()])
      .then(([p, m]) => {
        setPractice(p);
        setMistakes(m.heatmap);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageBack href="/analytics" label="Analytics" />
      <PageHeader
        title="Activity Calendars"
        subtitle="Track practice consistency and mistake patterns"
        badge="Progress"
      />

      <div className="flex rounded-full bg-surface-muted p-1 dark:bg-gray-800 w-fit">
        {(
          [
            { id: "practice" as const, label: "Practice", icon: CalendarDays },
            { id: "mistakes" as const, label: "Mistakes", icon: Flame },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === id ? "bg-primary text-white shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <Skeleton className="h-64" />
      ) : tab === "practice" && practice ? (
        <Card>
          <PracticeHeatmap
            days={practice.heatmap}
            goalMinutes={practice.goalMinutes}
            summary={practice.summary}
          />
          <p className="mt-4 text-xs text-muted">
            Last {practice.summary.weeks} weeks — darker green = more practice or goal met.
            {" "}
            <Link href="/reports" className="text-primary hover:underline">
              View weekly report →
            </Link>
          </p>
        </Card>
      ) : (
        <Card>
          <p className="mb-3 text-xs text-muted">Tap a day to see mistake count & session status</p>
          <div className="grid grid-cols-7 gap-1">
            {mistakes.map((d) => (
              <button
                key={d.date}
                type="button"
                onClick={() => setSelectedMistake(d)}
                className={cn(
                  `aspect-square rounded-md ${MISTAKE_COLORS[d.level]} flex items-center justify-center transition-transform hover:scale-110 outline-none focus-visible:ring-2 focus-visible:ring-primary`,
                  selectedMistake?.date === d.date && "ring-2 ring-primary scale-110"
                )}
              >
                <span className="text-[10px] font-medium text-foreground">{d.date.slice(8)}</span>
              </button>
            ))}
          </div>
          {selectedMistake && (
            <ChartDetailPanel
              title={selectedMistake.date}
              rows={[
                { label: "Issues (mistakes + corrections)", value: selectedMistake.mistakeCount, highlight: true },
                { label: "Writing accuracy", value: selectedMistake.accuracy != null ? `${Math.round(selectedMistake.accuracy)}%` : "—" },
                { label: "Session", value: selectedMistake.sessionDone ? "Complete" : "Pending" },
                { label: "Level", value: MISTAKE_LABELS[selectedMistake.level] },
              ]}
              onClear={() => setSelectedMistake(null)}
            />
          )}
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
            {Object.entries(MISTAKE_COLORS).map(([level, color]) => (
              <span key={level} className="flex items-center gap-1.5">
                <span className={`inline-block h-3 w-3 rounded ${color}`} />
                {MISTAKE_LABELS[level as keyof typeof MISTAKE_COLORS]}
              </span>
            ))}
          </div>
        </Card>
      )}

      {!loading && tab === "mistakes" && mistakes.filter((d) => d.level === "high").length > 0 && (
        <div className="space-y-2">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <Flame className="h-5 w-5 text-danger" />
            High-mistake days
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {mistakes
              .filter((d) => d.level === "high")
              .slice(-5)
              .map((d) => (
                <Card key={d.date} className="text-sm">
                  <span className="font-medium text-danger">{d.date}</span>
                  <span className="ml-2 text-muted">
                    {d.mistakeCount} mistakes — review this day&apos;s errors
                  </span>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
