"use client";

import { useState } from "react";
import { PenLine } from "lucide-react";
import { api } from "@/lib/api";
import { ParagraphDiffView } from "@/components/ParagraphDiffView";
import type { ParagraphWriteResult } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/primitives";

export default function ParagraphWritePage() {
  const [language, setLanguage] = useState<"english" | "roman_hindi">("roman_hindi");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParagraphWriteResult | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const submit = async () => {
    if (wordCount < 5) {
      alert("Write at least 5 words");
      return;
    }
    setLoading(true);
    try {
      const res = await api.analyzeParagraph(text, language);
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
        title="Paragraph Writing Lab"
        subtitle="Write a paragraph and see how many mistakes you made"
        badge="Writing"
      />

      <div className="flex gap-2">
        <Button
          variant={language === "roman_hindi" ? "primary" : "secondary"}
          onClick={() => setLanguage("roman_hindi")}
        >
          Roman Hindi
        </Button>
        <Button variant={language === "english" ? "primary" : "secondary"} onClick={() => setLanguage("english")}>
          English
        </Button>
      </div>

      <textarea
        className="input min-h-[200px]"
        placeholder="Write your paragraph here (50-300 words recommended)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p className="text-sm text-muted">{wordCount} words</p>

      <Button onClick={submit} disabled={loading}>
        <PenLine className="h-4 w-4" />
        {loading ? "Analyzing..." : "Submit & Compare"}
      </Button>

      {result && (
        <ParagraphDiffView
          original={text}
          corrected={result.correctedText}
          diff={result.diff}
          stats={{
            totalWords: result.totalWords,
            mistakeCount: result.mistakeCount,
            accuracyPct: result.accuracyPct,
            spellingErrors: result.spellingErrors,
            grammarErrors: result.grammarErrors,
            romanHindiErrors: result.romanHindiErrors,
          }}
        />
      )}
    </div>
  );
}
