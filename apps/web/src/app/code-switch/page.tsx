"use client";

import { useEffect, useState } from "react";
import { Languages, Lightbulb } from "lucide-react";
import { api } from "@/lib/api";
import type { CodeSwitchAnalysis, CodeSwitchLog, CodeSwitchStats } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Progress } from "@/components/ui/primitives";

export default function CodeSwitchPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<CodeSwitchAnalysis | null>(null);
  const [history, setHistory] = useState<CodeSwitchLog[]>([]);
  const [stats, setStats] = useState<CodeSwitchStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCodeSwitchHistory().then((d) => setHistory(d.logs)).catch(() => {});
    api.getCodeSwitchStats().then(setStats).catch(() => {});
  }, []);

  const analyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await api.analyzeCodeSwitch(text);
      setResult(res);
      const [h, s] = await Promise.all([api.getCodeSwitchHistory(), api.getCodeSwitchStats()]);
      setHistory(h.logs);
      setStats(s);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageBack href="/" />
      <PageHeader
        title="Code-Switch Tracker"
        subtitle="See how much you mix English and Hindi — Hinglish awareness"
        badge="Analysis"
      />

      {stats && stats.totalSamples > 0 && (
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat label="Samples" value={stats.totalSamples} />
          <Stat label="Avg English" value={`${stats.avgEnglishRatio}%`} />
          <Stat label="Avg Hindi" value={`${stats.avgHindiRatio}%`} />
          <Stat label="Mixed Score" value={`${stats.avgMixedScore}%`} />
        </div>
      )}

      <Card className="space-y-4">
        <textarea
          className="input min-h-[120px]"
          placeholder="Paste or type a sentence mixing English and Roman Hindi..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={analyze} disabled={loading || !text.trim()}>
          <Languages className="h-4 w-4" />
          {loading ? "Analyzing..." : "Analyze Mix"}
        </Button>
      </Card>

      {result && (
        <Card className="space-y-4">
          <h2 className="font-semibold text-foreground">Analysis</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Meter label="English" value={result.englishRatio} barClassName="bg-blue-500" />
            <Meter label="Hindi" value={result.hindiRatio} barClassName="bg-orange-500" />
            <Meter label="Mixed" value={result.mixedScore} barClassName="bg-purple-500" />
          </div>
          <p className="flex items-start gap-2 rounded-lg bg-primary/5 p-3 text-sm text-primary">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
            {result.tip}
          </p>
          {(result.englishWords.length > 0 || result.hindiWords.length > 0 || result.mixedWords.length > 0) && (
            <div className="space-y-3">
              {result.englishWords.length > 0 && (
                <WordTags label="English words" words={result.englishWords} className="bg-blue-500/10 text-blue-700 dark:text-blue-300" />
              )}
              {result.hindiWords.length > 0 && (
                <WordTags label="Hindi (Roman)" words={result.hindiWords} className="bg-orange-500/10 text-orange-700 dark:text-orange-300" />
              )}
              {result.mixedWords.length > 0 && (
                <WordTags label="Mixed / unclear" words={result.mixedWords} className="bg-purple-500/10 text-purple-700 dark:text-purple-300" />
              )}
            </div>
          )}
        </Card>
      )}

      {history.length > 0 && (
        <Card>
          <h2 className="mb-4 font-semibold text-foreground">Recent Samples</h2>
          <div className="space-y-3">
            {history.slice(0, 10).map((log) => (
              <div key={log.id} className="border-b border-surface-border pb-3 last:border-0 dark:border-gray-800">
                <p className="line-clamp-2 text-sm text-foreground">{log.textSample}</p>
                <p className="mt-1 text-xs text-muted">
                  EN {Math.round(log.englishRatio * 100)}% · HI {Math.round(log.hindiRatio * 100)}% · Mixed{" "}
                  {Math.round(log.mixedScore * 100)}%
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function Meter({
  label,
  value,
  barClassName,
}: {
  label: string;
  value: number;
  barClassName?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm text-muted">
        <span>{label}</span>
        <span className="font-medium text-foreground">{Math.round(value * 100)}%</span>
      </div>
      <Progress value={value * 100} barClassName={barClassName} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="text-center">
      <p className="text-sm text-muted">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
}

function WordTags({ label, words, className }: { label: string; words: string[]; className: string }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold text-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {words.map((w) => (
          <span key={w} className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
