"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ChartDetailPanel } from "./ChartDetail";

type BarSeries = {
  key: string;
  label: string;
  color: string;
};

function formatDelta(current: number, prev: number | null) {
  if (prev == null) return "—";
  const delta = current - prev;
  if (delta === 0) return "0";
  return `${delta > 0 ? "+" : ""}${delta}`;
}

export function GroupedBarChart({
  labels,
  series,
  height = 220,
  className,
}: {
  labels: string[];
  series: Array<{ name: string; key: string; color: string; values: number[] }>;
  height?: number;
  className?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const activeIndex = hoveredIndex ?? selectedIndex;
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const barGroupWidth = labels.length > 0 ? 100 / labels.length : 100;
  const barWidth = barGroupWidth / (series.length + 1);

  const firstSeries = series[0];
  const total = firstSeries ? firstSeries.values.reduce((sum, v) => sum + v, 0) : 0;
  const avg = firstSeries ? Math.round(total / Math.max(firstSeries.values.length, 1)) : 0;
  const peak = firstSeries ? Math.max(...firstSeries.values, 0) : 0;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((r) => Math.round(max * r));

  if (labels.length === 0) {
    return (
      <div className={cn("flex items-center justify-center text-sm text-muted", className)} style={{ height }}>
        No data for this period
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-3">
          {series.map((s) => (
            <span key={s.key} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
        <div className="flex gap-2 text-[11px]">
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted">Total {total}</span>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted">Avg {avg}</span>
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-muted">Peak {peak}</span>
        </div>
      </div>
      <p className="mb-2 text-xs text-muted">Hover/tap bars to inspect values and change vs previous period</p>

      <div className="relative">
        <div className="pointer-events-none absolute inset-0">
          {ticks.map((tick, i) => {
            const y = ((ticks.length - 1 - i) / (ticks.length - 1)) * 100;
            return (
              <div
                key={tick + "-" + i}
                className="absolute left-0 right-0 border-t border-dashed border-surface-border/70"
                style={{ top: `${y}%` }}
              />
            );
          })}
        </div>

        <div className="flex items-end gap-1" style={{ height }}>
          {labels.map((label, i) => (
            <button
              key={label + i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "group relative flex flex-1 flex-col items-center gap-1 rounded-md transition outline-none focus-visible:ring-2 focus-visible:ring-primary",
                activeIndex === i && "ring-2 ring-primary/50 bg-primary/5"
              )}
              aria-label={`${label} data`}
              aria-pressed={activeIndex === i}
            >
              <div className="flex w-full items-end justify-center gap-0.5" style={{ height: height - 28 }}>
                {series.map((s) => {
                  const v = s.values[i] ?? 0;
                  const prev = i > 0 ? (s.values[i - 1] ?? 0) : null;
                  const showValue = activeIndex === i && v >= 0;
                  return (
                    <div
                      key={s.key}
                      className="relative flex flex-col items-center justify-end"
                      style={{ width: `${barWidth}%`, height: "100%" }}
                    >
                      {showValue && (
                        <span className="mb-0.5 text-[10px] font-bold text-foreground">
                          {v}
                          {prev !== null ? ` (${formatDelta(v, prev)})` : ""}
                        </span>
                      )}
                      <div
                        className="w-full rounded-t transition-all duration-300 group-hover:brightness-110"
                        style={{
                          height: `${Math.max(v > 0 ? 6 : 0, (v / max) * 100)}%`,
                          background: s.color,
                          minHeight: v > 0 ? 4 : 0,
                          opacity: activeIndex === null || activeIndex === i ? 1 : 0.35,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              <span className={cn("max-w-full truncate text-[10px]", activeIndex === i ? "text-primary" : "text-muted")}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <ChartDetailPanel
          title={labels[activeIndex] ?? "Period"}
          rows={series.map((s) => {
            const current = s.values[activeIndex] ?? 0;
            const prev = activeIndex > 0 ? (s.values[activeIndex - 1] ?? 0) : null;
            return {
              label: `${s.name} (${prev == null ? "start" : `vs prev ${formatDelta(current, prev)}`})`,
              value: current,
              highlight: true,
            };
          })}
          onClear={selectedIndex !== null ? () => setSelectedIndex(null) : undefined}
        />
      )}
    </div>
  );
}

export function LineChart({
  labels,
  lines,
  height = 200,
  maxY = 100,
  className,
}: {
  labels: string[];
  lines: Array<{ name: string; color: string; values: number[] }>;
  height?: number;
  maxY?: number;
  className?: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 100;
  const pad = 4;
  const activeIndex = hoveredIndex ?? selectedIndex;
  const avgPrimary = useMemo(() => {
    if (!lines[0]) return 0;
    return Math.round(lines[0].values.reduce((sum, v) => sum + v, 0) / Math.max(lines[0].values.length, 1));
  }, [lines]);

  if (labels.length < 2) {
    return (
      <div className={cn("flex items-center justify-center text-sm text-muted", className)} style={{ height }}>
        Need more sessions for trend line
      </div>
    );
  }

  const toPoints = (values: number[]) =>
    values.map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (width - pad * 2);
      const y = height - pad - (Math.min(v, maxY) / maxY) * (height - pad * 2);
      return { x, y, v };
    });

  const primaryPoints = lines[0] ? toPoints(lines[0].values) : [];
  const areaPath =
    primaryPoints.length > 1
      ? `M ${primaryPoints[0].x} ${height - pad} L ${primaryPoints
          .map((p) => `${p.x} ${p.y}`)
          .join(" L ")} L ${primaryPoints[primaryPoints.length - 1].x} ${height - pad} Z`
      : "";

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-3">
          {lines.map((l) => (
            <span key={l.name} className="flex items-center gap-1.5 text-xs text-muted">
              <span className="h-0.5 w-4 rounded" style={{ background: l.color }} />
              {l.name}
            </span>
          ))}
        </div>
        <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-muted">
          Avg {lines[0]?.name ?? "Score"}: {avgPrimary}%
        </span>
      </div>
      <p className="mb-2 text-xs text-muted">Hover/tap to inspect trend and compare line values</p>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="lineAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((g) => {
            const y = height - pad - (g / maxY) * (height - pad * 2);
            return (
              <line
                key={g}
                x1={pad}
                y1={y}
                x2={width - pad}
                y2={y}
                stroke="var(--border)"
                strokeWidth="0.3"
                strokeDasharray="1,1"
              />
            );
          })}

          <line
            x1={pad}
            y1={height - pad - (Math.min(avgPrimary, maxY) / maxY) * (height - pad * 2)}
            x2={width - pad}
            y2={height - pad - (Math.min(avgPrimary, maxY) / maxY) * (height - pad * 2)}
            stroke="var(--primary)"
            strokeWidth="0.6"
            strokeDasharray="1.5,1.5"
            opacity="0.55"
          />

          {areaPath ? <path d={areaPath} fill="url(#lineAreaFill)" /> : null}

          {lines.map((l) => (
            <polyline
              key={l.name}
              fill="none"
              stroke={l.color}
              strokeWidth="1.7"
              strokeLinejoin="round"
              points={toPoints(l.values)
                .map((p) => `${p.x},${p.y}`)
                .join(" ")}
              opacity={activeIndex === null ? 1 : 0.92}
            />
          ))}

          {activeIndex !== null && primaryPoints[activeIndex] && (
            <line
              x1={primaryPoints[activeIndex].x}
              y1={pad}
              x2={primaryPoints[activeIndex].x}
              y2={height - pad}
              stroke="var(--primary)"
              strokeWidth="0.7"
              strokeDasharray="1.2,1.2"
              opacity="0.6"
            />
          )}

          {lines.map((l) =>
            toPoints(l.values).map((p, i) => (
              <circle
                key={`${l.name}-${i}`}
                cx={p.x}
                cy={p.y}
                r={activeIndex === i ? 2.3 : 1.5}
                fill={activeIndex === i ? l.color : "var(--card)"}
                stroke={l.color}
                strokeWidth="0.8"
                className="cursor-pointer"
                onClick={() => setSelectedIndex(i)}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            ))
          )}
        </svg>

        <div className="mt-1 flex justify-between text-[10px] text-muted">
          {labels.map((label, i) => (
            <button
              key={label + i}
              type="button"
              onClick={() => setSelectedIndex(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn("truncate px-0.5", activeIndex === i ? "font-semibold text-primary" : "text-muted")}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <ChartDetailPanel
          title={labels[activeIndex] ?? "Period"}
          rows={lines.map((l) => {
            const current = l.values[activeIndex] ?? 0;
            const prev = activeIndex > 0 ? (l.values[activeIndex - 1] ?? 0) : null;
            return {
              label: `${l.name} (${prev == null ? "start" : `vs prev ${formatDelta(current, prev)}`})`,
              value: `${current}%`,
              highlight: true,
            };
          })}
          onClear={selectedIndex !== null ? () => setSelectedIndex(null) : undefined}
        />
      )}
    </div>
  );
}

export type { BarSeries };
