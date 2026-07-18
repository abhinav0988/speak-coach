import { describe, expect, it } from "vitest";
import { analyzeCodeSwitch } from "./codeSwitch";

describe("analyzeCodeSwitch", () => {
  it("returns empty analysis for blank input", () => {
    const r = analyzeCodeSwitch("   ");
    expect(r.wordCount).toBe(0);
    expect(r.englishRatio).toBe(0);
    expect(r.tip).toMatch(/analyze/i);
  });

  it("classifies pure English text", () => {
    const r = analyzeCodeSwitch("I am going to the office today");
    expect(r.wordCount).toBeGreaterThan(0);
    expect(r.englishRatio).toBeGreaterThan(0.8);
    expect(r.tip).toMatch(/Hindi/i);
  });

  it("classifies Roman Hindi words as Hindi", () => {
    const r = analyzeCodeSwitch("main ghar aur kaam");
    expect(r.hindiRatio).toBeGreaterThan(0.8);
    expect(r.hindiWords).toContain("main");
  });

  it("flags high code-switching in mixed text", () => {
    const r = analyzeCodeSwitch("main office jaana hai but traffic bahut hai today");
    expect(r.englishWords.length).toBeGreaterThan(0);
    expect(r.hindiWords.length).toBeGreaterThan(0);
    expect(r.mixedScore).toBeGreaterThan(0);
  });

  it("rounds ratios to two decimals", () => {
    const r = analyzeCodeSwitch("hello world main");
    expect(Number.isFinite(r.englishRatio)).toBe(true);
    expect(r.englishRatio).toBe(Math.round(r.englishRatio * 100) / 100);
  });
});
