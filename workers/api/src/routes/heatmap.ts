import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const days = 30;
  const start = new Date();
  start.setDate(start.getDate() - days);

  const corrections = await c.env.DB.prepare(
    `SELECT date(created_at) as date, COUNT(*) as count FROM corrections
     WHERE created_at >= ? GROUP BY date(created_at)`
  )
    .bind(start.toISOString())
    .all();

  const writes = await c.env.DB.prepare(
    `SELECT date(created_at) as date, AVG(accuracy_pct) as accuracy, SUM(mistake_count) as mistakes
     FROM paragraph_writes WHERE created_at >= ? GROUP BY date(created_at)`
  )
    .bind(start.toISOString())
    .all();

  const sessions = await c.env.DB.prepare(
    `SELECT date, completed_steps FROM sessions WHERE date >= ? AND user_id = ?`
  )
    .bind(start.toISOString().slice(0, 10), userId)
    .all();

  const correctionMap = new Map(
    (corrections.results ?? []).map((r) => [String(r.date), Number(r.count)])
  );
  const writeMap = new Map(
    (writes.results ?? []).map((r) => [String(r.date), { accuracy: Number(r.accuracy), mistakes: Number(r.mistakes) }])
  );
  const sessionMap = new Map(
    (sessions.results ?? []).map((r) => [String(r.date), Number(r.completed_steps)])
  );

  const heatmap = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const mistakeCount = writeMap.get(dateStr)?.mistakes ?? 0;
    const correctionCount = correctionMap.get(dateStr) ?? 0;
    const totalIssues = mistakeCount + correctionCount;
    const sessionDone = (sessionMap.get(dateStr) ?? 0) >= 10;

    let level: "none" | "low" | "medium" | "high" | "clean" = "none";
    if (sessionDone && totalIssues === 0) level = "clean";
    else if (totalIssues === 0) level = "none";
    else if (totalIssues <= 3) level = "low";
    else if (totalIssues <= 8) level = "medium";
    else level = "high";

    return {
      date: dateStr,
      level,
      mistakeCount: totalIssues,
      sessionDone,
      accuracy: writeMap.get(dateStr)?.accuracy ?? null,
    };
  });

  return c.json({ heatmap });
});

export default app;
