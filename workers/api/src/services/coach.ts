import { createId, nowIso } from "../utils";

const COACH_SYSTEM = `You are a patient, encouraging English and Hindi speaking coach. The student is learning both languages and writes Roman Hindi (Hindi in English letters).

Your role:
- Help with pronunciation, grammar, Roman Hindi spelling, and confidence
- Correct mistakes gently with examples
- Mix simple English in explanations
- Give short, practical answers (2-4 sentences unless asked for more)
- Encourage them to speak louder and more clearly
- When they write Roman Hindi, show corrected Roman Hindi + Hindi script when possible

Common Roman Hindi fixes: hu→hoon, nhi→nahi, gye→gaye, pohach→pahunch, rha→raha, kr→kar, bajah→wajah`;

export interface CoachMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export async function chatWithCoach(
  ai: Ai,
  messages: CoachMessage[],
  userMessage: string
): Promise<string> {
  const history = messages
    .slice(-10)
    .map((m) => `${m.role === "user" ? "Student" : "Coach"}: ${m.content}`)
    .join("\n");

  const prompt = `${COACH_SYSTEM}

Conversation so far:
${history}

Student: ${userMessage}

Coach (reply helpfully, correct any Roman Hindi or English mistakes in their message):`;

  try {
    const response = await ai.run("@cf/meta/llama-3.1-8b-instruct" as keyof AiModels, {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 512,
    });

    const content =
      typeof response === "object" && response !== null && "response" in response
        ? String((response as { response: string }).response)
        : String(response);

    return content.trim() || getFallbackReply(userMessage);
  } catch {
    return getFallbackReply(userMessage);
  }
}

function getFallbackReply(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("nhi") || lower.includes("hu ") || lower.includes("gye")) {
    return "Good try! Remember: nhi → nahi, hu → hoon, gye → gaye. Write your sentence again and I will help you fix it.";
  }
  if (lower.includes("loud") || lower.includes("soft") || lower.includes("voice")) {
    return "Speak from your belly, not your throat. Open your mouth on vowels and speak 20% slower. Try saying: 'Main spasht bolunga' three times loudly.";
  }
  return "Great question! Keep practicing daily. Try the Shadowing or Sound Gym exercises. What would you like to work on — English, Hindi, or pronunciation?";
}

export async function saveCoachSession(
  db: D1Database,
  sessionId: string | null,
  messages: CoachMessage[]
): Promise<string> {
  const now = nowIso();
  const id = sessionId ?? createId();
  const title = messages.find((m) => m.role === "user")?.content.slice(0, 50) ?? "Coach Chat";

  const existing = sessionId
    ? await db.prepare(`SELECT id FROM coach_sessions WHERE id = ?`).bind(sessionId).first()
    : null;

  if (existing) {
    await db.prepare(`UPDATE coach_sessions SET messages_json = ?, updated_at = ? WHERE id = ?`)
      .bind(JSON.stringify(messages), now, id)
      .run();
  } else {
    await db.prepare(
      `INSERT INTO coach_sessions (id, title, messages_json, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`
    )
      .bind(id, title, JSON.stringify(messages), now, now)
      .run();
  }

  return id;
}

export async function loadCoachSession(
  db: D1Database,
  sessionId: string
): Promise<CoachMessage[]> {
  const row = await db.prepare(`SELECT messages_json FROM coach_sessions WHERE id = ?`)
    .bind(sessionId)
    .first<{ messages_json: string }>();
  if (!row) return [];
  return JSON.parse(row.messages_json) as CoachMessage[];
}
