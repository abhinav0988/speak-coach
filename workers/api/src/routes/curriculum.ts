import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { getCurriculumOverview } from "@speak-coach/shared/curriculum";
import { getDayNumber } from "../services/curriculum";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/overview", async (c) => {
  const dayNumber = await getDayNumber(c.env.DB, c.get("userId"));
  return c.json({
    dayNumber,
    targetDays: 90,
    weeks: getCurriculumOverview(),
  });
});

export default app;
