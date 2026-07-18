import type { MistakeItem } from "@speak-coach/shared";
import { applyRomanHindiRules, loadMistakeRules } from "./romanHindi";
import { correctEnglishSync } from "./englishFix";

export interface BulkLineResult {
  lineNumber: number;
  original: string;
  corrected: string;
  language: "english" | "roman_hindi" | "hindi_script" | "mixed";
  mistakes: MistakeItem[];
  hinglishNote?: string;
}

function detectLanguage(line: string): "english" | "roman_hindi" {
  const hindiPatterns = /\b(main|mujhe|nahi|nhi|hai|hoon|hu|kya|aaj|ghar|kaam|bajah|gye|gya|rha)\b/i;
  const devanagari = /[\u0900-\u097F]/;
  if (devanagari.test(line)) return "roman_hindi";
  if (hindiPatterns.test(line)) return "roman_hindi";
  return "english";
}

function detectHinglish(line: string): string | undefined {
  const hasEnglish = /\b(the|is|are|was|have|will|can|my|your|today|work)\b/i.test(line);
  const hasHindi = /\b(main|mujhe|hai|hoon|nahi|kya|aaj|ghar)\b/i.test(line);
  if (hasEnglish && hasHindi) {
    return "Mixed Hinglish detected. For formal settings, pick one language. For casual chat, this is often natural.";
  }
  return undefined;
}

export async function bulkCorrect(
  db: D1Database,
  text: string
): Promise<{ lines: BulkLineResult[]; totalMistakes: number; summary: string }> {
  const rules = await loadMistakeRules(db);
  const rawLines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const lines: BulkLineResult[] = [];
  let totalMistakes = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const original = rawLines[i];
    const lang = detectLanguage(original);
    const hinglishNote = detectHinglish(original);

    if (lang === "roman_hindi") {
      const { corrected, mistakes } = applyRomanHindiRules(original, rules);
      totalMistakes += mistakes.length;
      lines.push({
        lineNumber: i + 1,
        original,
        corrected,
        language: /[\u0900-\u097F]/.test(original) ? "hindi_script" : "roman_hindi",
        mistakes,
        hinglishNote,
      });
    } else {
      const result = correctEnglishSync(original);
      totalMistakes += result.mistakes.length;
      lines.push({
        lineNumber: i + 1,
        original,
        corrected: result.corrected,
        language: "english",
        mistakes: result.mistakes,
        hinglishNote,
      });
    }
  }

  const summary = `Processed ${lines.length} lines. Found ${totalMistakes} issues total.`;
  return { lines, totalMistakes, summary };
}
