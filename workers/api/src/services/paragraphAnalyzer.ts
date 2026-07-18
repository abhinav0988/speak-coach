import type { ParagraphWriteResult } from "@speak-coach/shared";
import {
  applyRomanHindiRules,
  buildDiff,
  loadMistakeRules,
  updateMistakeCounts,
} from "./romanHindi";
import { correctEnglishSync } from "./englishFix";
import { countWords, createId, nowIso } from "../utils";

export async function analyzeParagraph(
  db: D1Database,
  input: { text: string; language: "english" | "roman_hindi"; sessionId?: string }
): Promise<ParagraphWriteResult> {
  const rules = await loadMistakeRules(db);
  const totalWords = countWords(input.text);
  const now = nowIso();
  const id = createId();

  if (input.language === "roman_hindi") {
    const { corrected, mistakes } = applyRomanHindiRules(input.text, rules);
    const romanMistakes = mistakes.filter((m) => m.category === "roman_hindi");
    const diff = buildDiff(input.text, corrected);
    const mistakeCount = romanMistakes.length;
    const accuracyPct = totalWords > 0 ? ((totalWords - mistakeCount) / totalWords) * 100 : 100;

    const repeatedMistakes = [
      ...new Set(romanMistakes.map((m) => m.wrong.toLowerCase())),
    ];

    await updateMistakeCounts(db, romanMistakes, now);
    await db
      .prepare(
        `INSERT INTO paragraph_writes (
          id, session_id, language, input_text, corrected_text,
          total_words, mistake_count, spelling_errors, grammar_errors,
          roman_hindi_errors, accuracy_pct, mistakes_json, diff_json, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        input.sessionId ?? null,
        input.language,
        input.text,
        corrected,
        totalWords,
        mistakeCount,
        romanMistakes.length,
        accuracyPct,
        JSON.stringify(romanMistakes),
        JSON.stringify(diff),
        now
      )
      .run();

    return {
      id,
      totalWords,
      mistakeCount,
      spellingErrors: 0,
      grammarErrors: 0,
      romanHindiErrors: romanMistakes.length,
      accuracyPct: Math.round(accuracyPct * 10) / 10,
      repeatedMistakes,
      mistakes: romanMistakes,
      correctedText: corrected,
      diff,
    };
  }

  const result = correctEnglishSync(input.text);
  const grammarMistakes = result.mistakes;
  const mistakeCount = grammarMistakes.length;
  const accuracyPct = totalWords > 0 ? ((totalWords - mistakeCount) / totalWords) * 100 : 100;

  await updateMistakeCounts(db, grammarMistakes, now);
  await db
    .prepare(
      `INSERT INTO paragraph_writes (
        id, session_id, language, input_text, corrected_text,
        total_words, mistake_count, spelling_errors, grammar_errors,
        roman_hindi_errors, accuracy_pct, mistakes_json, diff_json, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?, ?, ?, ?)`
    )
    .bind(
      id,
      input.sessionId ?? null,
      input.language,
      input.text,
      result.corrected,
      totalWords,
      mistakeCount,
      grammarMistakes.length,
      accuracyPct,
      JSON.stringify(grammarMistakes),
      JSON.stringify(buildDiff(input.text, result.corrected)),
      now
    )
    .run();

  return {
    id,
    totalWords,
    mistakeCount,
    spellingErrors: 0,
    grammarErrors: grammarMistakes.length,
    romanHindiErrors: 0,
    accuracyPct: Math.round(accuracyPct * 10) / 10,
    repeatedMistakes: grammarMistakes.map((m) => m.wrong),
    mistakes: grammarMistakes,
    correctedText: result.corrected,
    diff: buildDiff(input.text, result.corrected),
  };
}
