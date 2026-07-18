"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, Download, FolderOpen, Mic, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import type { VoiceTimelineData } from "@speak-coach/shared";
import { downloadVoiceAudio, VOICE_CATEGORY_META } from "@/lib/voiceLibrary";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Progress, Skeleton } from "@/components/ui/primitives";
import { ChartDetailPanel } from "@/components/analytics/ChartDetail";
import { cn } from "@/lib/utils";

function MetricBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-muted">
        <span>{label}</span>
        <span className="font-medium text-foreground">{value}</span>
      </div>
      <Progress value={(value / max) * 100} />
    </div>
  );
}

function DeltaBadge({ value, suffix = "" }: { value: number; suffix?: string }) {
  if (value === 0) return <span className="text-muted">—</span>;
  const positive = value > 0;
  return (
    <span className={`inline-flex items-center gap-1 ${positive ? "text-success" : "text-danger"}`}>
      {positive ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
      {positive ? "+" : ""}
      {value}
      {suffix}
    </span>
  );
}

function Waveform({ samples }: { samples?: number[] }) {
  if (!samples || samples.length === 0) {
    return <p className="text-xs text-muted">No waveform data</p>;
  }

  return (
    <div className="flex h-14 items-end gap-[2px] rounded-lg bg-surface-muted p-2 dark:bg-gray-800">
      {samples.slice(0, 60).map((s, i) => (
        <div
          key={`${i}-${s}`}
          className="w-[3px] rounded-full bg-primary/60"
          style={{ height: `${Math.max(6, Math.min(100, s))}%` }}
        />
      ))}
    </div>
  );
}

function TimelineChart({ trend }: { trend: VoiceTimelineData["trendByDay"] }) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!trend.length) return null;
  const maxCount = Math.max(...trend.map((d) => d.count), 1);

  return (
    <Card>
      <h2 className="mb-4 font-semibold text-foreground">Activity & clarity (30 days)</h2>
      <p className="mb-2 text-xs text-muted">Tap a bar to see recording count & clarity</p>
      <div className="flex h-40 items-end gap-1">
        {trend.map((d, i) => {
          const h = Math.max(4, (d.count / maxCount) * 100);
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-primary",
                selected === i && "ring-2 ring-primary/40 rounded-md"
              )}
            >
              {selected === i && d.count > 0 && (
                <span className="text-[10px] font-bold text-primary">{d.count}</span>
              )}
              <div
                className="w-full rounded-t bg-primary/70 transition-all"
                style={{ height: `${h}%`, opacity: selected === null || selected === i ? 1 : 0.45 }}
              />
              <span className="text-[9px] text-muted">{d.date.slice(8)}</span>
            </button>
          );
        })}
      </div>
      {selected !== null && trend[selected] && (
        <ChartDetailPanel
          title={trend[selected].date}
          rows={[
            { label: "Recordings", value: trend[selected].count, highlight: true },
            { label: "Avg clarity", value: `${trend[selected].avgClarity}%` },
            { label: "Avg loudness", value: `${trend[selected].avgLoudness}%` },
          ]}
          onClear={() => setSelected(null)}
        />
      )}
      <p className="mt-2 text-xs text-muted">Bar height = recordings per day</p>
    </Card>
  );
}

