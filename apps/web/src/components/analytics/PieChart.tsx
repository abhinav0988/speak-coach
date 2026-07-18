"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ChartDetailPanel } from "./ChartDetail";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#16a34a",
  "#0891b2",
  "#ca8a04",
  "#64748b",
  "#f43f5e",
  "#8b5cf6",
];

export function PieChart({
  data,
  size = 200,
  className,
}: {
  data: Array<{ label: string; value: number; id?: string }>;
  size?: number;
  className?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const total = data.reduce((s, d) => s + d.value, 0);
  const slices = useMemo(() => {
    if (total === 0) return [];
    const sorted = [...data].sort((a, b) => b.value - a.value);
    let angle = -90;
    return sorted.map((d, i) => {
      const pct = d.value / total;
      const sweep = pct * 360;
      const start = angle;
      angle += sweep;
      const id = d.id ?? d.label;
      return {
        ...d,
        id,
        pct,
        path: describeArc(size / 2, size / 2, size / 2 - 8, start, start + sweep),
        color: COLORS[i % COLORS.length],
        rank: i + 1,
      };
    });
  }, [data, total, size]);

  const activeId = hoveredId ?? selectedId;
  const active = slices.find((s) => s.id === activeId) ?? null;
  const top = slices[0];

  if (total === 0) {
    return (
      <div
        className={cn("flex items-center justify-center text-sm text-muted", className)}
        style={{ minHeight: size }}
      >
        No data yet
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted">Hover/tap a slice to inspect count and share</p>
        {top && (
          <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[11px] text-muted">
            Top: <strong className="text-foreground">{top.label}</strong> ({Math.round(top.pct * 100)}%)
          </span>
        )}
      </div>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
          {slices.map((s) => (
            <path
              key={s.id}
              d={s.path}
              fill={s.color}
              stroke="var(--card)"
              strokeWidth="1"
              className={cn(
                "origin-center cursor-pointer transition",
                activeId && activeId !== s.id ? "opacity-40" : "opacity-100 hover:opacity-90"
              )}
              onClick={() => setSelectedId(s.id)}
              onMouseEnter={() => setHoveredId(s.id)}
              onMouseLeave={() => setHoveredId(null)}
              transform={activeId === s.id ? `scale(1.02) translate(${size * -0.01} ${size * -0.01})` : undefined}
            />
          ))}
          <circle cx={size / 2} cy={size / 2} r={size / 4} fill="var(--card)" />
          <text
            x={size / 2}
            y={size / 2 - (active ? 4 : 0)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-foreground font-bold"
            fontSize={active ? "11" : "14"}
          >
            {active ? active.value : total}
          </text>
          {active && (
            <text
              x={size / 2}
              y={size / 2 + 12}
              textAnchor="middle"
              className="fill-muted"
              fontSize="9"
            >
              {Math.round(active.pct * 100)}%
            </text>
          )}
        </svg>
        <ul className="flex-1 space-y-2 text-sm">
          {slices.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setSelectedId(s.id === selectedId ? null : s.id)}
                onMouseEnter={() => setHoveredId(s.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition",
                  activeId === s.id ? "bg-primary/10 ring-1 ring-primary/30" : "hover:bg-surface-muted"
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.color }} />
                  <span className="text-foreground">
                    {s.label}
                    {s.rank <= 3 ? (
                      <span className="ml-1 text-[10px] text-muted">#{s.rank}</span>
                    ) : null}
                  </span>
                </span>
                <span className="font-medium text-muted">
                  {s.value} <span className="text-xs">({Math.round(s.pct * 100)}%)</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      {active && (
        <ChartDetailPanel
          title={active.label}
          rows={[
            { label: "Count", value: active.value, highlight: true },
            { label: "Share of total", value: `${Math.round(active.pct * 100)}%` },
            { label: "Rank", value: `#${active.rank}` },
            { label: "Total (all types)", value: total },
          ]}
          onClear={selectedId !== null ? () => setSelectedId(null) : undefined}
        />
      )}
    </div>
  );
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number) {
  const startPt = polar(cx, cy, r, end);
  const endPt = polar(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  if (end - start >= 359.9) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  }
  return `M ${cx} ${cy} L ${endPt.x} ${endPt.y} A ${r} ${r} 0 ${large} 1 ${startPt.x} ${startPt.y} Z`;
}
