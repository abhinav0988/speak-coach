"use client";

import { useState } from "react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { MotionSection } from "@/components/ui/motion";
import { ChartDetailPanel } from "@/components/analytics/ChartDetail";
import { cn } from "@/lib/utils";
import type { AnalyticsData } from "@speak-coach/shared";

interface ProgressAnalyticsProps {
  analytics: AnalyticsData | null;
  voiceTrend: { date: string; loudness: number; clarity: number }[];
  fluencyScore: number;
  totalSessions: number;
}

export function ProgressAnalytics({
  analytics,
  voiceTrend,
  fluencyScore,
  totalSessions,
}: ProgressAnalyticsProps) {
  const [weeklySelected, setWeeklySelected] = useState<number | null>(null);
  const [fluencySelected, setFluencySelected] = useState<number | null>(null);

  const weeklyData =
    analytics?.activityByDay && analytics.activityByDay.length > 0
      ? analytics.activityByDay.slice(-7).map((d) => ({
          day: formatDay(d.date),
          value: d.recordings,
        }))
      : voiceTrend.slice(-7).map((v) => ({
          day: formatDay(v.date),
          value: Math.round((v.loudness + v.clarity) / 2),
        }));

  const stats = [
    { label: "Speaking Time", value: analytics?.totals.speakingMinutes ?? 0, suffix: "m" },
    { label: "Practice Days", value: analytics?.totals.sessions ?? totalSessions, suffix: "" },
    { label: "Clarity", value: analytics?.averages.clarity ?? fluencyScore, suffix: "%" },
    { label: "Loudness", value: analytics?.averages.loudness ?? 0, suffix: "%" },
  ];

  const fluencyTrend =
    analytics?.fluencyTrend && analytics.fluencyTrend.length > 0
      ? analytics.fluencyTrend.slice(-14).map((d) => ({
          day: formatDay(d.date),
          fluency: Math.round((d.pronunciation + d.loudness) / 2),
        }))
      : voiceTrend.slice(-14).map((v) => ({
          day: formatDay(v.date),
          fluency: Math.round((v.loudness + v.clarity) / 2),
        }));

  const maxWeekly = Math.max(...weeklyData.map((d) => d.value), 1);
  const maxFluency = 100;
  const weeklyAvg = Math.round(weeklyData.reduce((sum, d) => sum + d.value, 0) / Math.max(weeklyData.length, 1));
  const bestWeekly = weeklyData.reduce((best, d) => (d.value > best.value ? d : best), weeklyData[0] ?? { day: "—", value: 0 });
  const fluencyAvg = Math.round(fluencyTrend.reduce((sum, d) => sum + d.fluency, 0) / Math.max(fluencyTrend.length, 1));
  const recentFluency = fluencyTrend[fluencyTrend.length - 1]?.fluency ?? 0;
  const firstFluency = fluencyTrend[0]?.fluency ?? recentFluency;
  const fluencyDelta = recentFluency - firstFluency;
  const qualityGrade =
    recentFluency >= 85 ? "A+" : recentFluency >= 75 ? "A" : recentFluency >= 65 ? "B" : recentFluency >= 50 ? "C" : "D";

  return (
    <MotionSection>
      <SectionHeader title="Progress Intelligence" subtitle="Premium tracking across consistency, quality, and momentum" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-muted">Weekly Activity</h3>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-surface-muted px-2 py-1 text-muted">Avg {weeklyAvg}</span>
              <span className="rounded-full bg-surface-muted px-2 py-1 text-muted">
                Peak {bestWeekly.value} ({bestWeekly.day})
              </span>
            </div>
          </div>
          {weeklyData.length > 0 ? (
            <>
              <p className="mb-2 text-xs text-muted">Tap a bar to see activity count</p>
              <div className="flex h-52 items-end gap-2">
                {weeklyData.map((d, i) => (
                  <button
                    key={d.day}
                    type="button"
                    onClick={() => setWeeklySelected(i)}
                    className={cn(
                      "flex flex-1 flex-col items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      weeklySelected === i && "ring-2 ring-primary/40"
                    )}
                  >
                    {weeklySelected === i && (
                      <span className="text-xs font-bold text-primary">{d.value}</span>
                    )}
                    <div
                      className="w-full rounded-t-lg bg-primary transition-all duration-700"
                      style={{ height: `${Math.max(8, (d.value / maxWeekly) * 100)}%`, opacity: weeklySelected === null || weeklySelected === i ? 1 : 0.45 }}
                    />
                    <span className="text-xs text-muted">{d.day}</span>
                  </button>
                ))}
              </div>
              {weeklySelected !== null && (
                <ChartDetailPanel
                  title={weeklyData[weeklySelected]?.day ?? "Day"}
                  rows={[
                    { label: "Activity count", value: weeklyData[weeklySelected]?.value ?? 0, highlight: true },
                    { label: "Metric", value: analytics?.activityByDay?.length ? "Recordings" : "Voice score avg" },
                  ]}
                  onClear={() => setWeeklySelected(null)}
                />
              )}
            </>
          ) : (
            <EmptyChart message="Practice this week to unlock your chart" />
          )}
        </Card>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="!p-4">
              <p className="text-xs text-muted">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              </p>
            </Card>
          ))}
        </div>

        <Card className="lg:col-span-3">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-muted">Fluency Trend</h3>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full bg-surface-muted px-2 py-1 text-muted">Grade {qualityGrade}</span>
              <span className="rounded-full bg-surface-muted px-2 py-1 text-muted">Avg {fluencyAvg}%</span>
              <span className={cn("rounded-full px-2 py-1", fluencyDelta >= 0 ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                {fluencyDelta >= 0 ? "+" : ""}
                {fluencyDelta}% trend
              </span>
            </div>
          </div>
          {fluencyTrend.length > 0 ? (
            <>
              <p className="mb-2 text-xs text-muted">Tap a bar to inspect fluency score progression day-by-day</p>
              <div className="flex h-44 items-end gap-1.5">
                {fluencyTrend.map((d, i) => (
                  <button
                    key={`${d.day}-${i}`}
                    type="button"
                    onClick={() => setFluencySelected(i)}
                    className={cn(
                      "relative flex flex-1 flex-col items-center outline-none focus-visible:ring-2 focus-visible:ring-primary",
                      fluencySelected === i && "ring-2 ring-primary/40 rounded-md"
                    )}
                  >
                    {(fluencySelected === i) && (
                      <span className="mb-1 text-[10px] font-bold text-primary">{d.fluency}%</span>
                    )}
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-primary/80 to-primary transition-all duration-700"
                      style={{ height: `${Math.max(4, (d.fluency / maxFluency) * 100)}%`, opacity: fluencySelected === null || fluencySelected === i ? 1 : 0.45 }}
                    />
                    <span className="mt-1 text-[10px] text-muted sm:block">{d.day}</span>
                  </button>
                ))}
              </div>
              {fluencySelected !== null && (
                <ChartDetailPanel
                  title={fluencyTrend[fluencySelected]?.day ?? "Day"}
                  rows={[
                    { label: "Fluency score", value: `${fluencyTrend[fluencySelected]?.fluency ?? 0}%`, highlight: true },
                    {
                      label: "Delta vs start",
                      value: `${(fluencyTrend[fluencySelected]?.fluency ?? 0) - firstFluency >= 0 ? "+" : ""}${(fluencyTrend[fluencySelected]?.fluency ?? 0) - firstFluency}%`,
                    },
                    { label: "Current quality band", value: qualityGrade },
                  ]}
                  onClear={() => setFluencySelected(null)}
                />
              )}
            </>
          ) : (
            <EmptyChart message="Your fluency trend appears after a few sessions" />
          )}
        </Card>
      </div>
    </MotionSection>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full min-h-[8rem] items-center justify-center rounded-xl bg-surface-muted text-sm text-muted dark:bg-gray-800/50">
      {message}
    </div>
  );
}

function formatDay(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en", { weekday: "short" });
  } catch {
    return dateStr.slice(5) || dateStr;
  }
}
