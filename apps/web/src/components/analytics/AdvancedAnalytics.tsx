"use client";

import { useState } from "react";
import { Calendar, Clock, Mic, Target, TrendingUp, Zap } from "lucide-react";
import type { AnalyticsData } from "@speak-coach/shared";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PieChart } from "./PieChart";
import { GroupedBarChart, LineChart } from "./Charts";

type Period = "week" | "month";

export function AdvancedAnalytics({ data }: { data: AnalyticsData }) {
  const [period, setPeriod] = useState<Period>("week");
  const stats = period === "week" ? data.weeklyStats : data.monthlyStats;

  const labels = stats.map((s) => s.label);
  const scoreLines =
    stats.length >= 2
      ? [
          {
            name: "Pronunciation",
            color: "#2563eb",
            values: stats.map((s) => s.avgPronunciation),
          },
          {
            name: "Clarity",
            color: "#7c3aed",
            values: stats.map((s) => s.avgClarity),
          },
        ]
      : [];

  const summaryCards = [
    {
      icon: Zap,
      label: "Total Sessions",
      value: data.totals.sessions,
      sub: `${stats.reduce((n, s) => n + s.sessions, 0)} in view`,
    },
    {
      icon: Mic,
      label: "Voice Recordings",
      value: data.totals.recordings,
      sub: `${data.totals.speakingMinutes} min total`,
    },
    {
      icon: Target,
      label: "Corrections",
      value: data.totals.corrections,
      sub: `${data.totals.mistakesMastered} mastered`,
    },
    {
      icon: TrendingUp,
      label: "Avg Clarity",
      value: data.averages.clarity,
      suffix: "%",
      sub: `${data.averages.paceWpm} wpm pace`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((c) => {
          const Icon = c.icon;
          return (
            <Card key={c.label} className="!p-4">
              <div className="mb-2 flex items-center gap-2 text-muted">
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">{c.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                <AnimatedNumber value={c.value} suffix={"suffix" in c ? c.suffix : ""} />
              </p>
              <p className="mt-1 text-xs text-muted">{c.sub}</p>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeader
          title="Activity Over Time"
          subtitle={period === "week" ? "Last 8 weeks" : "Last 12 months"}
        />
        <div className="flex rounded-full bg-surface-muted p-1 dark:bg-gray-800">
          {(["week", "month"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                period === p ? "bg-primary text-white shadow-sm" : "text-muted hover:text-foreground"
              }`}
            >
              {p === "week" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            Sessions & Recordings
          </h3>
          <GroupedBarChart
            labels={labels}
            series={[
              {
                name: "Sessions",
                key: "sessions",
                color: "#2563eb",
                values: stats.map((s) => s.sessions),
              },
              {
                name: "Recordings",
                key: "recordings",
                color: "#7c3aed",
                values: stats.map((s) => s.recordings),
              },
              {
                name: "Corrections",
                key: "corrections",
                color: "#db2777",
                values: stats.map((s) => s.corrections),
              },
            ]}
          />
        </Card>

        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Clock className="h-4 w-4 text-primary" />
            Speaking Minutes
          </h3>
          <GroupedBarChart
            labels={labels}
            series={[
              {
                name: "Minutes",
                key: "minutes",
                color: "#16a34a",
                values: stats.map((s) => s.minutes),
              },
            ]}
            height={200}
          />
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Score Trend</h3>
          <LineChart labels={labels} lines={scoreLines} maxY={100} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Practice Mix</h3>
          <p className="mb-4 text-xs text-muted">How you spend practice time across modes</p>
          <PieChart data={data.practiceMix} size={180} />
        </Card>

        <Card>
          <h3 className="mb-4 text-sm font-semibold text-foreground">Correction Types</h3>
          <p className="mb-4 text-xs text-muted">Grammar vs Roman Hindi vs other fixes</p>
          <PieChart
            data={data.correctionsByType.map((c) => ({
              id: c.type,
              label: formatCorrectionType(c.type),
              value: c.count,
            }))}
            size={180}
          />
        </Card>
      </div>
    </div>
  );
}

function formatCorrectionType(type: string): string {
  const map: Record<string, string> = {
    roman_hindi: "Roman Hindi",
    english: "English",
    grammar: "Grammar",
    spelling: "Spelling",
    punctuation: "Punctuation",
  };
  return map[type] ?? type.replace(/_/g, " ");
}
