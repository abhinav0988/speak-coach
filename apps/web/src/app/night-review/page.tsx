"use client";

import { useEffect, useState } from "react";
import { Moon, BookOpen, ListTodo, Gauge } from "lucide-react";
import { api } from "@/lib/api";
import type { NightReviewData } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Skeleton } from "@/components/ui/primitives";

export default function NightReviewPage() {
  const [data, setData] = useState<NightReviewData | null>(null);
  const [confidence, setConfidence] = useState(5);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getNightReview()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const finish = async () => {
    await api.saveJournal({ moodAfter: confidence, reflection: "Night review completed" });
    setDone(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBack href="/" />
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageBack href="/" />
        <Card className="text-center text-danger">Could not load night review.</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageBack href="/" />
      <PageHeader title="Night Review" subtitle="5-minute recap before bed" badge="Bedtime" />

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Moon className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Step 1 — Top 3 Mistakes Today</h2>
        </div>
        {data.topMistakes.length === 0 ? (
          <p className="text-muted">No mistakes recorded today. Great job!</p>
        ) : (
          data.topMistakes.map((m, i) => (
            <p key={i} className="text-sm">
              <span className="text-danger line-through">{m.wrong}</span>
              {" → "}
              <span className="text-success">{m.correct}</span>
            </p>
          ))
        )}
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Step 2 — Review Sentences</h2>
        </div>
        {data.reviewSentences.map((s, i) => (
          <div key={i} className="mb-2 text-sm">
            <p className="font-medium text-foreground">{s.roman_hindi}</p>
            <p className="text-muted">{s.english}</p>
          </div>
        ))}
      </Card>

      {data.homework && !data.homework.completed && (
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <ListTodo className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Step 3 — Tomorrow&apos;s Homework Preview</h2>
          </div>
          <ul className="space-y-1 text-sm text-muted">
            {data.homework.tasks.slice(0, 3).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Gauge className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Step 4 — Rate Confidence</h2>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <p className="text-center text-xl font-bold text-foreground">{confidence}/10</p>
        <Button onClick={finish} className="mt-4 w-full" disabled={done}>
          {done ? "Review Complete" : "Finish Night Review"}
        </Button>
      </Card>
    </div>
  );
}
