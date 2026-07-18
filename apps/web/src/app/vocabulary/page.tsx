"use client";

import { useEffect, useState } from "react";
import { BookOpen, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { DevanagariToggle, HindiText } from "@/components/DevanagariToggle";
import { SpeakButton } from "@/components/SpeakButton";
import { useSettings } from "@/hooks/useSettings";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";

interface VocabWord {
  id: string;
  word: string;
  language: string;
  meaning: string;
  pronunciation: string;
  example: string;
}

export default function VocabularyPage() {
  const [data, setData] = useState<{
    dayNumber: number;
    vocabulary: VocabWord[];
    sentences: Array<{ roman_hindi: string; hindi_script: string; english: string }>;
  } | null>(null);
  const [dueWords, setDueWords] = useState<VocabWord[]>([]);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const { devanagariPreferred, toggleDevanagari, loaded } = useSettings();

  useEffect(() => {
    api.getVocabularyToday().then((d) => setData(d as typeof data));
    api.getVocabularyDue().then((d) => setDueWords(d.words as VocabWord[]));
  }, []);

  const review = async (quality: "known" | "learning" | "difficult") => {
    const word = dueWords[reviewIndex];
    if (!word) return;
    await api.reviewVocabulary(word.id, quality);
    setShowMeaning(false);
    if (reviewIndex < dueWords.length - 1) {
      setReviewIndex((i) => i + 1);
    } else {
      setReviewMode(false);
      setReviewIndex(0);
      api.getVocabularyDue().then((d) => setDueWords(d.words as VocabWord[]));
    }
  };

  if (!data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20" />
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const currentReview = dueWords[reviewIndex];

  return (
    <div className="space-y-10">
      <PageBack href="/dashboard" label="Dashboard" />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHeader
          title={`Day ${data.dayNumber} — Vocabulary`}
          subtitle="Learn new words and review with spaced repetition"
          badge={`${data.vocabulary.length} words`}
          className="mb-0"
        />
        <div className="flex items-center gap-2">
          {loaded && <DevanagariToggle enabled={devanagariPreferred} onChange={toggleDevanagari} />}
          {dueWords.length > 0 && (
            <Button onClick={() => setReviewMode(true)}>
              Review {dueWords.length} due
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {reviewMode && currentReview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="mx-auto max-w-md text-center">
              <p className="text-sm text-muted">
                Review {reviewIndex + 1} / {dueWords.length}
              </p>
              <p className="mt-6 text-4xl font-bold">{currentReview.word}</p>
              <p className="text-sm text-muted">{currentReview.pronunciation}</p>
              {showMeaning ? (
                <>
                  <p className="mt-4 text-lg">{currentReview.meaning}</p>
                  <p className="mt-2 text-sm italic text-muted">{currentReview.example}</p>
                  <div className="mt-6 flex justify-center gap-2">
                    <Button variant="secondary" onClick={() => review("difficult")} className="text-sm">
                      Difficult
                    </Button>
                    <Button variant="secondary" onClick={() => review("learning")} className="text-sm">
                      Learning
                    </Button>
                    <Button onClick={() => review("known")} className="text-sm">
                      Known
                    </Button>
                  </div>
                </>
              ) : (
                <Button onClick={() => setShowMeaning(true)} className="mt-6">
                  Show Meaning
                </Button>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-card-title">
          <BookOpen className="h-5 w-5 text-primary" />
          Daily Vocabulary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {data.vocabulary.map((v, i) => (
            <Card key={i} hover>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">{v.word}</span>
                <div className="flex items-center gap-2">
                  <SpeakButton text={v.language === "hindi" ? v.word : v.example} lang={v.language === "hindi" ? "hi-IN" : "en-US"} />
                  <Badge>{v.language}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted">{v.pronunciation}</p>
              <p className="mt-2">{v.meaning}</p>
              <p className="mt-2 text-sm italic text-muted">{v.example}</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-card-title">
          <Layers className="h-5 w-5 text-secondary" />
          Hindi Sentences
        </h2>
        <div className="space-y-3">
          {data.sentences.map((s, i) => (
            <Card key={i} className="!p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">
                  <HindiText roman={s.roman_hindi} devanagari={s.hindi_script} showDevanagari={devanagariPreferred} />
                </p>
                <SpeakButton text={s.hindi_script || s.roman_hindi} lang="hi-IN" />
              </div>
              {!devanagariPreferred && <p className="mt-1 text-secondary">{s.hindi_script}</p>}
              <p className="mt-2 text-sm text-muted">{s.english}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
