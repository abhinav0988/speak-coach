"use client";

import { useEffect, useState } from "react";
import { Heart, Save } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Skeleton } from "@/components/ui/primitives";

export default function JournalPage() {
  const [moodBefore, setMoodBefore] = useState(5);
  const [moodAfter, setMoodAfter] = useState(5);
  const [reflection, setReflection] = useState("");
  const [entries, setEntries] = useState<
    Array<{
      date: string;
      mood_before: number;
      mood_after: number;
      reflection: string;
    }>
  >([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getJournal(), api.getTodayJournal()])
      .then(([journal, today]) => {
        setEntries(journal.entries as typeof entries);
        const e = today.entry as {
          mood_before?: number;
          mood_after?: number;
          reflection?: string;
        } | null;
        if (e) {
          if (e.mood_before) setMoodBefore(e.mood_before);
          if (e.mood_after) setMoodAfter(e.mood_after);
          if (e.reflection) setReflection(e.reflection);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    await api.saveJournal({ moodBefore, moodAfter, reflection });
    setSaved(true);
    api.getJournal().then((d) => setEntries(d.entries as typeof entries));
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBack href="/" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageBack href="/" />
      <PageHeader title="Confidence Journal" subtitle="Track your mood and daily reflections" badge="Reflection" />

      <Card className="space-y-6">
        <div>
          <label className="mb-1 block text-sm text-muted">Mood BEFORE session (1-10)</label>
          <input
            type="range"
            min={1}
            max={10}
            value={moodBefore}
            onChange={(e) => setMoodBefore(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <span className="text-sm font-medium text-foreground">{moodBefore}/10</span>
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Mood AFTER session (1-10)</label>
          <input
            type="range"
            min={1}
            max={10}
            value={moodAfter}
            onChange={(e) => setMoodAfter(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <span className="text-sm font-medium text-foreground">{moodAfter}/10</span>
        </div>
        <div>
          <label className="mb-1 block text-sm text-muted">Today I felt confident when...</label>
          <textarea
            className="input min-h-[80px]"
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Write one line about your confidence today"
          />
        </div>
        <Button onClick={save}>
          <Save className="h-4 w-4" />
          {saved ? "Saved!" : "Save Journal Entry"}
        </Button>
      </Card>

      {entries.length > 0 && (
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <Heart className="h-5 w-5 text-primary" />
            Past Entries
          </h2>
          {entries.map((e) => (
            <Card key={e.date} className="text-sm">
              <p className="font-medium text-foreground">{e.date}</p>
              <p className="text-muted">
                Mood: {e.mood_before} → {e.mood_after}
              </p>
              {e.reflection && <p className="mt-1 italic text-muted">{e.reflection}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
