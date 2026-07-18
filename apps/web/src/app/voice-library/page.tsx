"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, FolderDown, GitCompare, Mic, Play, Save } from "lucide-react";
import type { VoiceLibraryData, VoiceLibraryItem, VoiceRecordingCategory } from "@speak-coach/shared";
import { api } from "@/lib/api";
import {
  downloadCategoryRecordings,
  downloadVoiceAudio,
  VOICE_CATEGORY_FILTERS,
  VOICE_CATEGORY_META,
} from "@/lib/voiceLibrary";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Badge, Button, Card, Skeleton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";
import { VoiceCompare } from "@/components/voice/VoiceCompare";

type View = "library" | "compare";

export default function VoiceLibraryPage() {
  const [view, setView] = useState<View>("library");
  const [category, setCategory] = useState<VoiceRecordingCategory | "all">("all");
  const [data, setData] = useState<VoiceLibraryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [compareRecordings, setCompareRecordings] = useState<VoiceLibraryItem[]>([]);
  const [compareLoading, setCompareLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .getVoiceLibrary(category === "all" ? undefined : category)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (view !== "compare") return;
    setCompareLoading(true);
    api
      .getVoiceLibrary()
      .then((d) => setCompareRecordings(d.recordings))
      .catch(() => setCompareRecordings([]))
      .finally(() => setCompareLoading(false));
  }, [view]);

  const handleDownload = async (rec: VoiceLibraryItem) => {
    setDownloading(rec.id);
    try {
      await downloadVoiceAudio(rec.id, rec.source, rec.category, rec.createdAt);
    } catch {
      alert("Could not download recording");
    } finally {
      setDownloading(null);
    }
  };

  const handleSaveAllInCategory = async () => {
    if (!data?.recordings.length) return;
    setBulkSaving(true);
    try {
      const count = await downloadCategoryRecordings(data.recordings);
      if (count === 0) alert("No downloadable files in this category");
    } catch {
      alert("Bulk download failed");
    } finally {
      setBulkSaving(false);
    }
  };

  const handlePlay = async (rec: VoiceLibraryItem) => {
    if (!rec.canDownload) return;
    setPlayingId(rec.id);
    try {
      const url = api.getVoiceAudioUrl(rec.id, rec.source);
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("play failed");
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const audio = new Audio(objectUrl);
      audio.onended = () => {
        URL.revokeObjectURL(objectUrl);
        setPlayingId(null);
      };
      await audio.play();
    } catch {
      setPlayingId(null);
      alert("Could not play recording");
    }
  };

  const categoryLabel =
    category === "all" ? "all categories" : VOICE_CATEGORY_META[category].label;

  return (
    <div className="space-y-8">
      <PageBack href="/voice-timeline" label="Voice Timeline" />
      <PageHeader
        title="Voice Library"
        subtitle="Browse, play, and download your recordings — organized by practice type"
        badge="Your voice"
      />

      <div className="flex rounded-full bg-surface-muted p-1 dark:bg-gray-800 w-fit">
        {(
          [
            { id: "library" as const, label: "Library", icon: Mic },
            { id: "compare" as const, label: "Before / After", icon: GitCompare },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setView(id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              view === id ? "bg-primary text-white shadow-sm" : "text-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {view === "compare" && (
        compareLoading ? (
          <Skeleton className="h-48" />
        ) : (
          <VoiceCompare recordings={compareRecordings} />
        )
      )}

      {view === "library" && (
        <>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {VOICE_CATEGORY_FILTERS.map((cat) => {
          const count = cat.id === "all" ? data?.total : data?.counts[cat.id as VoiceRecordingCategory];
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
                category === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-surface-muted text-muted hover:text-foreground dark:bg-gray-800"
              )}
            >
              {cat.label}
              {count != null && count > 0 && (
                <span className="ml-1.5 opacity-80">({count})</span>
              )}
            </button>
          );
        })}
      </div>

      {!loading && data && data.recordings.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleSaveAllInCategory} disabled={bulkSaving}>
            <FolderDown className="h-4 w-4" />
            {bulkSaving ? "Saving…" : `Save all in ${categoryLabel}`}
          </Button>
          <p className="flex items-center text-sm text-muted">
            <Save className="mr-1.5 h-4 w-4" />
            Files save to your device&apos;s Downloads folder
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
      ) : !data || data.recordings.length === 0 ? (
        <Card className="text-center">
          <Mic className="mx-auto mb-3 h-10 w-10 text-muted" />
          <p className="font-medium text-foreground">No recordings yet</p>
          <p className="mt-1 text-sm text-muted">
            {category === "all"
              ? "Record in Live Speaking, Challenge, or Voice Practice"
              : `No ${VOICE_CATEGORY_META[category as VoiceRecordingCategory]?.label ?? category} recordings yet`}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link href="/live-speak">
              <Button>Live Speaking</Button>
            </Link>
            <Link href="/voice">
              <Button variant="secondary">Voice Practice</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {data.recordings.map((rec) => {
            const meta = VOICE_CATEGORY_META[rec.category];
            return (
              <Card key={`${rec.source}-${rec.id}`} className="!p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", meta.color)}>
                        {meta.label}
                      </span>
                      <span className="text-xs text-muted">{rec.createdAt.slice(0, 16).replace("T", " ")}</span>
                      {rec.durationSec != null && (
                        <span className="text-xs text-muted">{rec.durationSec}s</span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-foreground">
                      {rec.label || rec.transcript || "Voice recording"}
                    </p>
                    {(rec.loudnessScore != null || rec.clarityScore != null) && (
                      <p className="mt-1 text-xs text-muted">
                        {rec.loudnessScore != null && `Loudness ${Math.round(rec.loudnessScore)}`}
                        {rec.loudnessScore != null && rec.clarityScore != null && " · "}
                        {rec.clarityScore != null && `Clarity ${Math.round(rec.clarityScore)}`}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {rec.canDownload && (
                      <>
                        <Button
                          variant="ghost"
                          onClick={() => handlePlay(rec)}
                          disabled={playingId === rec.id}
                          aria-label="Play"
                        >
                          <Play className="h-4 w-4" />
                          {playingId === rec.id ? "Playing" : "Play"}
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleDownload(rec)}
                          disabled={downloading === rec.id}
                        >
                          <Download className="h-4 w-4" />
                          {downloading === rec.id ? "Saving…" : "Download"}
                        </Button>
                      </>
                    )}
                    {!rec.canDownload && (
                      <Badge variant="secondary">No audio file</Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
