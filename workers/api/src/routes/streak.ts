import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { getStreakInfo, useStreakFreeze } from "../services/streak";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/", async (c) => {
  const info = await getStreakInfo(c.env.DB, c.get("userId"));
  return c.json(info);
});

app.post("/freeze", async (c) => {
  const result = await useStreakFreeze(c.env.DB, c.get("userId"));
  if (!result.ok) return c.json(result, 400);
  return c.json(result);
});

export default app;
