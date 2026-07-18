"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import type { BulkCorrectResult } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge } from "@/components/ui/primitives";

export default function WhatsAppPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulkCorrectResult | null>(null);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.bulkCorrect(text);
      setResult(res);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const lineCount = text.trim() ? text.trim().split("\n").filter(Boolean).length : 0;

  return (
    <div className="space-y-6">
      <PageBack href="/" />
      <PageHeader
        title="WhatsApp Bulk Correct"
        subtitle="Paste chat messages (one per line) — correct all Roman Hindi and English at once"
        badge="Correction"
      />

      <textarea
        className="input min-h-[200px] font-mono text-sm"
        placeholder={`Paste messages here, one per line:\n\nmain ghar pohach gya hu\nI am go to office today\nkya tumne khana khaya`}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <p className="text-sm text-muted">{lineCount} lines</p>

      <Button onClick={submit} disabled={loading || lineCount === 0}>
        {loading ? "Correcting..." : `Correct ${lineCount} Lines`}
      </Button>

      {result && (
        <div className="space-y-4">
          <Card className="flex items-center justify-between">
            <p className="font-semibold text-foreground">{result.summary}</p>
            <Badge variant="warning">{result.totalMistakes} mistakes</Badge>
          </Card>

          {result.lines.map((line) => (
            <Card key={line.lineNumber}>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted">Line {line.lineNumber}</span>
                <Badge variant="secondary">{line.language}</Badge>
                {line.mistakes.length > 0 && (
                  <Badge variant="warning">{line.mistakes.length} fixes</Badge>
                )}
              </div>

              {line.mistakes.length > 0 ? (
                <>
                  <p className="text-danger line-through">{line.original}</p>
                  <p className="mt-1 font-medium text-success">{line.corrected}</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted">
                    {line.mistakes.map((m, i) => (
                      <li key={i}>
                        {m.wrong} → {m.correct}
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  {line.original}
                </p>
              )}

              {line.hinglishNote && (
                <p className="mt-2 flex items-start gap-2 text-xs text-warning">
                  <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {line.hinglishNote}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
