import { Hono } from "hono";
import type { Env } from "../env";
import { authenticateWsUpgrade } from "../middleware/auth";

const app = new Hono<{ Bindings: Env }>();

app.get("/ws", async (c) => {
  const wsToken = c.req.query("ws_token");
  const auth = await authenticateWsUpgrade(c.env, wsToken);
  if ("error" in auth) {
    return c.json({ error: auth.error }, auth.status as 401 | 503);
  }

  const sessionId = c.req.query("sessionId") ?? `ws-coach-${auth.userId}`;
  const id = c.env.COACH_ROOM.idFromName(sessionId);
  const stub = c.env.COACH_ROOM.get(id);
  return stub.fetch(c.req.raw);
});

export default app;
