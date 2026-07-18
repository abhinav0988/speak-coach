import { Hono } from "hono";
import type { Env } from "../env";
import type { AppVariables } from "../services/sessions";
import { buildWeeklyReport, buildReportHtml, sendWeeklyReportEmail } from "../services/weeklyReport";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

app.get("/weekly", async (c) => {
  return c.json(await buildWeeklyReport(c.env.DB, c.get("userId")));
});

app.get("/weekly/html", async (c) => {
  const report = await buildWeeklyReport(c.env.DB, c.get("userId"));
  const html = buildReportHtml(report);
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});

app.post("/weekly/email", async (c) => {
  const result = await sendWeeklyReportEmail(c.env.DB, c.env, c.get("userId"));
  if (!result.ok) return c.json(result, 400);
  return c.json(result);
});

export default app;
