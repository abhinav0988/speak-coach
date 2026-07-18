import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { getDayNumber, getDaySentences } from "../services/curriculum";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const topMistakes = await c.env.DB.prepare(
    `SELECT wrong_form, correct_form, repeat_count FROM mistakes ORDER BY repeat_count DESC LIMIT 3`
  ).all();

  const todayRecording = await c.env.DB.prepare(
    `SELECT id, loudness_score, duration_sec FROM voice_recordings
     WHERE date(created_at) = date('now') ORDER BY created_at ASC LIMIT 1`
  ).first();

  const dayNumber = await getDayNumber(c.env.DB, c.get("userId"));
  const allSentences = await getDaySentences(c.env.DB, dayNumber);
  const reviewSentences = allSentences.slice(0, 3);

  const homework = await c.env.DB.prepare(
    `SELECT tasks_json, completed FROM homework ORDER BY created_at DESC LIMIT 1`
  ).first();

  return c.json({
    topMistakes: (topMistakes.results ?? []).map((m) => ({
      wrong: m.wrong_form,
      correct: m.correct_form,
      count: m.repeat_count,
    })),
    shortestRecording: todayRecording ?? null,
    reviewSentences,
    homework: homework
      ? { tasks: JSON.parse(String(homework.tasks_json)), completed: Boolean(homework.completed) }
      : null,
    steps: [
      "Review your top 3 mistakes (2 min)",
      "Replay today's shortest voice clip (1 min)",
      "Read 3 Hindi sentences aloud (2 min)",
      "Rate your confidence 1-10",
    ],
  });
});

export default app;
