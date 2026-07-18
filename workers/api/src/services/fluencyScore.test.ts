import { describe, expect, it } from "vitest";
import { computeFluencyScore, loudnessFromDbfs } from "./fluencyScore";

describe("computeFluencyScore", () => {
  it("returns a value within 0–100", () => {
    const s = computeFluencyScore({});
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(100);
  });

  it("rewards high sub-scores", () => {
    const high = computeFluencyScore({
      romanHindiAccuracy: 100,
      englishGrammar: 100,
      pronunciationAccuracy: 100,
      loudnessScore: 100,
      clarityScore: 100,
      fillerRate: 0,
      streakDays: 20,
    });
    expect(high).toBeGreaterThan(90);
  });

  it("penalizes high filler rate", () => {
    const clean = computeFluencyScore({ fillerRate: 0 });
    const noisy = computeFluencyScore({ fillerRate: 100 });
    expect(clean).toBeGreaterThan(noisy);
  });
});

describe("loudnessFromDbfs", () => {
  it("clamps quiet audio to 0", () => {
    expect(loudnessFromDbfs(-40)).toBe(0);
  });

  it("clamps loud audio to 100", () => {
    expect(loudnessFromDbfs(0)).toBe(100);
  });
});
