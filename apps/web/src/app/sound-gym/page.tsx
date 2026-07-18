"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import type { VoiceAnalytics } from "@speak-coach/shared";
import { SOUND_GYM_DRILLS } from "@speak-coach/shared/content";
import { api } from "@/lib/api";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";
import { Progress } from "@/components/ui/primitives";

export default function SoundGymPage() {
  const [activeId, setActiveId] = useState(SOUND_GYM_DRILLS[0].id);
  const [practiced, setPracticed] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api
      .getSoundGymProgress()
      .then((d) => setPracticed(new Set(d.completedIds)))
      .catch(() => setPracticed(new Set()))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const drill = SOUND_GYM_DRILLS.find((d) => d.id === activeId) ?? SOUND_GYM_DRILLS[0];
  const progressPct = Math.round((practiced.size / SOUND_GYM_DRILLS.length) * 100);

  const markPracticed = async (_blob: Blob, analytics: VoiceAnalytics) => {
    setSaving(true);
    try {
      const res = await api.completeSoundGymDrill({
        drillId: drill.id,
        loudnessScore: analytics.loudnessScore,
        clarityScore: analytics.clarityScore,
      });
      setPracticed(new Set(res.completedIds));
      const idx = SOUND_GYM_DRILLS.findIndex((d) => d.id === drill.id);
      if (idx < SOUND_GYM_DRILLS.length - 1) {
        setActiveId(SOUND_GYM_DRILLS[idx + 1].id);
      }
    } catch {
      alert("Could not save progress");
    } finally {
      setSaving(false);
    }
  };

  const speak = (text: string) => {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBack href="/dashboard" label="Dashboard" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageBack href="/dashboard" label="Dashboard" />
      <PageHeader
        title="Pronunciation Lab"
        subtitle="Master difficult sounds — progress saves to your account"
        badge={`${practiced.size}/${SOUND_GYM_DRILLS.length} complete`}
      />

      <Card>
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-muted">Lab progress</span>
          <span className="font-semibold text-primary">{progressPct}%</span>
        </div>
        <Progress value={progressPct} barClassName="bg-gradient-to-r from-primary to-secondary" />
      </Card>

      <div className="flex flex-wrap gap-2">
        {SOUND_GYM_DRILLS.map((d) => {
          const done = practiced.has(d.id);
          const active = activeId === d.id;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveId(d.id)}
              className={`flex items-center gap-1.5 rounded-btn px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-primary text-white shadow-glow"
                  : done
                    ? "bg-success/10 text-success"
                    : "bg-surface-muted text-muted hover:bg-surface-border"
              }`}
            >
              {done && <CheckCircle2 className="h-3.5 w-3.5" />}
              {d.sound}
            </button>
          );
        })}
      </div>

      <motion.div key={drill.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="space-y-6">
          <div>
            <Badge className="mb-2">{drill.sound}</Badge>
            <h2 className="text-card-title">{drill.title}</h2>
            <p className="mt-1 text-muted">{drill.description}</p>
          </div>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted">Practice Words</h3>
            <div className="flex flex-wrap gap-2">
              {drill.words.map((w) => (
                <Button key={w} variant="secondary" onClick={() => speak(w)} className="text-sm">
                  <Volume2 className="h-3.5 w-3.5" />
                  {w}
                </Button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted">Sentences</h3>
            <div className="space-y-2">
              {drill.sentences.map((s) => (
                <div
                  key={s}
                  className="flex items-center justify-between rounded-xl bg-surface-muted px-4 py-3 dark:bg-gray-800/50"
                >
                  <span className="text-sm">{s}</span>
                  <button type="button" onClick={() => speak(s)} className="text-primary hover:text-primary-700">
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-muted">Tongue Twister</h3>
            <p className="rounded-xl bg-warning/10 p-4 font-medium text-foreground">{drill.tongueTwister}</p>
            <Button variant="secondary" onClick={() => speak(drill.tongueTwister)} className="mt-3 text-sm">
              <Volume2 className="h-4 w-4" />
              Hear Twister
            </Button>
          </section>

          <VoiceRecorder
            onComplete={markPracticed}
            label={saving ? "Saving…" : "Record & Mark Complete"}
          />
        </Card>
      </motion.div>
    </div>
  );
}
