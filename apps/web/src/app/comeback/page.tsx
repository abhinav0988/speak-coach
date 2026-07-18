"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper, Sparkles } from "lucide-react";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Progress } from "@/components/ui/primitives";

const STEPS = [
  { title: "Warm up", prompt: "Say aloud: Main aaj practice kar raha hoon.", hint: "Speak clearly and loudly" },
  { title: "Roman Hindi fix", prompt: "Correct and say: main ghar pohach gya hu", hint: "Should be: main ghar pahunch gaya hoon" },
  { title: "English line", prompt: "Say: I am back and ready to practice speaking.", hint: "Focus on clarity" },
  { title: "Quick read", prompt: "Read: Aaj main apni awaaz improve karunga.", hint: "Slow and steady" },
  { title: "Confidence", prompt: "Say: Main confident hoon aur roz practice karunga.", hint: "Smile while speaking!" },
];

export default function ComebackPage() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + (done ? 1 : 0)) / STEPS.length) * 100;

  const next = () => {
    if (isLast) setDone(true);
    else setStep((s) => s + 1);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-lg space-y-6 text-center">
        <PageBack href="/" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <PartyPopper className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-section text-foreground">Welcome back!</h1>
          <p className="mt-2 text-muted">You completed the 5-minute comeback session. Keep the momentum going!</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link href="/session">
              <Button>Full Session</Button>
            </Link>
            <Link href="/">
              <Button variant="secondary">Dashboard</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <PageBack href="/" />
      <PageHeader
        title="Comeback Session"
        subtitle="5 quick steps to get back on track — no guilt, just practice"
        badge="5 min"
      />

      <Progress value={progress} className="h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <Card className="space-y-4">
            <p className="text-sm text-muted">
              Step {step + 1} of {STEPS.length} — {current.title}
            </p>
            <p className="text-xl font-medium text-foreground">{current.prompt}</p>
            <p className="flex items-start gap-2 text-sm text-primary">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
              {current.hint}
            </p>
            <Button onClick={next} className="w-full">
              {isLast ? "Finish Comeback" : "Done — Next"}
            </Button>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
