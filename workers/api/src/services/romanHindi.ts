import type { DiffToken, MistakeItem } from "@speak-coach/shared";
import { DEFAULT_MISTAKE_RULES } from "@speak-coach/shared";

export async function loadMistakeRules(db: D1Database): Promise<Record<string, string>> {
  const rules = { ...DEFAULT_MISTAKE_RULES };
  const { results } = await db
    .prepare("SELECT wrong_form, correct_form FROM mistakes")
    .all<{ wrong_form: string; correct_form: string }>();
  for (const row of results ?? []) {
    rules[row.wrong_form.toLowerCase()] = row.correct_form;
  }
  return rules;
}

export function applyRomanHindiRules(text: string, rules: Record<string, string>): {
  corrected: string;
  mistakes: MistakeItem[];
} {
  const mistakes: MistakeItem[] = [];
  const words = text.split(/(\s+)/);
  const correctedWords = words.map((part) => {
    if (!part.trim()) return part;
    const lower = part.toLowerCase().replace(/[.,!?;:'"]/g, "");
    const punctuation = part.slice(lower.length);
    const rule = rules[lower];
    if (rule && rule !== part) {
      mistakes.push({
        wrong: part.trim(),
        correct: rule + punctuation,
        category: "roman_hindi",
        explanation: `"${lower}" should be "${rule}"`,
      });
      const isCapitalized = part[0] === part[0].toUpperCase();
      return (isCapitalized ? rule.charAt(0).toUpperCase() + rule.slice(1) : rule) + punctuation;
    }
    return part;
  });

  return { corrected: correctedWords.join(""), mistakes };
}

export function buildDiff(original: string, corrected: string): DiffToken[] {
  const origWords = original.trim().split(/\s+/);
  const corrWords = corrected.trim().split(/\s+/);
  const diff: DiffToken[] = [];
  const maxLen = Math.max(origWords.length, corrWords.length);

  for (let i = 0; i < maxLen; i++) {
    const o = origWords[i];
    const c = corrWords[i];
    if (o === undefined) {
      diff.push({ word: c, status: "added" });
    } else if (c === undefined) {
      diff.push({ word: o, status: "missing" });
    } else if (o.toLowerCase() === c.toLowerCase()) {
      diff.push({ word: o, status: "same" });
    } else {
      diff.push({ word: o, status: "wrong", fix: c });
    }
  }
  return diff;
}

export async function updateMistakeCounts(
  db: D1Database,
  mistakes: MistakeItem[],
  now: string
): Promise<void> {
  for (const m of mistakes) {
    const wrong = m.wrong.toLowerCase().replace(/[.,!?;:'"]/g, "");
    await db
      .prepare(
        `INSERT INTO mistakes (id, wrong_form, correct_form, category, repeat_count, last_seen_at)
         VALUES (?, ?, ?, ?, 1, ?)
         ON CONFLICT(wrong_form) DO UPDATE SET
           repeat_count = repeat_count + 1,
           last_seen_at = excluded.last_seen_at`
      )
      .bind(crypto.randomUUID(), wrong, m.correct, m.category, now)
      .run();
  }
}

export function correctRomanHindiSync(
  text: string,
  rules: Record<string, string>
): {
  myVersion: string;
  correctRomanHindi: string;
  hindiScript: string;
  englishMeaning: string;
  corrections: MistakeItem[];
} {
  const { corrected, mistakes } = applyRomanHindiRules(text, rules);
  const capitalized =
    corrected.charAt(0).toUpperCase() + corrected.slice(1);
  const withPunctuation = capitalized.endsWith("?") || capitalized.endsWith(".")
    ? capitalized
    : capitalized + (text.trim().endsWith("?") ? "?" : ".");

  return {
    myVersion: text,
    correctRomanHindi: withPunctuation,
    hindiScript: "(AI transliteration available when Workers AI is configured)",
    englishMeaning: "(AI translation available when Workers AI is configured)",
    corrections: mistakes,
  };
}

export async function enhanceWithAI(
  ai: Ai,
  text: string,
  type: "roman_hindi" | "english"
): Promise<{ hindiScript?: string; englishMeaning?: string; natural?: string; explanation?: string } | null> {
  try {
    const prompt =
      type === "roman_hindi"
        ? `You are a Hindi tutor. For this Roman Hindi text, return ONLY valid JSON with keys hindiScript (Devanagari), englishMeaning (English translation), natural (improved Roman Hindi). Text: "${text}"`
        : `You are an English tutor. For this text, return ONLY valid JSON with keys natural (native-sounding rewrite), explanation (brief grammar note). Text: "${text}"`;

    const response = await ai.run("@cf/meta/llama-3.1-8b-instruct" as keyof AiModels, {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
    });

    const content =
      typeof response === "object" && response !== null && "response" in response
        ? String((response as { response: string }).response)
        : String(response);

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as {
      hindiScript?: string;
      englishMeaning?: string;
      natural?: string;
      explanation?: string;
    };
  } catch {
    return null;
  }
}