export default function VoiceTimelinePage() {
  const [data, setData] = useState<VoiceTimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    api
      .getVoiceTimeline()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBack href="/" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!data || data.total === 0) {
    return (
      <div className="space-y-6">
        <PageBack href="/" />
        <PageHeader
          title="Voice Timeline"
          subtitle="No recordings yet. Practice in Live Speaking, Shadowing, or Read Aloud."
          badge="Voice"
        />
        <Link href="/live-speak">
          <Button>Start Speaking</Button>
        </Link>
      </div>
    );
  }

  const filtered =
    filter === "all"
      ? data.recordings
      : data.recordings.filter((r) => (r.category ?? "general") === filter);

  const categories = Object.keys(data.byCategory ?? {});

  return (
    <div className="space-y-8">
      <PageBack href="/" />
      <PageHeader
        title="Voice Timeline"
        subtitle={`All voice activity — ${data.total} recordings across practice modes`}
        badge="Unified"
        action={
          <Link href="/voice-library">
            <Button variant="secondary">
              <FolderOpen className="h-4 w-4" />
              Voice Library
            </Button>
          </Link>
        }
      />

      {data.byCategory && Object.keys(data.byCategory).length > 0 && (
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label={`All (${data.total})`} />
          {categories.map((cat) => (
            <FilterChip
              key={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
              label={`${VOICE_CATEGORY_META[cat as keyof typeof VOICE_CATEGORY_META]?.label ?? cat} (${data.byCategory[cat]})`}
            />
          ))}
        </div>
      )}

      {data.trendByDay && data.trendByDay.length > 0 && <TimelineChart trend={data.trendByDay} />}

      {data.first && data.latest && data.first.id !== data.latest.id && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-4">
            <h2 className="font-semibold text-muted">First recording</h2>
            <p className="text-xs text-muted">{data.first.createdAt.slice(0, 10)}</p>
            {data.first.category && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {VOICE_CATEGORY_META[data.first.category]?.label ?? data.first.category}
              </span>
            )}
            <MetricBar label="Loudness" value={data.first.loudnessScore} />
            <MetricBar label="Clarity" value={data.first.clarityScore} />
            <MetricBar label="Pace (WPM)" value={data.first.paceWpm} max={200} />
            <Waveform samples={data.first.waveformSamples} />
            <p className="line-clamp-3 text-sm text-muted">{data.first.transcript || data.first.label || "No transcript"}</p>
          </Card>

          <Card className="space-y-4 border-primary/30">
            <h2 className="font-semibold text-primary">Latest recording</h2>
            <p className="text-xs text-muted">{data.latest.createdAt.slice(0, 10)}</p>
            {data.latest.category && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {VOICE_CATEGORY_META[data.latest.category]?.label ?? data.latest.category}
              </span>
            )}
            <MetricBar label="Loudness" value={data.latest.loudnessScore} />
            <MetricBar label="Clarity" value={data.latest.clarityScore} />
            <MetricBar label="Pace (WPM)" value={data.latest.paceWpm} max={200} />
            <Waveform samples={data.latest.waveformSamples} />
            <p className="line-clamp-3 text-sm text-muted">{data.latest.transcript || data.latest.label || "No transcript"}</p>
          </Card>
        </div>
      )}

      {data.delta && (
        <Card>
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progress since first recording
          </h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <p className="text-sm text-muted">Loudness</p>
              <p className="text-xl font-bold"><DeltaBadge value={data.delta.loudness} /></p>
            </div>
            <div>
              <p className="text-sm text-muted">Clarity</p>
              <p className="text-xl font-bold"><DeltaBadge value={data.delta.clarity} /></p>
            </div>
            <div>
              <p className="text-sm text-muted">Pace</p>
              <p className="text-xl font-bold"><DeltaBadge value={data.delta.pace} suffix=" wpm" /></p>
            </div>
            <div>
              <p className="text-sm text-muted">Fillers</p>
              <p className="text-xl font-bold"><DeltaBadge value={-data.delta.fillers} /></p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
          <Mic className="h-5 w-5 text-primary" />
          Recent recordings
        </h2>
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={`${r.source ?? "voice"}-${r.id}`}
              className="flex flex-wrap items-center gap-4 border-b border-surface-border pb-3 last:border-0 dark:border-gray-800"
            >
              <span className="w-24 shrink-0 text-sm text-muted">{r.createdAt.slice(0, 10)}</span>
              <div className="flex min-w-0 flex-1 flex-wrap gap-3 text-sm text-muted">
                {r.category && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {VOICE_CATEGORY_META[r.category]?.label ?? r.category}
                  </span>
                )}
                <span>Loud {r.loudnessScore}</span>
                <span>Clear {r.clarityScore}</span>
                {r.paceWpm > 0 && <span>{r.paceWpm} wpm</span>}
              </div>
              {r.source && r.source !== "voice" ? (
                <span className="text-xs text-muted">{r.source}</span>
              ) : (
                <Button
                  variant="ghost"
                  className="shrink-0"
                  onClick={() =>
                    downloadVoiceAudio(r.id, r.source ?? "voice", r.category ?? "general", r.createdAt).catch(() =>
                      alert("Download failed")
                    )
                  }
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-primary text-white" : "bg-surface-muted text-muted hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
