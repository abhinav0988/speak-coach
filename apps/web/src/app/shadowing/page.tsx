"use client";

import { useEffect, useState } from "react";
import { Headphones, Mic, RefreshCw, Volume2, Trophy, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import type { ShadowingResult, VoiceAnalytics } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Skeleton } from "@/components/ui/primitives";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

type Phase = "listen" | "record" | "result";

const PHASES: { id: Phase; label: string; icon: LucideIcon }[] = [
  { id: "listen", label: "Listen", icon: Headphones },
  { id: "record", label: "Repeat", icon: Mic },
  { id: "result", label: "Score", icon: Trophy },
];

export default function ShadowingPage() {
  const [sentence, setSentence] = useState<{ text: string; language: string } | null>(null);
  const [result, setResult] = useState<ShadowingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [phase, setPhase] = useState<Phase>("listen");

  useEffect(() => {
    api
      .getShadowingSentence()
      .then((d) => setSentence(d.sentence))
      .finally(() => setInitLoading(false));
  }, []);

  const speakSentence = () => {
    if (!sentence) return;
    const utterance = new SpeechSynthesisUtterance(sentence.text);
    utterance.rate = 0.85;
    speechSynthesis.speak(utterance);
    setPhase("record");
  };

  const handleRecording = async (blob: Blob, analytics: VoiceAnalytics) => {
    if (!sentence) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("referenceText", sentence.text);
      formData.append("analytics", JSON.stringify(analytics));
      formData.append("audio", blob, "shadowing.webm");
      const res = await api.submitShadowing(formData);
      setResult(res);
      setPhase("result");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setResult(null);
    setPhase("listen");
    api.getShadowingSentence().then((d) => setSentence(d.sentence));
  };

  const phaseIndex = PHASES.findIndex((p) => p.id === phase);

  if (initLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20" />
        <Skeleton className="h-40" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageBack href="/dashboard" label="Dashboard" />
      <PageHeader
        title="Shadowing Practice"
        subtitle="Listen → Repeat → Get scored on accuracy and voice"
        badge="~6 min"
      />

      {/* Phase indicator */}
      <div className="flex items-center justify-center gap-2">
        {PHASES.map((p, i) => {
          const Icon = p.icon;
          const active = i <= phaseIndex;
          const current = p.id === phase;
          return (
            <div key={p.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  current
                    ? "bg-primary text-white shadow-glow"
                    : active
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-muted text-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {p.label}
              </div>
              {i < PHASES.length - 1 && (
                <div className={`h-0.5 w-8 ${i < phaseIndex ? "bg-primary" : "bg-surface-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {sentence && (
        <Card className="relative overflow-hidden text-center">
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary/10 blur-2xl" />
          <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
            {sentence.language}
          </p>
          <p className="relative mt-3 text-2xl font-medium leading-relaxed text-foreground sm:text-3xl">
            &ldquo;{sentence.text}&rdquo;
          </p>
        </Card>
      )}

      <AnimatePresence mode="wait">
        {phase === "listen" && (
          <motion.div key="listen" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Button onClick={speakSentence} className="w-full py-4 text-base">
              <Volume2 className="h-5 w-5" />
              Listen to Sentence
            </Button>
            <p className="mt-3 text-center text-sm text-muted">Listen carefully, then repeat exactly what you hear</p>
          </motion.div>
        )}

        {phase === "record" && !result && (
          <motion.div key="record" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="border-primary/20 bg-primary/5 text-center">
              <p className="font-semibold text-primary">Now repeat the sentence aloud!</p>
              <p className="mt-1 text-sm text-muted">Match the rhythm, volume, and pronunciation</p>
            </Card>
            <div className="mt-4">
              <VoiceRecorder onComplete={handleRecording} label="Record Your Shadowing" />
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div key="loading" className="flex items-center justify-center gap-3 py-8 text-muted">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Scoring your attempt...
          </motion.div>
        )}

        {phase === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <Card className="text-center bg-gradient-to-br from-primary/5 to-secondary/5">
              <p className="text-sm font-medium text-muted">Overall Score</p>
              <p className="mt-1 text-5xl font-bold text-primary">
                <AnimatedNumber value={result.overallScore} suffix="%" />
              </p>
              <p className="mt-2 text-sm text-muted">
                {result.overallScore >= 80
                  ? "Excellent shadowing!"
                  : result.overallScore >= 60
                    ? "Good effort — keep practicing"
                    : "Try again — focus on clarity"}
              </p>
            </Card>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ScoreCard label="Word Accuracy" value={result.wordAccuracyPct} />
              <ScoreCard label="Volume" value={result.volumeMatchPct} />
              <ScoreCard label="Clarity" value={result.clarityScore} />
              <ScoreCard label="Pace" value={result.paceMatchPct} />
            </div>

            {result.transcript && (
              <Card>
                <h3 className="text-sm font-semibold text-muted">You said</h3>
                <p className="mt-2 text-foreground">{result.transcript}</p>
              </Card>
            )}

            {result.mismatchedWords.length > 0 && (
              <Card>
                <h3 className="mb-3 font-semibold">Mismatched Words</h3>
                <div className="space-y-2">
                  {result.mismatchedWords.map((m, i) => (
                    <div
                      key={i}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-surface-muted px-4 py-2 text-sm dark:bg-gray-800/50"
                    >
                      <span className="font-medium text-success">{m.expected}</span>
                      <span className="text-muted">→</span>
                      <span className="text-danger line-through">{m.spoken}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Button onClick={retry} className="w-full">
              <RefreshCw className="h-4 w-4" />
              Try Another Sentence
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <Card className="!p-4 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-bold text-foreground">
        <AnimatedNumber value={value} suffix="%" />
      </p>
    </Card>
  );
}
