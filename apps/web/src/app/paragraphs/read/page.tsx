"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { api } from "@/lib/api";
import { VoiceRecorder } from "@/components/VoiceRecorder";
import { WordAlignmentView } from "@/components/WordAlignmentView";
import type { ParagraphReadResult, VoiceAnalytics } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/primitives";

export default function ParagraphReadPage() {
  const [sourceText, setSourceText] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParagraphReadResult | null>(null);

  useEffect(() => {
    api.getDailyParagraph().then((data) => {
      const p = data.paragraph as { content?: string; title?: string } | null;
      if (p?.content) setSourceText(p.content);
    });
  }, []);

  const handleRecording = async (blob: Blob, analytics: VoiceAnalytics) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("sourceText", sourceText);
      formData.append("sourceLanguage", "roman_hindi");
      formData.append("analytics", JSON.stringify(analytics));
      formData.append("audio", blob, "recording.webm");

      const res = await api.submitParagraphRead(formData);
      setResult(res);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageBack href="/" />
      <PageHeader
        title="Paragraph Reading Lab"
        subtitle="Read aloud — see wrong words, grammar, and voice report"
        badge="Reading"
      />

      <Card>
        <h2 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
          <BookOpen className="h-5 w-5 text-primary" />
          Paragraph to Read
        </h2>
        <textarea
          className="input min-h-[120px] text-lg leading-relaxed"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
        />
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold text-foreground">What you spoke (optional)</h2>
        <p className="mb-2 text-sm text-muted">Leave blank — audio will be auto-transcribed with Whisper</p>
        <textarea
          className="input min-h-[80px]"
          placeholder="Optional: type your spoken words here for comparison"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />
      </Card>

      <VoiceRecorder onComplete={handleRecording} label="Read Paragraph & Record" />

      {loading && <p className="text-sm text-muted">Analyzing your reading...</p>}

      {result && (
        <WordAlignmentView
          alignment={result.alignment}
          stats={{
            correctWords: result.correctWords,
            wrongWords: result.wrongWords,
            skippedWords: result.skippedWords,
            extraWords: result.extraWords,
            pronunciationAccuracyPct: result.pronunciationAccuracyPct,
            fillerWordCount: result.fillerWordCount,
            wordsPerMinute: result.wordsPerMinute,
            loudnessScore: result.voiceAnalytics?.loudnessScore,
          }}
        />
      )}
    </div>
  );
}
