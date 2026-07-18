"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Pause, Play, TrendingDown, TrendingUp } from "lucide-react";
import type { VoiceLibraryItem } from "@speak-coach/shared";
import { api } from "@/lib/api";
import { VOICE_CATEGORY_META } from "@/lib/voiceLibrary";
import { Button, Card } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function ScoreDelta({ before, after, label }: { before: number | null; after: number | null; label: string }) {
  if (before == null || after == null) return null;
  const delta = Math.round(after - before);
  const improved = delta > 0;
  const same = delta === 0;
  return (
    <div className="rounded-xl bg-surface-muted px-3 py-2 dark:bg-gray-800/50">
      <p className="text-xs text-muted">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm text-muted">{Math.round(before)}</span>
        <ArrowRight className="h-3 w-3 text-muted" />
        <span className="font-semibold text-foreground">{Math.round(after)}</span>
        {!same && (
          <span className={cn("flex items-center text-xs font-semibold", improved ? "text-success" : "text-danger")}>
            {improved ? <TrendingUp className="mr-0.5 h-3 w-3" /> : <TrendingDown className="mr-0.5 h-3 w-3" />}
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </div>
    </div>
  );
}

function CompareSlot({
  side,
  recording,
  recordings,
  onSelect,
  playing,
  onPlayToggle,
}: {
  side: "before" | "after";
  recording: VoiceLibraryItem | null;
  recordings: VoiceLibraryItem[];
  onSelect: (id: string) => void;
  playing: boolean;
  onPlayToggle: () => void;
}) {
  const meta = recording ? VOICE_CATEGORY_META[recording.category] : null;

  return (
    <Card className={cn("flex-1", side === "before" ? "border-orange-200/60 dark:border-orange-900/40" : "border-success/30")}>
      <p className={cn("mb-3 text-xs font-bold uppercase tracking-wide", side === "before" ? "text-orange-600" : "text-success")}>
        {side === "before" ? "Earlier recording" : "Latest recording"}
      </p>

      <select
        className="input mb-3 w-full text-sm"
        value={recording ? `${recording.source}:${recording.id}` : ""}
        onChange={(e) => {
          const [source, id] = e.target.value.split(":");
          const found = recordings.find((r) => r.source === source && r.id === id);
          if (found) onSelect(`${found.source}:${found.id}`);
        }}
      >
        {recordings.map((r) => (
          <option key={`${r.source}-${r.id}`} value={`${r.source}:${r.id}`}>
            {formatDate(r.createdAt)} — {VOICE_CATEGORY_META[r.category].label}
          </option>
        ))}
      </select>

      {recording ? (
        <>
          <div className="mb-2 flex flex-wrap gap-2">
            {meta && (
              <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", meta.color)}>
                {meta.label}
              </span>
            )}
            <span className="text-xs text-muted">{formatDate(recording.createdAt)}</span>
          </div>
          <p className="mb-3 line-clamp-2 text-sm text-foreground">
            {recording.label || recording.transcript || "Voice recording"}
          </p>
          {recording.canDownload ? (
            <Button variant={side === "after" ? "primary" : "secondary"} onClick={onPlayToggle} className="w-full">
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Pause" : "Play"}
            </Button>
          ) : (
            <p className="text-xs text-muted">No audio file available</p>
          )}
        </>
      ) : (
        <p className="text-sm text-muted">Select a recording</p>
      )}
    </Card>
  );
}

export function VoiceCompare({ recordings }: { recordings: VoiceLibraryItem[] }) {
  const downloadable = useMemo(
    () => recordings.filter((r) => r.canDownload).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [recordings]
  );

  const [beforeKey, setBeforeKey] = useState("");
  const [afterKey, setAfterKey] = useState("");
  const [playingSide, setPlayingSide] = useState<"before" | "after" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (downloadable.length < 2) return;
    setBeforeKey(`${downloadable[0].source}:${downloadable[0].id}`);
    setAfterKey(`${downloadable[downloadable.length - 1].source}:${downloadable[downloadable.length - 1].id}`);
  }, [downloadable]);

  const findByKey = useCallback(
    (key: string) => {
      const [source, id] = key.split(":");
      return downloadable.find((r) => r.source === source && r.id === id) ?? null;
    },
    [downloadable]
  );

  const before = findByKey(beforeKey);
  const after = findByKey(afterKey);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPlayingSide(null);
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  const playRecording = async (rec: VoiceLibraryItem, side: "before" | "after") => {
    if (playingSide === side) {
      stopAudio();
      return;
    }
    stopAudio();
    setPlayingSide(side);
    try {
      const url = api.getVoiceAudioUrl(rec.id, rec.source);
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("play failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;
      const audio = new Audio(objectUrl);
      audioRef.current = audio;
      audio.onended = () => stopAudio();
      await audio.play();
    } catch {
      stopAudio();
      alert("Could not play recording");
    }
  };

  if (downloadable.length < 2) {
    return (
      <Card className="text-center">
        <p className="font-medium text-foreground">Need at least 2 recordings to compare</p>
        <p className="mt-1 text-sm text-muted">Record more in Live Speaking or Voice Practice, then come back.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <CompareSlot
          side="before"
          recording={before}
          recordings={downloadable}
          onSelect={setBeforeKey}
          playing={playingSide === "before"}
          onPlayToggle={() => before && playRecording(before, "before")}
        />
        <CompareSlot
          side="after"
          recording={after}
          recordings={downloadable}
          onSelect={setAfterKey}
          playing={playingSide === "after"}
          onPlayToggle={() => after && playRecording(after, "after")}
        />
      </div>

      {before && after && (
        <Card>
          <h3 className="mb-3 font-semibold text-foreground">Score comparison</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <ScoreDelta before={before.loudnessScore} after={after.loudnessScore} label="Loudness" />
            <ScoreDelta before={before.clarityScore} after={after.clarityScore} label="Clarity" />
          </div>
          {before.loudnessScore == null && before.clarityScore == null && (
            <p className="mt-2 text-sm text-muted">Scores aren&apos;t available for these recordings yet.</p>
          )}
        </Card>
      )}
    </div>
  );
}
