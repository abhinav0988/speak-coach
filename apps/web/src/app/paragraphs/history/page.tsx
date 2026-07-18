"use client";

import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, PenLine } from "lucide-react";
import { api } from "@/lib/api";
import type { ParagraphReadDetail, ParagraphWriteDetail } from "@speak-coach/shared";
import { ParagraphDiffView } from "@/components/ParagraphDiffView";
import { WordAlignmentView } from "@/components/WordAlignmentView";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Card, Badge, Skeleton, Button } from "@/components/ui/primitives";

type WriteRow = {
  id: string;
  language: string;
  mistake_count: number;
  accuracy_pct: number;
  created_at: string;
};

type ReadRow = {
  id: string;
  pronunciation_accuracy_pct: number;
  wrong_words: number;
  loudness_score: number;
  created_at: string;
};

export default function ParagraphHistoryPage() {
  const [writes, setWrites] = useState<WriteRow[]>([]);
  const [reads, setReads] = useState<ReadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWrite, setExpandedWrite] = useState<string | null>(null);
  const [expandedRead, setExpandedRead] = useState<string | null>(null);
  const [writeDetail, setWriteDetail] = useState<ParagraphWriteDetail | null>(null);
  const [readDetail, setReadDetail] = useState<ParagraphReadDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getParagraphWrites(), api.getParagraphReads()])
      .then(([w, r]) => {
        setWrites(w.writes as WriteRow[]);
        setReads(r.reads as ReadRow[]);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleWrite = async (id: string) => {
    if (expandedWrite === id) {
      setExpandedWrite(null);
      setWriteDetail(null);
      return;
    }
    setExpandedWrite(id);
    setDetailLoading(true);
    try {
      setWriteDetail(await api.getParagraphWrite(id));
    } finally {
      setDetailLoading(false);
    }
  };

  const toggleRead = async (id: string) => {
    if (expandedRead === id) {
      setExpandedRead(null);
      setReadDetail(null);
      return;
    }
    setExpandedRead(id);
    setDetailLoading(true);
    try {
      setReadDetail(await api.getParagraphRead(id));
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBack href="/" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageBack href="/" />
      <PageHeader
        title="Practice History"
        subtitle="Tap any attempt to see full text comparison and word alignment"
        badge="History"
      />

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
          <PenLine className="h-5 w-5 text-primary" />
          Writing Attempts
        </h2>
        {writes.length === 0 ? (
          <Card className="text-muted">No writing attempts yet.</Card>
        ) : (
          <div className="space-y-2">
            {writes.map((w) => (
              <div key={w.id}>
                <Card className="flex items-center justify-between">
                  <div>
                    <Badge variant="secondary">{w.language}</Badge>
                    <span className="ml-2 text-sm text-muted">{w.created_at?.slice(0, 10)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-success">{w.accuracy_pct}% accuracy</p>
                      <p className="text-sm text-danger">{w.mistake_count} mistakes</p>
                    </div>
                    <Button variant="ghost" onClick={() => toggleWrite(w.id)} aria-label="View comparison">
                      {expandedWrite === w.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </Card>
                {expandedWrite === w.id && (
                  <div className="mt-2">
                    {detailLoading && !writeDetail ? (
                      <Skeleton className="h-48" />
                    ) : writeDetail ? (
                      <ParagraphDiffView
                        original={writeDetail.inputText}
                        corrected={writeDetail.correctedText}
                        diff={writeDetail.diff}
                        stats={{
                          totalWords: writeDetail.totalWords,
                          mistakeCount: writeDetail.mistakeCount,
                          accuracyPct: writeDetail.accuracyPct,
                          spellingErrors: writeDetail.spellingErrors,
                          grammarErrors: writeDetail.grammarErrors,
                          romanHindiErrors: writeDetail.romanHindiErrors,
                        }}
                      />
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          Reading Attempts
        </h2>
        {reads.length === 0 ? (
          <Card className="text-muted">No reading attempts yet.</Card>
        ) : (
          <div className="space-y-2">
            {reads.map((r) => (
              <div key={r.id}>
                <Card className="flex items-center justify-between">
                  <span className="text-sm text-muted">{r.created_at?.slice(0, 10)}</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-foreground">{r.pronunciation_accuracy_pct}% pronunciation</p>
                      <p className="text-sm text-muted">
                        {r.wrong_words} wrong words · Loudness {r.loudness_score ?? "—"}
                      </p>
                    </div>
                    <Button variant="ghost" onClick={() => toggleRead(r.id)} aria-label="View alignment">
                      {expandedRead === r.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                </Card>
                {expandedRead === r.id && (
                  <div className="mt-2 space-y-4">
                    {detailLoading && !readDetail ? (
                      <Skeleton className="h-48" />
                    ) : readDetail ? (
                      <>
                        <Card className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="mb-1 text-xs font-semibold text-muted">Expected text</p>
                            <p className="text-sm text-foreground">{readDetail.sourceText}</p>
                          </div>
                          <div>
                            <p className="mb-1 text-xs font-semibold text-muted">What you said</p>
                            <p className="text-sm text-foreground">{readDetail.transcript}</p>
                          </div>
                        </Card>
                        <WordAlignmentView
                          alignment={readDetail.alignment}
                          stats={{
                            correctWords: readDetail.correctWords,
                            wrongWords: readDetail.wrongWords,
                            skippedWords: readDetail.skippedWords,
                            extraWords: readDetail.extraWords,
                            pronunciationAccuracyPct: readDetail.pronunciationAccuracyPct,
                            fillerWordCount: readDetail.fillerWordCount,
                            wordsPerMinute: readDetail.wordsPerMinute,
                            loudnessScore: readDetail.loudnessScore ?? undefined,
                          }}
                        />
                      </>
                    ) : null}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
