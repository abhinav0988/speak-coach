"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Volume2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge, Button, Card, SectionHeader } from "@/components/ui/primitives";

interface Mistake {
  wrong: string;
  correct: string;
  repeatCount: number;
}

export function MistakeCenter({ mistakes }: { mistakes: Mistake[] }) {
  const [index, setIndex] = useState(0);

  if (mistakes.length === 0) {
    return (
      <Card className="text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10 text-2xl">
          ✨
        </div>
        <h3 className="font-semibold">No repeated mistakes yet</h3>
        <p className="mt-1 text-sm text-muted">Keep practicing — we&apos;ll track patterns here.</p>
        <Link href="/session" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          Start practicing →
        </Link>
      </Card>
    );
  }

  const current = mistakes[index % mistakes.length];
  const difficulty = current.repeatCount >= 5 ? "Hard" : current.repeatCount >= 2 ? "Medium" : "Easy";

  return (
    <section>
      <SectionHeader
        title="Mistake Center"
        subtitle="Turn errors into breakthroughs with focused practice"
        action={
          <span className="text-sm text-muted">
            {index + 1} / {mistakes.length}
          </span>
        }
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={current.wrong}
          initial={{ opacity: 0, rotateY: -8 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 8 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="relative overflow-hidden">
            <div className="absolute right-4 top-4">
              <Badge variant={difficulty === "Hard" ? "warning" : "default"}>{difficulty}</Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-danger/20 bg-danger/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-danger">
                  <X className="h-4 w-4" /> Incorrect
                </div>
                <p className="text-2xl font-bold line-through decoration-danger/60">{current.wrong}</p>
                <p className="mt-2 text-sm text-muted">Repeated {current.repeatCount}×</p>
              </div>

              <div className="rounded-xl border border-success/20 bg-success/5 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-success">
                  <Check className="h-4 w-4" /> Correct
                </div>
                <p className="text-2xl font-bold text-success">{current.correct}</p>
                <button
                  className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  aria-label="Play pronunciation"
                >
                  <Volume2 className="h-4 w-4" /> Hear pronunciation
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/mistakes">
                <Button>Practice</Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => setIndex((i) => (i + 1) % mistakes.length)}
              >
                Next mistake
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
