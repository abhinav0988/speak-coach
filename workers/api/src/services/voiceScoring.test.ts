import { describe, expect, it } from "vitest";
import { scoreVoiceAnalytics } from "./voiceScoring";

describe("scoreVoiceAnalytics", () => {
  it("computes pace from transcript and speaking time", () => {
    const r = scoreVoiceAnalytics({ speakingTimeMs: 60_000 }, "one two three four five");
    expect(r.paceWpm).toBe(5);
  });

  it("counts filler words from the transcript", () => {
    const r = scoreVoiceAnalytics({ speakingTimeMs: 10_000 }, "um so like actually done");
    expect(r.fillerCount).toBe(3);
  });

  it("clamps derived clarity into range", () => {
    const r = scoreVoiceAnalytics({ speakingTimeMs: 5000, loudnessScore: 60 }, "hello world today");
    expect(r.clarityScore).toBeGreaterThanOrEqual(20);
    expect(r.clarityScore).toBeLessThanOrEqual(100);
  });

  it("falls back to defaults for empty client analytics", () => {
    const r = scoreVoiceAnalytics(null, "");
    expect(r.loudnessScore).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(r.waveformSamples)).toBe(true);
  });
});
