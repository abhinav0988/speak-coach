import { describe, expect, it } from "vitest";
import { computeStreak } from "./streak";

function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

describe("computeStreak", () => {
  it("returns 0 for no dates", () => {
    expect(computeStreak([])).toBe(0);
  });

  it("counts consecutive days ending today", () => {
    expect(computeStreak([isoDaysAgo(0), isoDaysAgo(1), isoDaysAgo(2)])).toBe(3);
  });

  it("allows a streak ending yesterday", () => {
    expect(computeStreak([isoDaysAgo(1), isoDaysAgo(2)])).toBe(2);
  });

  it("breaks the streak on a gap", () => {
    expect(computeStreak([isoDaysAgo(0), isoDaysAgo(3)])).toBe(1);
  });

  it("returns 0 when the most recent day is too old", () => {
    expect(computeStreak([isoDaysAgo(5), isoDaysAgo(6)])).toBe(0);
  });

  it("de-duplicates repeated dates", () => {
    expect(computeStreak([isoDaysAgo(0), isoDaysAgo(0), isoDaysAgo(1)])).toBe(2);
  });
});
