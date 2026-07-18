export async function transcribeAudio(ai: Ai, audioBuffer: ArrayBuffer): Promise<string> {
  try {
    const result = await ai.run("@cf/openai/whisper" as keyof AiModels, {
      audio: [...new Uint8Array(audioBuffer)],
    });
    if (typeof result === "object" && result !== null && "text" in result) {
      return String((result as { text: string }).text).trim();
    }
    return String(result).trim();
  } catch {
    return "";
  }
}
