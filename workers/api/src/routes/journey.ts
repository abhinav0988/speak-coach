import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";

const MILESTONES = [7, 30, 60, 90];

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const user = await c.env.DB.prepare(`SELECT start_date, target_days FROM users WHERE id = ?`)
    .bind(userId)
    .first<{
      start_date: string;
      target_days: number;
    }>();

  const startDate = user?.start_date ? new Date(user.start_date) : new Date();
  const dayNumber = Math.floor((Date.now() - startDate.getTime()) / 86400000) + 1;
  const targetDays = user?.target_days ?? 90;

  const sessions = await c.env.DB.prepare(
    `SELECT day_number, date, completed_steps FROM sessions
     WHERE user_id = ? ORDER BY day_number`
  )
    .bind(userId)
    .all();

  const sessionMap = new Map(
    (sessions.results ?? []).map((s) => [Number(s.day_number), s])
  );

  const days = Array.from({ length: targetDays }, (_, i) => {
    const day = i + 1;
    const session = sessionMap.get(day);
    const date = new Date(startDate.getTime() + i * 86400000).toISOString().slice(0, 10);
    const isMilestone = MILESTONES.includes(day);
    const completed = session ? Number(session.completed_steps) >= 10 : false;
    const partial = session ? Number(session.completed_steps) > 0 && !completed : false;

    return {
      day,
      date,
      status: completed ? "completed" : partial ? "partial" : day <= dayNumber ? "missed" : "upcoming",
      isMilestone,
      milestoneLabel: day === 7 ? "Week 1" : day === 30 ? "Month 1" : day === 60 ? "Month 2" : day === 90 ? "Graduation" : null,
      completedSteps: session ? Number(session.completed_steps) : 0,
    };
  });

  const completedDays = days.filter((d) => d.status === "completed").length;
  const progressPct = Math.round((completedDays / targetDays) * 100);

  return c.json({
    dayNumber,
    targetDays,
    progressPct,
    completedDays,
    currentMilestone: MILESTONES.find((m) => dayNumber < m) ?? 90,
    days: days.slice(Math.max(0, dayNumber - 14), dayNumber + 14),
    milestones: MILESTONES.map((m) => ({
      day: m,
      label: m === 7 ? "Week 1" : m === 30 ? "Month 1" : m === 60 ? "Month 2" : "Graduation",
      reached: dayNumber >= m,
      completed: sessionMap.get(m) ? Number(sessionMap.get(m)!.completed_steps) >= 10 : false,
    })),
  });
});

export default app;
