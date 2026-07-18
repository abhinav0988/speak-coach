import { Hono } from "hono";
import type { Env } from "../env";
import { chatWithCoach, loadCoachSession, saveCoachSession, type CoachMessage } from "../services/coach";
import { nowIso } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.get("/sessions", async (c) => {
  const rows = await c.env.DB.prepare(
    `SELECT id, title, updated_at FROM coach_sessions ORDER BY updated_at DESC LIMIT 20`
  ).all();
  return c.json({ sessions: rows.results ?? [] });
});

app.get("/sessions/:id", async (c) => {
  const messages = await loadCoachSession(c.env.DB, c.req.param("id"));
  return c.json({ messages });
});

app.post("/chat", async (c) => {
  const body = await c.req.json<{ message: string; sessionId?: string }>();
  if (!body.message?.trim()) return c.json({ error: "message required" }, 400);

  const prior = body.sessionId ? await loadCoachSession(c.env.DB, body.sessionId) : [];
  const now = nowIso();

  const userMsg: CoachMessage = { role: "user", content: body.message.trim(), timestamp: now };
  const reply = await chatWithCoach(c.env.AI, prior, body.message.trim());
  const assistantMsg: CoachMessage = { role: "assistant", content: reply, timestamp: nowIso() };

  const allMessages = [...prior, userMsg, assistantMsg];
  const sessionId = await saveCoachSession(c.env.DB, body.sessionId ?? null, allMessages);

  return c.json({
    sessionId,
    reply,
    messages: allMessages,
  });
});

export default app;
