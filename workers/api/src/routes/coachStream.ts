import { Hono } from "hono";
import type { Env } from "../env";
import { chatWithCoach, saveCoachSession, type CoachMessage } from "../services/coach";
import { nowIso } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.post("/stream", async (c) => {
  const body = await c.req.json<{ message: string; messages?: CoachMessage[]; sessionId?: string }>();
  if (!body.message?.trim()) return c.json({ error: "message required" }, 400);

  const prior = body.messages ?? [];
  const now = nowIso();
  const userMsg: CoachMessage = { role: "user", content: body.message.trim(), timestamp: now };
  const reply = await chatWithCoach(c.env.AI, prior, body.message.trim());
  const assistantMsg: CoachMessage = { role: "assistant", content: reply, timestamp: nowIso() };
  const sessionId = await saveCoachSession(c.env.DB, body.sessionId ?? null, [...prior, userMsg, assistantMsg]);

  const stream = new ReadableStream({
    start(controller) {
      const words = reply.split(" ");
      let i = 0;
      const interval = setInterval(() => {
        if (i < words.length) {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ token: words[i] + " " })}\n\n`));
          i++;
        } else {
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ done: true, full: reply, sessionId, messages: [...prior, userMsg, assistantMsg] })}\n\n`
            )
          );
          clearInterval(interval);
          controller.close();
        }
      }, 50);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
});

export default app;
