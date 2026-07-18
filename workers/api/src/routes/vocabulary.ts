import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { todayDate } from "../utils";
import { getDayNumber, getDaySentences, getDayVocabulary } from "../services/curriculum";

const REVIEW_INTERVALS = [1, 3, 7, 14, 30];

function nextReviewDate(reviewCount: number): string {
  const days = REVIEW_INTERVALS[Math.min(reviewCount, REVIEW_INTERVALS.length - 1)];
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/today", async (c) => {
  const dayNumber = await getDayNumber(c.env.DB, c.get("userId"));
  const vocabulary = await getDayVocabulary(c.env.DB, dayNumber);
  const sentences = await getDaySentences(c.env.DB, dayNumber);

  return c.json({
    dayNumber,
    vocabulary,
    sentences,
  });
});

app.get("/due", async (c) => {
  const today = todayDate();
  const rows = await c.env.DB.prepare(
    `SELECT * FROM vocabulary WHERE next_review_at <= ? OR next_review_at IS NULL LIMIT 10`
  )
    .bind(today)
    .all();
  return c.json({ words: rows.results ?? [] });
});

app.post("/:id/review", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ quality: "known" | "learning" | "difficult" }>();

  const word = await c.env.DB.prepare(`SELECT review_count, ease_factor FROM vocabulary WHERE id = ?`)
    .bind(id)
    .first<{ review_count: number; ease_factor: number }>();

  if (!word) return c.json({ error: "Not found" }, 404);

  const reviewCount = (word.review_count ?? 0) + 1;
  let easeFactor = word.ease_factor ?? 2.5;
  if (body.quality === "known") easeFactor = Math.min(3.0, easeFactor + 0.1);
  if (body.quality === "difficult") easeFactor = Math.max(1.3, easeFactor - 0.2);

  const nextReview = nextReviewDate(reviewCount);

  await c.env.DB.prepare(
    `UPDATE vocabulary SET status = ?, review_count = ?, ease_factor = ?, last_reviewed_at = ?, next_review_at = ? WHERE id = ?`
  )
    .bind(body.quality, reviewCount, easeFactor, todayDate(), nextReview, id)
    .run();

  return c.json({ ok: true, nextReview, reviewCount });
});

export default app;
