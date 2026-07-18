import { describe, expect, it } from "vitest";
import { generateVoiceTips, loudnessScore, rmsToDbfs } from "./voiceAnalytics";

describe("rmsToDbfs", () => {
  it("returns floor value for silence", () => {
    expect(rmsToDbfs(0)).toBe(-60);
  });

  it("returns 0 dBFS for full-scale signal", () => {
    expect(rmsToDbfs(1)).toBe(0);
  });
});

describe("loudnessScore", () => {
  it("clamps quiet audio to 0", () => {
    expect(loudnessScore(-40)).toBe(0);
  });

  it("clamps loud audio to 100", () => {
    expect(loudnessScore(0)).toBe(100);
  });
});

describe("generateVoiceTips", () => {
  it("advises to speak louder when too soft", () => {
    const tips = generateVoiceTips(-30, 150, 130);
    expect(tips.some((t) => /louder/i.test(t))).toBe(true);
  });

  it("advises to slow down when rushing", () => {
    const tips = generateVoiceTips(-15, 150, 190);
    expect(tips.some((t) => /slow down/i.test(t))).toBe(true);
  });

  it("gives positive feedback for good delivery", () => {
    const tips = generateVoiceTips(-15, 150, 130);
    expect(tips.some((t) => /good/i.test(t))).toBe(true);
  });
});
