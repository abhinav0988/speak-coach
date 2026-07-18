/**
 * Generates seed_phase15.sql for curriculum days 8-90 from @speak-coach/shared/curriculum
 * Run: npm run db:seed:generate -w @speak-coach/api
 */
import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getGeneratedCurriculum } from "@speak-coach/shared/curriculum";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../src/db/seed_phase15.sql");

function esc(s: string): string {
  return s.replace(/'/g, "''");
}

const lines: string[] = [
  "-- Phase 15: auto-generated curriculum seed days 8-90",
  "-- Regenerate: npm run db:seed:generate -w @speak-coach/api",
  "",
];

for (let day = 8; day <= 90; day++) {
  const curriculum = getGeneratedCurriculum(day);

  lines.push(`-- Day ${day}: ${curriculum.theme}`);
  const sentenceValues = curriculum.sentences
    .map(
      (s, i) =>
        `  ('s${day}_${i}', ${day}, '${esc(s.roman_hindi)}', '${esc(s.hindi_script)}', '${esc(s.english)}')`
    )
    .join(",\n");
  lines.push(`INSERT OR IGNORE INTO daily_sentences (id, day_number, roman_hindi, hindi_script, english) VALUES\n${sentenceValues};`);
  lines.push("");

  const vocabValues = curriculum.vocabulary
    .map(
      (v, i) =>
        `  ('v${day}_${i}', '${esc(v.word)}', '${v.language}', '${esc(v.meaning)}', '${esc(v.pronunciation)}', '${esc(v.example)}', ${day})`
    )
    .join(",\n");
  lines.push(
    `INSERT OR IGNORE INTO vocabulary (id, word, language, meaning, pronunciation, example, day_number) VALUES\n${vocabValues};`
  );
  lines.push("");

  const p = curriculum.paragraph;
  lines.push(
    `INSERT OR IGNORE INTO daily_paragraphs (id, day_number, language, title, content, hindi_script, difficulty) VALUES ('p${day}', ${day}, 'roman_hindi', '${esc(p.title)}', '${esc(p.content)}', '${esc(p.hindi_script)}', '${p.difficulty}');`
  );
  lines.push("");
}

writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Wrote ${outPath} (${lines.length} lines, days 8-90)`);
