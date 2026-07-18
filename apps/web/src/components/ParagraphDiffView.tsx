import type { DiffToken } from "@speak-coach/shared";

export function ParagraphDiffView({
  original,
  corrected,
  diff,
  stats,
}: {
  original: string;
  corrected: string;
  diff: DiffToken[];
  stats: {
    totalWords: number;
    mistakeCount: number;
    accuracyPct: number;
    spellingErrors: number;
    grammarErrors: number;
    romanHindiErrors: number;
  };
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total Words" value={stats.totalWords} />
        <StatCard label="Mistakes" value={stats.mistakeCount} warn />
        <StatCard label="Accuracy" value={`${stats.accuracyPct}%`} good />
        <StatCard label="Roman Hindi Errors" value={stats.romanHindiErrors} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="mb-2 font-semibold text-red-700">Your Paragraph</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{original}</p>
        </div>
        <div className="card">
          <h3 className="mb-2 font-semibold text-green-700">Corrected Paragraph</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{corrected}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-3 font-semibold">Word-by-Word Diff</h3>
        <div className="flex flex-wrap gap-1">
          {diff.map((d, i) => (
            <span
              key={i}
              className={`rounded px-1.5 py-0.5 text-sm ${
                d.status === "same"
                  ? "bg-slate-100"
                  : d.status === "wrong"
                    ? "bg-red-100 text-red-800 line-through"
                    : d.status === "missing"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-green-100 text-green-800"
              }`}
              title={d.fix ? `→ ${d.fix}` : undefined}
            >
              {d.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  warn,
  good,
}: {
  label: string;
  value: string | number;
  warn?: boolean;
  good?: boolean;
}) {
  return (
    <div className="card text-center">
      <p className="text-sm text-slate-500">{label}</p>
      <p
        className={`text-2xl font-bold ${
          warn ? "text-red-600" : good ? "text-green-600" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
