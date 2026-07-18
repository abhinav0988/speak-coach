export function computeFluencyScore(scores: {
  romanHindiAccuracy?: number;
  englishGrammar?: number;
  pronunciationAccuracy?: number;
  loudnessScore?: number;
  clarityScore?: number;
  fillerRate?: number;
  streakDays?: number;
}): number {
  const roman = scores.romanHindiAccuracy ?? 70;
  const english = scores.englishGrammar ?? 70;
  const pronunciation = scores.pronunciationAccuracy ?? 70;
  const loudness = scores.loudnessScore ?? 60;
  const clarity = scores.clarityScore ?? 65;
  const fillers = 100 - (scores.fillerRate ?? 10);
  const streak = Math.min((scores.streakDays ?? 0) * 3, 30);

  const raw =
    roman * 0.2 +
    english * 0.15 +
    pronunciation * 0.2 +
    loudness * 0.15 +
    clarity * 0.1 +
    fillers * 0.1 +
    streak * 0.1;

  return Math.round(Math.min(100, Math.max(0, raw)));
}

export function loudnessFromDbfs(dbfs: number): number {
  return Math.round(Math.min(100, Math.max(0, ((dbfs - -30) / (-12 - -30)) * 100)));
}
