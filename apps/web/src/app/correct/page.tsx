"use client";

import { useCallback, useEffect, useState } from "react";
import { History, Languages } from "lucide-react";
import { api } from "@/lib/api";
import { CorrectionCard } from "@/components/CorrectionCard";
import type {
  CorrectionHistoryItem,
  EnglishCorrection,
  RomanHindiCorrection,
} from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type Tab = "fix" | "history";

const TYPE_LABELS: Record<string, string> = {
  roman_hindi: "Roman Hindi",
  english: "English",
  bulk: "Bulk",
};

export default function CorrectPage() {
  const [tab, setTab] = useState<Tab>("fix");
  const [mode, setMode] = useState<"roman_hindi" | "english">("roman_hindi");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RomanHindiCorrection | EnglishCorrection | null>(null);

  const [history, setHistory] = useState<CorrectionHistoryItem[]>([]);
  const [historyStats, setHistoryStats] = useState<Record<string, number>>({});
  const [historyFilter, setHistoryFilter] = useState("all");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const loadHistory = useCallback(() => {
    setHistoryLoading(true);
    api
      .getCorrectionHistory(historyFilter)
      .then((d) => {
        setHistory(d.items);
        setHistoryStats(d.stats);
      })
      .catch(() => setHistory([]))
      .finally(() => setHistoryLoading(false));
  }, [historyFilter]);

  useEffect(() => {
    if (tab === "history") loadHistory();
  }, [tab, loadHistory]);

  const submit = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res =
        mode === "roman_hindi" ? await api.correctRomanHindi(text) : await api.correctEnglish(text);
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
        title="Grammar Fix"
        subtitle="Correct sentences and review your correction history"
        badge="Tools"
      />

      <div className="flex rounded-full bg-surface-muted p-1 dark:bg-gray-800 w-fit">
        {(
          [
            { id: "fix" as const, label: "Fix text", icon: Languages },
            { id: "history" as const, label: "History", icon: History },
          ] as const
        ).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
              tab === id ? "bg-primary text-white shadow-sm" : "text-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "fix" ? (
        <>
          <div className="flex gap-2">
            <Button variant={mode === "roman_hindi" ? "primary" : "secondary"} onClick={() => setMode("roman_hindi")}>
              Roman Hindi
            </Button>
            <Button variant={mode === "english" ? "primary" : "secondary"} onClick={() => setMode("english")}>
              English
            </Button>
          </div>

          <textarea
            className="input min-h-[120px]"
            placeholder={
              mode === "roman_hindi"
                ? "Type Roman Hindi... e.g. main ghar pohach gya hu"
                : "Type English... e.g. I am go to office today"
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <Button onClick={submit} disabled={loading || !text.trim()}>
            {loading ? "Correcting..." : "Correct"}
          </Button>

          {result && <CorrectionCard result={result} type={mode} />}
        </>
      ) : (
        <div className="space-y-4">
          {Object.keys(historyStats).length > 0 && (
            <div className="flex flex-wrap gap-2">
              <FilterChip active={historyFilter === "all"} onClick={() => setHistoryFilter("all")} label="All" />
              {Object.entries(historyStats).map(([type, count]) => (
                <FilterChip
                  key={type}
                  active={historyFilter === type}
                  onClick={() => setHistoryFilter(type)}
                  label={`${TYPE_LABELS[type] ?? type} (${count})`}
                />
              ))}
            </div>
          )}

          {historyLoading ? (
            <Skeleton className="h-48" />
          ) : history.length === 0 ? (
            <Card className="text-center text-muted">
              No corrections yet. Fix a sentence on the Fix tab — it will appear here.
            </Card>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <Card key={item.id} className="!p-4">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap gap-2">
                          <Badge variant="secondary">{TYPE_LABELS[item.type] ?? item.type}</Badge>
                          <span className="text-xs text-muted">{item.createdAt.slice(0, 16).replace("T", " ")}</span>
                          {item.mistakeCount > 0 && (
                            <Badge variant="warning">{item.mistakeCount} fixes</Badge>
                          )}
                        </div>
                        <p className="line-clamp-2 text-sm text-foreground">{item.inputText}</p>
                      </div>
                    </div>
                  </button>
                  {expandedId === item.id && item.correctedPreview && (
                    <div className="mt-3 border-t border-surface-border pt-3 dark:border-gray-800">
                      <p className="mb-1 text-xs font-semibold text-muted">Corrected</p>
                      <p className="text-sm text-success">{item.correctedPreview}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs font-medium transition",
        active ? "bg-primary text-white" : "bg-surface-muted text-muted hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
