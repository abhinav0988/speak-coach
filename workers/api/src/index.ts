import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import type { AppVariables } from "./services/sessions";
import dashboard from "./routes/dashboard";
import sessions from "./routes/sessions";
import corrections from "./routes/corrections";
import paragraphs from "./routes/paragraphs";
import voice from "./routes/voice";
import mistakes from "./routes/mistakes";
import vocabulary from "./routes/vocabulary";
import shadowing from "./routes/shadowing";
import roleplay from "./routes/roleplay";
import reports from "./routes/reports";
import journey from "./routes/journey";
import heatmap from "./routes/heatmap";
import practiceHeatmap from "./routes/practiceHeatmap";
import homework from "./routes/homework";
import journal from "./routes/journal";
import phrases from "./routes/phrases";
import exportRoutes from "./routes/export";
import nightReview from "./routes/night-review";
import coach from "./routes/coach";
import coachStream from "./routes/coachStream";
import coachWs from "./routes/coachWs";
import streak from "./routes/streak";
import leaderboard from "./routes/leaderboard";
import settings from "./routes/settings";
import codeSwitch from "./routes/codeSwitch";
import curriculum from "./routes/curriculum";
import health from "./routes/health";
import analytics from "./routes/analytics";
import push from "./routes/push";
import auth from "./routes/auth";
import profile from "./routes/profile";
import soundGym from "./routes/soundGym";
import { authMiddleware } from "./middleware/auth";
import { handleScheduled } from "./scheduled";
import {
  attachD1Budget,
  d1BudgetRetryAfterSec,
  isD1BudgetExemptPath,
} from "./lib/d1Budget";

const app = new Hono<{ Bindings: Env; Variables: AppVariables }>();

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://speak-coach.pages.dev",
  "https://speak-coach-3gw.pages.dev",
];

function isLocalDevOrigin(origin: string): boolean {
  try {
    const { hostname } = new URL(origin);
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (hostname.startsWith("192.168.") || hostname.startsWith("10.")) return true;
    return false;
  } catch {
    return false;
  }
}

function resolveCorsOrigin(origin: string | undefined): string | null {
  if (!origin) return null;
  if (ALLOWED_ORIGINS.includes(origin)) return origin;
  if (origin.endsWith(".pages.dev")) return origin;
  if (isLocalDevOrigin(origin)) return origin;
  return null;
}

app.use(
  "*",
  cors({
    origin: (origin) => resolveCorsOrigin(origin) ?? "",
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-CSRF-Token", "X-Turnstile-Token"],
    credentials: true,
    maxAge: 86400,
  })
);

app.use("/api/*", authMiddleware);

app.route("/api/health", health);
app.route("/api/auth", auth);
app.route("/api/dashboard", dashboard);
app.route("/api/sessions", sessions);
app.route("/api/correct", corrections);
app.route("/api/paragraphs", paragraphs);
app.route("/api/voice", voice);
app.route("/api/mistakes", mistakes);
app.route("/api/vocabulary", vocabulary);
app.route("/api/shadowing", shadowing);
app.route("/api/roleplay", roleplay);
app.route("/api/reports", reports);
app.route("/api/journey", journey);
app.route("/api/heatmap", heatmap);
app.route("/api/practice-heatmap", practiceHeatmap);
app.route("/api/homework", homework);
app.route("/api/journal", journal);
app.route("/api/phrases", phrases);
app.route("/api/export", exportRoutes);
app.route("/api/night-review", nightReview);
app.route("/api/coach", coach);
app.route("/api/coach", coachStream);
app.route("/api/coach", coachWs);
app.route("/api/streak", streak);
app.route("/api/leaderboard", leaderboard);
app.route("/api/settings", settings);
app.route("/api/code-switch", codeSwitch);
app.route("/api/curriculum", curriculum);
app.route("/api/analytics", analytics);
app.route("/api/push", push);
app.route("/api/profile", profile);
app.route("/api/sound-gym", soundGym);

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const path = new URL(request.url).pathname;
    if (isD1BudgetExemptPath(path)) return app.fetch(request, env, ctx);

    const budget = attachD1Budget(env);
    if (await budget.isOverHardLimit()) {
      return Response.json(
        { error: "Daily database read budget reached. Try again after UTC midnight." },
        { status: 503, headers: { "Retry-After": String(d1BudgetRetryAfterSec()) } },
      );
    }
    try {
      return await app.fetch(request, budget.env, ctx);
    } finally {
      ctx.waitUntil(budget.flush());
    }
  },
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const budget = attachD1Budget(env);
    if (await budget.isOverSoftLimit()) {
      console.warn("[d1-budget] soft limit reached — skipping speak scheduled jobs", {
        softLimit: budget.softLimit,
        usage: await budget.getUsage(),
      });
      return;
    }
    try {
      await handleScheduled(event, budget.env, ctx);
    } finally {
      await budget.flush();
    }
  },
};

export default worker;
export { CoachRoomDO } from "./durable/CoachRoomDO";
