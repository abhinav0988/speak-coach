import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { nowIso } from "../utils";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const rows = await c.env.DB.prepare(
    `SELECT drill_id, completed_at, loudness_score, clarity_score
     FROM sound_gym_progress WHERE user_id = ? ORDER BY completed_at ASC`
  )
    .bind(userId)
    .all();

  const completed = (rows.results ?? []).map((r) => ({
    drillId: String(r.drill_id),
    completedAt: String(r.completed_at),
    loudnessScore: r.loudness_score != null ? Number(r.loudness_score) : null,
    clarityScore: r.clarity_score != null ? Number(r.clarity_score) : null,
  }));

  return c.json({
    completed,
    completedIds: completed.map((d) => d.drillId),
    totalCompleted: completed.length,
  });
});

app.post("/complete", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{
    drillId: string;
    loudnessScore?: number;
    clarityScore?: number;
  }>();

  if (!body.drillId?.trim()) return c.json({ error: "drillId required" }, 400);

  const now = nowIso();
  await c.env.DB.prepare(
    `INSERT INTO sound_gym_progress (user_id, drill_id, completed_at, loudness_score, clarity_score)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(user_id, drill_id) DO UPDATE SET
       completed_at = excluded.completed_at,
       loudness_score = excluded.loudness_score,
       clarity_score = excluded.clarity_score`
  )
    .bind(userId, body.drillId, now, body.loudnessScore ?? null, body.clarityScore ?? null)
    .run();

  const rows = await c.env.DB.prepare(
    `SELECT drill_id FROM sound_gym_progress WHERE user_id = ?`
  )
    .bind(userId)
    .all();

  return c.json({
    ok: true,
    completedIds: (rows.results ?? []).map((r) => String(r.drill_id)),
    totalCompleted: rows.results?.length ?? 0,
  });
});

export default app;
