"use client";

import { useEffect, useState, useRef } from "react";
import { Timer, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { CHALLENGE_PROMPTS } from "@speak-coach/shared/content";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { api } from "@/lib/api";
import type { VoiceAnalytics } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card } from "@/components/ui/primitives";
import { PracticeStatGrid } from "@/components/practice/PracticeStatGrid";

export default function ChallengePage() {
  const [prompt, setPrompt] = useState("");
  const [transcript, setTranscript] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [analytics, setAnalytics] = useState<VoiceAnalytics | null>(null);
  const [fillers, setFillers] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const dayIndex = Math.floor(Date.now() / 86400000) % CHALLENGE_PROMPTS.length;
    setPrompt(CHALLENGE_PROMPTS[dayIndex]);
  }, []);

  const startChallenge = () => {
    setRunning(true);
    setSecondsLeft(60);
    setDone(false);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleComplete = async (blob: Blob, voiceAnalytics: VoiceAnalytics, spokenText: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setDone(true);

    const text = spokenText || transcript;
    const formData = new FormData();
    formData.append("audio", blob, "challenge.webm");
    formData.append("transcript", text);
    formData.append("language", "mixed");
    formData.append("category", "challenge");
    formData.append("analytics", JSON.stringify(voiceAnalytics));

    try {
      const res = (await api.uploadVoice(formData)) as {
        fillers?: number;
        analytics?: VoiceAnalytics;
        transcript?: string;
      };
      setAnalytics(res.analytics ?? voiceAnalytics);
      setFillers(res.fillers ?? res.analytics?.fillerCount ?? voiceAnalytics.fillerCount);
      if (res.transcript) setTranscript(res.transcript);
    } catch {
      setAnalytics(voiceAnalytics);
      setFillers(voiceAnalytics.fillerCount);
    }
  };

  const urgent = secondsLeft <= 10 && running;

  return (
    <div className="mx-auto max-w-xl space-y-8">
      <PageBack href="/dashboard" label="Dashboard" />
      <PageHeader
        title="60-Second Challenge"
        subtitle="Speak non-stop on today's prompt — build fluency under pressure"
        badge="Hard"
      />

      <Card className="text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Today&apos;s Prompt</p>
        <p className="mt-3 text-xl font-medium leading-relaxed">{prompt || "Loading..."}</p>
      </Card>

      <Card className={`text-center transition-colors ${urgent ? "border-danger/30 bg-danger/5" : ""}`}>
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Timer className={`h-6 w-6 ${urgent ? "text-danger" : "text-primary"}`} />
        </div>
        <motion.p
          key={secondsLeft}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className={`text-6xl font-bold tabular-nums ${urgent ? "text-danger" : "text-primary"}`}
        >
          {secondsLeft}s
        </motion.p>
        {!running && !done && (
          <Button onClick={startChallenge} className="mt-6">
            <Zap className="h-4 w-4" />
            Start Timer
          </Button>
        )}
      </Card>

      {(running || done) && (
        <>
          <textarea
            className="input min-h-[72px]"
            placeholder="What did you say? (paste or type for filler word detection)"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <VoiceRecorder
            transcript={transcript}
            onComplete={handleComplete}
            label={running ? "Recording — speak now!" : "Record Again"}
          />
        </>
      )}

      {done && analytics && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <PracticeStatGrid
            stats={[
              { label: "Loudness", value: analytics.loudnessScore, suffix: "/100" },
              { label: "Clarity", value: analytics.clarityScore, suffix: "/100" },
              { label: "Filler Words", value: fillers, warn: fillers > 3 },
            ]}
          />
        </motion.div>
      )}
    </div>
  );
}
