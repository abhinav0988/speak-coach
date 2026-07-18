"use client";

import { useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "@/lib/api";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";

interface MistakeRow {
  id: string;
  wrong_form: string;
  correct_form: string;
  repeat_count: number;
  category: string;
}

export default function MistakesPage() {
  const [mistakes, setMistakes] = useState<MistakeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [wrong, setWrong] = useState("");
  const [correct, setCorrect] = useState("");
  const [mode, setMode] = useState<"list" | "flashcard">("flashcard");
  const [cardIndex, setCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const load = () => {
    api
      .getMistakes()
      .then((d) => setMistakes(d.mistakes as MistakeRow[]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    if (!wrong || !correct) return;
    await api.addMistake(wrong, correct);
    setWrong("");
    setCorrect("");
    load();
  };

  const flashcards = mistakes.filter((m) => m.repeat_count > 0).slice(0, 10);
  const current = flashcards[cardIndex];

  const nextCard = () => {
    setShowAnswer(false);
    setCardIndex((i) => (i + 1) % flashcards.length);
  };

  if (loading) return <Skeleton className="h-64" />;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <PageBack href="/dashboard" label="Dashboard" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title="Mistake Center"
          subtitle="Turn your errors into strengths with focused practice"
          badge={`${mistakes.length} rules`}
          className="mb-0"
        />
        <div className="flex gap-2">
          <Button variant={mode === "flashcard" ? "primary" : "secondary"} onClick={() => setMode("flashcard")} className="text-sm">
            Flashcards
          </Button>
          <Button variant={mode === "list" ? "primary" : "secondary"} onClick={() => setMode("list")} className="text-sm">
            List
          </Button>
        </div>
      </div>

      {mode === "flashcard" && flashcards.length > 0 && current ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIndex}
            initial={{ opacity: 0, rotateY: -8 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 8 }}
          >
            <Card className="text-center">
              <p className="text-sm text-muted">
                Card {cardIndex + 1} / {flashcards.length}
              </p>
              <div className="mt-8 rounded-2xl bg-danger/5 p-6">
                <p className="text-sm text-danger">You said</p>
                <p className={`mt-2 text-3xl font-bold ${showAnswer ? "line-through text-muted" : "text-danger"}`}>
                  {current.wrong_form}
                </p>
              </div>
              {showAnswer && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-2xl bg-success/5 p-6">
                  <p className="text-sm text-success">Say instead</p>
                  <p className="mt-2 text-3xl font-bold text-success">{current.correct_form}</p>
                </motion.div>
              )}
              <Badge className="mt-4" variant="warning">
                Repeated {current.repeat_count}×
              </Badge>
              <div className="mt-8">
                {!showAnswer ? (
                  <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
                ) : (
                  <Button onClick={nextCard}>Next Card</Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      ) : mode === "flashcard" ? (
        <Card className="text-center">
          <p className="text-muted">No repeated mistakes yet. Keep practicing!</p>
        </Card>
      ) : null}

      {mode === "list" && (
        <>
          <Card>
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <Plus className="h-4 w-4 text-primary" />
              Add a rule
            </h3>
            <div className="flex flex-wrap gap-3">
              <input className="input min-w-[120px] flex-1" placeholder="Wrong (e.g. hu)" value={wrong} onChange={(e) => setWrong(e.target.value)} />
              <input className="input min-w-[120px] flex-1" placeholder="Correct (e.g. hoon)" value={correct} onChange={(e) => setCorrect(e.target.value)} />
              <Button onClick={add}>Add</Button>
            </div>
          </Card>

          <div className="space-y-2">
            {mistakes.map((m) => (
              <Card key={m.id} className="!p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <X className="h-4 w-4 shrink-0 text-danger" />
                    <span className="text-danger line-through">{m.wrong_form}</span>
                    <span className="text-muted">→</span>
                    <Check className="h-4 w-4 shrink-0 text-success" />
                    <span className="font-medium text-success">{m.correct_form}</span>
                    <span className="text-xs text-muted">{m.category}</span>
                  </div>
                  <Badge variant="warning">{m.repeat_count}×</Badge>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
