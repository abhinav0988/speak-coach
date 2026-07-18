import { describe, expect, it } from "vitest";
import { applyRomanHindiRules, buildDiff, correctRomanHindiSync } from "./romanHindi";

const RULES = { pohach: "pahunch", gya: "gaya", hu: "hoon" };

describe("applyRomanHindiRules", () => {
  it("corrects known misspellings and records mistakes", () => {
    const { corrected, mistakes } = applyRomanHindiRules("main ghar pohach gya hu", RULES);
    expect(corrected).toContain("pahunch");
    expect(corrected).toContain("gaya");
    expect(mistakes.length).toBe(3);
  });

  it("preserves capitalization of first letter", () => {
    const { corrected } = applyRomanHindiRules("Pohach", RULES);
    expect(corrected).toBe("Pahunch");
  });

  it("leaves unknown words unchanged", () => {
    const { corrected, mistakes } = applyRomanHindiRules("clean sentence", RULES);
    expect(corrected).toBe("clean sentence");
    expect(mistakes).toHaveLength(0);
  });
});

describe("buildDiff", () => {
  it("marks identical words as same", () => {
    const diff = buildDiff("a b", "a b");
    expect(diff.every((d) => d.status === "same")).toBe(true);
  });

  it("marks changed words as wrong with a fix", () => {
    const diff = buildDiff("gya", "gaya");
    expect(diff[0].status).toBe("wrong");
    expect(diff[0].fix).toBe("gaya");
  });

  it("marks extra corrected words as added", () => {
    const diff = buildDiff("hello", "hello world");
    expect(diff.some((d) => d.status === "added")).toBe(true);
  });
});

describe("correctRomanHindiSync", () => {
  it("capitalizes and punctuates the corrected output", () => {
    const r = correctRomanHindiSync("main ghar pohach gya hu", RULES);
    expect(r.correctRomanHindi[0]).toBe(r.correctRomanHindi[0].toUpperCase());
    expect(/[.?]$/.test(r.correctRomanHindi)).toBe(true);
    expect(r.myVersion).toBe("main ghar pohach gya hu");
  });
});
