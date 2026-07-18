interface InsightInput {
  sessions: number;
  corrections: number;
  recordings: number;
  topMistake: string;
}

const FALLBACK = [
  "Keep practicing daily — even 10 minutes builds fluency.",
  "Focus on speaking louder and finishing every word clearly.",
  "Review your top Roman Hindi mistakes before each session.",
];

export async function generateInsights(ai: Ai, stats: InsightInput): Promise<string[]> {
  const prompt = `You are a speaking coach. Based on these student stats, give exactly 3 short actionable insights (one sentence each):
- Sessions completed: ${stats.sessions}
- Corrections made: ${stats.corrections}
- Voice recordings: ${stats.recordings}
- Top repeated mistake: ${stats.topMistake}

Reply as a JSON array of 3 strings only, no markdown.`;

  try {
    const response = await ai.run("@cf/meta/llama-3.1-8b-instruct" as keyof AiModels, {
      messages: [{ role: "user", content: prompt }],
      max_tokens: 256,
    });

    const content =
      typeof response === "object" && response !== null && "response" in response
        ? String((response as { response: string }).response)
        : String(response);

    const match = content.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]) as string[];
      if (Array.isArray(parsed) && parsed.length >= 3) return parsed.slice(0, 3);
    }
  } catch {
    // fallback below
  }

  return FALLBACK;
}
