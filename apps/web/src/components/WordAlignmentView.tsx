import type { WordAlignment } from "@speak-coach/shared";

export function WordAlignmentView({
  alignment,
  stats,
}: {
  alignment: WordAlignment[];
  stats: {
    correctWords: number;
    wrongWords: number;
    skippedWords: number;
    extraWords: number;
    pronunciationAccuracyPct: number;
    fillerWordCount: number;
    wordsPerMinute: number;
    loudnessScore?: number;
  };
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <MiniStat label="Correct" value={stats.correctWords} color="text-green-600" />
        <MiniStat label="Wrong" value={stats.wrongWords} color="text-red-600" />
        <MiniStat label="Skipped" value={stats.skippedWords} color="text-orange-600" />
        <MiniStat label="Extra" value={stats.extraWords} color="text-yellow-600" />
        <MiniStat label="Accuracy" value={`${stats.pronunciationAccuracyPct}%`} color="text-brand-600" />
        <MiniStat label="Loudness" value={stats.loudnessScore ?? "—"} color="text-purple-600" />
      </div>

      <div className="card">
        <h3 className="mb-3 font-semibold">Word Alignment</h3>
        <div className="mb-3 flex flex-wrap gap-3 text-xs">
          <Legend color="bg-green-100 text-green-800" label="Correct" />
          <Legend color="bg-red-100 text-red-800" label="Wrong" />
          <Legend color="bg-slate-200 text-slate-600" label="Skipped" />
          <Legend color="bg-yellow-100 text-yellow-800" label="Extra" />
        </div>
        <div className="flex flex-wrap gap-1">
          {alignment.map((a, i) => (
            <span
              key={i}
              className={`rounded px-2 py-1 text-sm ${
                a.status === "correct"
                  ? "bg-green-100 text-green-800"
                  : a.status === "wrong"
                    ? "bg-red-100 text-red-800"
                    : a.status === "skipped"
                      ? "bg-slate-200 text-slate-600 line-through"
                      : "bg-yellow-100 text-yellow-800"
              }`}
              title={a.spoken ? `You said: ${a.spoken}` : undefined}
            >
              {a.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="card text-center">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className={`rounded px-2 py-0.5 ${color}`}>{label}</span>
  );
}
