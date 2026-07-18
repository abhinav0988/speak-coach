import type { RomanHindiCorrection, EnglishCorrection } from "@speak-coach/shared";

export function CorrectionCard({
  result,
  type,
}: {
  result: RomanHindiCorrection | EnglishCorrection;
  type: "roman_hindi" | "english";
}) {
  if (type === "roman_hindi") {
    const r = result as RomanHindiCorrection;
    return (
      <div className="card space-y-4">
        <Section title="❌ My Version" content={r.myVersion} />
        <Section title="✅ Correct Roman Hindi" content={r.correctRomanHindi} highlight />
        <Section title="🇮🇳 Hindi Script" content={r.hindiScript} />
        <Section title="🇬🇧 English Meaning" content={r.englishMeaning} />
        {r.corrections.length > 0 && (
          <div>
            <h3 className="mb-2 font-semibold">💡 Corrections</h3>
            <ul className="space-y-1 text-sm text-slate-700">
              {r.corrections.map((c, i) => (
                <li key={i}>
                  <span className="text-red-600 line-through">{c.wrong}</span>
                  {" → "}
                  <span className="font-medium text-green-700">{c.correct}</span>
                  {c.explanation && <span className="text-slate-500"> — {c.explanation}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const e = result as EnglishCorrection;
  return (
    <div className="card space-y-4">
      <Section title="❌ Original" content={e.original} />
      <Section title="✅ Corrected" content={e.corrected} highlight />
      <Section title="🌟 Natural" content={e.natural} />
      <Section title="💡 Explanation" content={e.explanation} />
      {e.pronunciationNote && <Section title="🔊 Pronunciation" content={e.pronunciationNote} />}
    </div>
  );
}

function Section({
  title,
  content,
  highlight,
}: {
  title: string;
  content: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className={`rounded-xl p-3 text-sm ${highlight ? "bg-green-50 text-green-900" : "bg-slate-50"}`}>
        {content}
      </p>
    </div>
  );
}
