"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Headphones, Mic } from "lucide-react";
import { SHADOWING_SENTENCES } from "@speak-coach/shared/content";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge } from "@/components/ui/primitives";

export default function ListenRepeatPage() {
  const [sentence, setSentence] = useState(SHADOWING_SENTENCES[0]);
  const [phase, setPhase] = useState<"listen" | "repeat" | "done">("listen");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setSentence(SHADOWING_SENTENCES[index % SHADOWING_SENTENCES.length]);
    setPhase("listen");
  }, [index]);

  const listen = () => {
    const u = new SpeechSynthesisUtterance(sentence.text);
    u.rate = 0.8;
    u.onend = () => setPhase("repeat");
    speechSynthesis.speak(u);
  };

  const next = () => {
    setIndex((i) => i + 1);
    setPhase("listen");
  };

  const phases = [
    { id: "listen", label: "Listen", icon: Headphones },
    { id: "repeat", label: "Repeat", icon: Mic },
    { id: "done", label: "Done", icon: CheckCircle2 },
  ] as const;

  return (
    <div className="space-y-6">
      <PageBack href="/shadowing" label="Shadowing" />
      <PageHeader title="Listen → Repeat → Record" subtitle="3-step pronunciation loop" badge="Practice" />

      <div className="flex gap-2">
        {phases.map((p, i) => {
          const Icon = p.icon;
          const active = phase === p.id;
          const completed = phase === "done" && i < 2;
          return (
            <div
              key={p.id}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-btn py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-white"
                  : completed
                    ? "bg-success/10 text-success"
                    : "bg-surface-muted text-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {i + 1}. {p.label}
            </div>
          );
        })}
      </div>

      <Card className="text-center">
        <p className="text-2xl font-medium text-foreground">{sentence.text}</p>
        <Badge variant="secondary" className="mt-2">
          {sentence.language}
        </Badge>
      </Card>

      {phase === "listen" && (
        <Button onClick={listen} className="w-full text-lg">
          <Headphones className="h-5 w-5" />
          Step 1: Listen
        </Button>
      )}

      {phase === "repeat" && (
        <>
          <p className="text-center font-medium text-primary">Step 2 & 3: Repeat and Record</p>
          <VoiceRecorder onComplete={() => setPhase("done")} label="Record Your Repeat" />
        </>
      )}

      {phase === "done" && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
            <p className="mt-2 text-xl font-semibold text-foreground">Great job!</p>
            <Button onClick={next} className="mt-4">
              Next Sentence
            </Button>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
