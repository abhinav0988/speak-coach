"use client";

import { useState } from "react";
import { CheckCircle2, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { LiveVoiceRecorder } from "@/components/LiveVoiceRecorder";
import { api } from "@/lib/api";
import type { VoiceAnalytics } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/primitives";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { PracticeStatGrid } from "@/components/practice/PracticeStatGrid";

import { countFillerWords } from "@/lib/fillerWords";

export default function LiveSpeakPage() {
  const [saved, setSaved] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analytics, setAnalytics] = useState<VoiceAnalytics | null>(null);
  const [fillers, setFillers] = useState(0);

  const handleComplete = async (blob: Blob, voiceAnalytics: VoiceAnalytics, liveTranscript: string) => {
    setTranscript(liveTranscript);
    setAnalytics(voiceAnalytics);
    setFillers(countFillerWords(liveTranscript));

    const formData = new FormData();
    formData.append("audio", blob, "live.webm");
    formData.append("transcript", liveTranscript);
    formData.append("language", "mixed");
    formData.append("category", "live_speak");
    formData.append("analytics", JSON.stringify({ ...voiceAnalytics, fillerCount: countFillerWords(liveTranscript) }));

    await api.uploadVoice(formData);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageBack href="/dashboard" label="Dashboard" />
      <PageHeader
        title="Live Speaking"
        subtitle="Real-time voice recording with live transcript as you speak"
        badge="~8 min"
      />

      <Card className="border-primary/20 bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/15 p-3">
            <Mic className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold">Speak freely</p>
            <p className="text-sm text-muted">Your words appear live — build confidence without stopping</p>
          </div>
        </div>
      </Card>

      <LiveVoiceRecorder onComplete={handleComplete} label="Start Live Speaking" />

      {saved && analytics && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="flex items-center justify-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold">Recording saved</span>
          </div>

          <PracticeStatGrid
            stats={[
              { label: "Loudness", value: analytics.loudnessScore, suffix: "/100" },
              { label: "Clarity", value: analytics.clarityScore, suffix: "/100" },
              { label: "Duration", value: Math.round(analytics.speakingTimeMs / 1000), suffix: "s" },
              { label: "Fillers", value: fillers, warn: fillers > 3 },
            ]}
          />

          {transcript && (
            <Card>
              <h3 className="text-sm font-semibold text-muted">Final Transcript</h3>
              <p className="mt-3 text-sm leading-relaxed">{transcript}</p>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
