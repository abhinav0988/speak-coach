import { describe, expect, it } from "vitest";
import { correctEnglishSync } from "./englishFix";

describe("correctEnglishSync", () => {
  it("fixes present continuous error", () => {
    const r = correctEnglishSync("i am go to office");
    expect(r.corrected).toContain("going");
    expect(r.mistakes.length).toBeGreaterThan(0);
  });

  it("fixes third-person singular", () => {
    const r = correctEnglishSync("he don't know");
    expect(r.corrected.toLowerCase()).toContain("doesn't");
  });

  it("capitalizes and punctuates output", () => {
    const r = correctEnglishSync("they was here");
    expect(r.corrected[0]).toBe(r.corrected[0].toUpperCase());
    expect(/[.!?]$/.test(r.corrected)).toBe(true);
  });

  it("returns a friendly note when no rules match", () => {
    const r = correctEnglishSync("This sentence is perfectly fine");
    expect(r.mistakes).toHaveLength(0);
    expect(r.explanation).toMatch(/good|improvement/i);
  });

  it("produces contractions in the natural form", () => {
    const r = correctEnglishSync("i am happy");
    expect(r.natural).toContain("I'm");
  });
});
