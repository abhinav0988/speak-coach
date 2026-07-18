"use client";

import { useState } from "react";
import Link from "next/link";
import { Gauge, Mic, MessageSquare, Volume2 } from "lucide-react";
import { api } from "@/lib/api";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import type { VoiceAnalytics } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card } from "@/components/ui/primitives";

export default function VoicePage() {
  const [transcript, setTranscript] = useState("");
  const [analytics, setAnalytics] = useState<VoiceAnalytics | null>(null);
  const [savedTranscript, setSavedTranscript] = useState("");
  const [uploading, setUploading] = useState(false);
  const [recordingId, setRecordingId] = useState<string | null>(null);

  const handleComplete = async (blob: Blob, clientAnalytics: VoiceAnalytics, spokenText: string) => {
    setUploading(true);
    const text = spokenText || transcript;
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");
      formData.append("transcript", text);
      formData.append("language", "mixed");
      formData.append("category", "practice");
      formData.append("analytics", JSON.stringify(clientAnalytics));
      const res = (await api.uploadVoice(formData)) as {
        id: string;
        transcript: string;
        analytics: VoiceAnalytics;
      };
      setAnalytics(res.analytics);
      setSavedTranscript(res.transcript || transcript);
      setRecordingId(res.id);
      if (res.transcript && !transcript) setTranscript(res.transcript);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageBack href="/" />
      <PageHeader
        title="Voice Practice"
        subtitle="Record your voice — scores are computed from your audio and transcript"
        badge="Voice"
      />

      <textarea
        className="input min-h-[80px]"
        placeholder="What did you say? (improves pace, clarity & filler detection)"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
      />

      <VoiceRecorder transcript={transcript} onComplete={handleComplete} />

      {uploading && <p className="text-sm text-muted">Analyzing and saving recording…</p>}

      {analytics && (
        <Card className="space-y-4">
          <h3 className="font-semibold text-foreground">Your scores</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Score icon={Volume2} label="Loudness" value={`${analytics.loudnessScore}/100`} />
            <Score icon={Mic} label="Clarity" value={`${analytics.clarityScore}/100`} />
            <Score icon={Gauge} label="Pace" value={`${analytics.paceWpm} wpm`} />
            <Score icon={MessageSquare} label="Fillers" value={String(analytics.fillerCount)} />
          </div>
          <p className="text-sm text-muted">
            Speaking time: {Math.round(analytics.speakingTimeMs / 1000)}s
            {savedTranscript && (
              <>
                {" "}
                · Transcript: <span className="text-foreground">{savedTranscript.slice(0, 120)}
                {savedTranscript.length > 120 ? "…" : ""}</span>
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/voice-timeline">
              <Button variant="secondary">View timeline</Button>
            </Link>
            {recordingId && (
              <Link href="/voice-library">
                <Button variant="secondary">Voice library</Button>
              </Link>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function Score({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mic;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-surface-muted p-4 dark:bg-gray-800/50">
      <p className="flex items-center gap-1 text-xs text-muted">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}
