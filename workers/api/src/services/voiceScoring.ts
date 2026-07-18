import type { VoiceAnalytics } from "@speak-coach/shared";
import { countFillerWords } from "./wordAlignment";

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function pitchVarietyScore(samples: number[]): number {
  if (samples.length < 2) return 50;
  const mean = samples.reduce((a, b) => a + b, 0) / samples.length;
  const variance = samples.reduce((n, p) => n + (p - mean) ** 2, 0) / samples.length;
  const std = Math.sqrt(variance);
  const cv = mean > 0 ? std / mean : 0;
  return Math.round(Math.min(100, Math.max(20, cv * 200)));
}

export function scoreVoiceAnalytics(
  client: Partial<VoiceAnalytics> | null,
  transcript: string
): VoiceAnalytics {
  const speakingTimeMs = client?.speakingTimeMs ?? 0;
  const durationSec = Math.max(speakingTimeMs / 1000, 1);
  const wordCount = countWords(transcript);
  const paceWpm = wordCount > 0 ? Math.round(wordCount / (durationSec / 60)) : (client?.paceWpm ?? 0);
  const fillers = transcript ? countFillerWords(transcript) : (client?.fillerCount ?? 0);
  const loudness = Math.round(client?.loudnessScore ?? 60);

  let clarity = Math.round(client?.clarityScore ?? 0);
  if (clarity <= 0 || clarity === 45 || clarity === 75) {
    clarity = loudness;
    if (paceWpm > 0) {
      if (paceWpm < 80) clarity -= 10;
      else if (paceWpm > 180) clarity -= 8;
      else clarity += 5;
    }
    if (fillers > 0) clarity -= Math.min(20, fillers * 4);
    if (wordCount > 5) clarity += 5;
    clarity = Math.round(Math.min(100, Math.max(20, clarity)));
  }

  const pitchSamples = client?.pitchAvgHz ? [client.pitchAvgHz] : [];
  const pitchVariety = client?.pitchVarietyScore && client.pitchVarietyScore !== 50
    ? client.pitchVarietyScore
    : pitchVarietyScore(pitchSamples);

  return {
    loudnessScore: loudness,
    clarityScore: clarity,
    paceWpm,
    pitchAvgHz: client?.pitchAvgHz ?? 0,
    pitchVarietyScore: pitchVariety,
    fillerCount: fillers,
    speakingTimeMs,
    waveformSamples: client?.waveformSamples ?? [],
    sentences: client?.sentences ?? [],
  };
}
