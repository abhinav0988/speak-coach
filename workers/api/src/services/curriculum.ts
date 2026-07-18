import { getGeneratedCurriculum } from "@speak-coach/shared/curriculum";

export async function getDayNumber(db: D1Database, userId: string): Promise<number> {
  const user = await db.prepare(`SELECT start_date FROM users WHERE id = ?`)
    .bind(userId)
    .first<{
      start_date: string;
    }>();
  const startDate = user?.start_date ? new Date(user.start_date) : new Date();
  return Math.floor((Date.now() - startDate.getTime()) / 86400000) + 1;
}

export async function getDaySentences(db: D1Database, dayNumber: number) {
  const rows = await db.prepare(`SELECT * FROM daily_sentences WHERE day_number = ?`)
    .bind(dayNumber)
    .all();

  if ((rows.results ?? []).length >= 10) return rows.results ?? [];

  const generated = getGeneratedCurriculum(dayNumber);
  return generated.sentences.map((s, i) => ({
    id: `gen-s-${dayNumber}-${i}`,
    day_number: dayNumber,
    roman_hindi: s.roman_hindi,
    hindi_script: s.hindi_script,
    english: s.english,
  }));
}

export async function getDayVocabulary(db: D1Database, dayNumber: number) {
  const rows = await db.prepare(`SELECT * FROM vocabulary WHERE day_number = ?`)
    .bind(dayNumber)
    .all();

  if ((rows.results ?? []).length >= 10) return rows.results ?? [];

  return getGeneratedCurriculum(dayNumber).vocabulary;
}

export async function getDayParagraph(db: D1Database, dayNumber: number) {
  const row = await db.prepare(`SELECT * FROM daily_paragraphs WHERE day_number = ?`)
    .bind(dayNumber)
    .first();

  if (row) return row;

  return getGeneratedCurriculum(dayNumber).paragraph;
}
