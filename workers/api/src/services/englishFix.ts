import type { EnglishCorrection, MistakeItem } from "@speak-coach/shared";
import { buildDiff } from "./romanHindi";

const ENGLISH_FIXES: Array<{ pattern: RegExp; fix: string; explanation: string }> = [
  { pattern: /\bi am go\b/gi, fix: "I am going", explanation: "Use present continuous for ongoing actions." },
  { pattern: /\bhe don't\b/gi, fix: "he doesn't", explanation: "Third person singular uses doesn't." },
  { pattern: /\bshe don't\b/gi, fix: "she doesn't", explanation: "Third person singular uses doesn't." },
  { pattern: /\bthey was\b/gi, fix: "they were", explanation: "They takes were, not was." },
  { pattern: /\bi have went\b/gi, fix: "I have gone", explanation: "Use past participle after have." },
  { pattern: /\bmore better\b/gi, fix: "better", explanation: "Better already means more good." },
  { pattern: /\bvery unique\b/gi, fix: "unique", explanation: "Unique is absolute — no very needed." },
];

export function correctEnglishSync(text: string): EnglishCorrection & { mistakes: MistakeItem[] } {
  let corrected = text.trim();
  const mistakes: MistakeItem[] = [];

  for (const rule of ENGLISH_FIXES) {
    if (rule.pattern.test(corrected)) {
      const before = corrected;
      corrected = corrected.replace(rule.pattern, rule.fix);
      mistakes.push({
        wrong: before.match(rule.pattern)?.[0] ?? "",
        correct: rule.fix,
        category: "grammar",
        explanation: rule.explanation,
      });
    }
  }

  if (corrected.length > 0) {
    corrected = corrected.charAt(0).toUpperCase() + corrected.slice(1);
    if (!/[.!?]$/.test(corrected)) corrected += ".";
  }

  const natural = corrected
    .replace(/\bI am\b/g, "I'm")
    .replace(/\bdo not\b/gi, "don't")
    .replace(/\bcannot\b/gi, "can't");

  return {
    original: text,
    corrected,
    natural,
    explanation:
      mistakes.length > 0
        ? mistakes.map((m) => m.explanation).filter(Boolean).join(" ")
        : "Your sentence looks good. Minor style improvements applied.",
    mistakes,
    diff: buildDiff(text, corrected),
  } as EnglishCorrection & { mistakes: MistakeItem[]; diff: ReturnType<typeof buildDiff> };
}
