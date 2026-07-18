import { describe, expect, it } from "vitest";
import {
  alignWords,
  computeReadingStats,
  countFillerWords,
  normalizeText,
  tokenize,
} from "./wordAlignment";

describe("normalizeText", () => {
  it("lowercases and strips punctuation", () => {
    expect(normalizeText("Hello, World!")).toBe("hello world");
  });

  it("collapses whitespace", () => {
    expect(normalizeText("a   b\tc")).toBe("a b c");
  });
});

describe("tokenize", () => {
  it("splits into words", () => {
    expect(tokenize("The quick brown fox")).toEqual(["the", "quick", "brown", "fox"]);
  });

  it("returns empty array for blank", () => {
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("alignWords", () => {
  it("marks all correct for identical text", () => {
    const a = alignWords("hello world", "hello world");
    expect(a.every((w) => w.status === "correct")).toBe(true);
  });

  it("detects a substitution", () => {
    const a = alignWords("hello world", "hello word");
    expect(a.some((w) => w.status === "wrong")).toBe(true);
  });

  it("detects a skipped word", () => {
    const a = alignWords("hello big world", "hello world");
    expect(a.some((w) => w.status === "skipped")).toBe(true);
  });

  it("detects an extra word", () => {
    const a = alignWords("hello world", "hello big world");
    expect(a.some((w) => w.status === "extra")).toBe(true);
  });
});

describe("countFillerWords", () => {
  it("counts English and Hindi fillers", () => {
    expect(countFillerWords("um so like matlab yes")).toBe(3);
  });

  it("returns zero when none present", () => {
    expect(countFillerWords("clear confident speech")).toBe(0);
  });
});

describe("computeReadingStats", () => {
  it("computes accuracy from alignment", () => {
    const stats = computeReadingStats(alignWords("a b c d", "a b c d"));
    expect(stats.accuracy).toBe(100);
    expect(stats.correct).toBe(4);
  });
});
