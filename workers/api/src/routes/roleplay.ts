import { Hono } from "hono";
import type { Env } from "../env";
import { ROLEPLAY_SCENARIOS } from "@speak-coach/shared/content";
import { correctEnglishSync } from "../services/englishFix";
import { correctRomanHindiSync, loadMistakeRules } from "../services/romanHindi";
import { createId, nowIso } from "../utils";

const app = new Hono<{ Bindings: Env }>();

app.get("/scenarios", (c) => {
  return c.json({
    scenarios: ROLEPLAY_SCENARIOS.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      language: s.language,
      turnCount: s.turns.length,
    })),
  });
});

app.get("/scenarios/:id", (c) => {
  const scenario = ROLEPLAY_SCENARIOS.find((s) => s.id === c.req.param("id"));
  if (!scenario) return c.json({ error: "Scenario not found" }, 404);
  return c.json({ scenario });
});

app.post("/start", async (c) => {
  const body = await c.req.json<{ scenarioId: string }>();
  const scenario = ROLEPLAY_SCENARIOS.find((s) => s.id === body.scenarioId);
  if (!scenario) return c.json({ error: "Scenario not found" }, 404);

  const id = createId();
  const now = nowIso();
  const turns = [{ role: scenario.turns[0].role, text: scenario.turns[0].text, userReply: null }];

  await c.env.DB.prepare(
    `INSERT INTO roleplay_sessions (id, scenario, turns_json, completed, created_at) VALUES (?, ?, ?, 0, ?)`
  )
    .bind(id, scenario.id, JSON.stringify(turns), now)
    .run();

  return c.json({
    sessionId: id,
    scenario: { id: scenario.id, title: scenario.title, language: scenario.language },
    currentTurn: 0,
    prompt: scenario.turns[0],
    totalTurns: scenario.turns.length,
  });
});

app.post("/turn", async (c) => {
  const formData = await c.req.formData();
  const sessionId = String(formData.get("sessionId") ?? "");
  const turnIndex = Number(formData.get("turnIndex") ?? 0);
  const userReply = String(formData.get("reply") ?? "");
  const analyticsJson = formData.get("analytics") ? String(formData.get("analytics")) : null;

  const session = await c.env.DB.prepare(`SELECT * FROM roleplay_sessions WHERE id = ?`)
    .bind(sessionId)
    .first<{ scenario: string; turns_json: string }>();

  if (!session) return c.json({ error: "Session not found" }, 404);

  const scenario = ROLEPLAY_SCENARIOS.find((s) => s.id === session.scenario);
  if (!scenario) return c.json({ error: "Scenario not found" }, 404);

  const rules = await loadMistakeRules(c.env.DB);
  const correction =
    scenario.language === "roman_hindi"
      ? correctRomanHindiSync(userReply, rules)
      : correctEnglishSync(userReply);

  const analytics = analyticsJson ? JSON.parse(analyticsJson) : null;
  const voiceScore = analytics?.loudnessScore ?? 70;

  const turns = JSON.parse(session.turns_json) as Array<{
    role: string;
    text: string;
    userReply?: string | null;
    correction?: unknown;
    voiceScore?: number;
  }>;

  turns.push({
    role: "user",
    text: userReply,
    userReply,
    correction,
    voiceScore,
  });

  const nextIndex = turnIndex + 1;
  const completed = nextIndex >= scenario.turns.length;

  if (!completed) {
    turns.push({
      role: scenario.turns[nextIndex].role,
      text: scenario.turns[nextIndex].text,
    });
  }

  const loudnessScores = turns.filter((t) => t.voiceScore).map((t) => t.voiceScore!);
  const avgLoudness =
    loudnessScores.length > 0
      ? loudnessScores.reduce((a, b) => a + b, 0) / loudnessScores.length
      : voiceScore;

  await c.env.DB.prepare(
    `UPDATE roleplay_sessions SET turns_json = ?, avg_loudness_score = ?, completed = ? WHERE id = ?`
  )
    .bind(JSON.stringify(turns), avgLoudness, completed ? 1 : 0, sessionId)
    .run();

  let aiFeedback = "Good effort! Keep speaking clearly and confidently.";
  try {
    const prompt = `You are a friendly language coach. The student replied: "${userReply}" to: "${scenario.turns[turnIndex].text}". Give a short encouraging feedback in 1-2 sentences.`;
    const response = await c.env.AI.run("@cf/meta/llama-3.1-8b-instruct" as keyof AiModels, {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
    });
    const content =
      typeof response === "object" && response !== null && "response" in response
        ? String((response as { response: string }).response)
        : String(response);
    if (content.trim()) aiFeedback = content.trim();
  } catch {
    // use default feedback
  }

  return c.json({
    correction,
    voiceScore,
    aiFeedback,
    completed,
    nextTurn: completed ? null : scenario.turns[nextIndex],
    currentTurn: nextIndex,
    totalTurns: scenario.turns.length,
  });
});

export default app;
