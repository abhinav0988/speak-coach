"use client";

import { useEffect, useState } from "react";
import { Briefcase, Sparkles, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { CorrectionCard } from "@/components/CorrectionCard";
import type { RomanHindiCorrection, EnglishCorrection } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";

interface Scenario {
  id: string;
  title: string;
  description: string;
  turnCount: number;
}

export default function RoleplayPage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [turnIndex, setTurnIndex] = useState(0);
  const [totalTurns, setTotalTurns] = useState(0);
  const [reply, setReply] = useState("");
  const [language, setLanguage] = useState<"english" | "roman_hindi">("english");
  const [correction, setCorrection] = useState<RomanHindiCorrection | EnglishCorrection | null>(null);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .getRoleplayScenarios()
      .then((d) => setScenarios(d.scenarios))
      .finally(() => setLoading(false));
  }, []);

  const start = async (scenarioId: string) => {
    const res = (await api.startRoleplay(scenarioId)) as {
      sessionId: string;
      scenario: { language: string };
      prompt: { text: string };
      totalTurns: number;
    };
    setSessionId(res.sessionId);
    setPrompt(res.prompt.text);
    setTurnIndex(0);
    setTotalTurns(res.totalTurns);
    setLanguage(res.scenario.language === "roman_hindi" ? "roman_hindi" : "english");
    setCompleted(false);
    setCorrection(null);
    setFeedback("");
  };

  const submitReply = async () => {
    if (!sessionId || !reply.trim()) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("turnIndex", String(turnIndex));
      formData.append("reply", reply);

      const res = (await api.submitRoleplayTurn(formData)) as {
        correction: RomanHindiCorrection | EnglishCorrection;
        aiFeedback: string;
        completed: boolean;
        nextTurn: { text: string } | null;
        currentTurn: number;
      };

      setCorrection(res.correction);
      setFeedback(res.aiFeedback);
      setReply("");

      if (res.completed) {
        setCompleted(true);
      } else if (res.nextTurn) {
        setPrompt(res.nextTurn.text);
        setTurnIndex(res.currentTurn);
        speechSynthesis.speak(new SpeechSynthesisUtterance(res.nextTurn.text));
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="space-y-8">
        <PageBack href="/dashboard" label="Dashboard" />
        <PageHeader
          title="Scenario Roleplay"
          subtitle="Practice real conversations with instant AI correction"
          badge="~10 min"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {scenarios.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => start(s.id)}
              className="card text-left transition hover:-translate-y-1 hover:shadow-elevated hover:ring-1 hover:ring-primary/20"
            >
              <div className="mb-3 inline-flex rounded-xl bg-secondary/10 p-2.5">
                <Briefcase className="h-5 w-5 text-secondary" />
              </div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted line-clamp-2">{s.description}</p>
              <Badge className="mt-3">{s.turnCount} turns</Badge>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setSessionId(null)} className="!px-0">
          ← Scenarios
        </Button>
        <Badge variant="secondary">
          Turn {turnIndex + 1} / {totalTurns}
        </Badge>
      </div>

      {completed ? (
        <Card className="text-center bg-gradient-to-br from-success/10 to-primary/5">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-success/15 text-3xl">
            🎉
          </div>
          <h2 className="text-card-title">Scenario Complete!</h2>
          <p className="mt-2 text-muted">Great job practicing real-world conversation.</p>
          <Button onClick={() => setSessionId(null)} className="mt-6">
            Choose Another Scenario
          </Button>
        </Card>
      ) : (
        <>
          <Card>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Your prompt</p>
            <p className="mt-2 text-lg font-medium leading-relaxed">{prompt}</p>
            <Button variant="secondary" onClick={() => speechSynthesis.speak(new SpeechSynthesisUtterance(prompt))} className="mt-4 text-sm">
              <Volume2 className="h-4 w-4" />
              Hear Again
            </Button>
          </Card>

          <textarea
            className="input min-h-[120px] resize-none"
            placeholder="Type your reply in English or Roman Hindi..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />

          <Button onClick={submitReply} disabled={submitting} className="w-full">
            <Sparkles className="h-4 w-4" />
            {submitting ? "Checking..." : "Submit Reply"}
          </Button>

          {feedback && (
            <Card className="border-primary/20 bg-primary/5">
              <p className="text-sm font-semibold text-primary">Coach Feedback</p>
              <p className="mt-2">{feedback}</p>
            </Card>
          )}

          {correction && <CorrectionCard result={correction} type={language} />}
        </>
      )}
    </div>
  );
}
