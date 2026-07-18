import { describe, expect, it } from "vitest";
import { countWords, createId, nowIso, todayDate } from "./utils";

describe("countWords", () => {
  it("counts whitespace-separated words", () => {
    expect(countWords("one two three")).toBe(3);
  });

  it("ignores extra whitespace", () => {
    expect(countWords("  a   b  ")).toBe(2);
  });

  it("returns 0 for empty string", () => {
    expect(countWords("")).toBe(0);
  });
});

describe("todayDate", () => {
  it("returns an ISO date (YYYY-MM-DD)", () => {
    expect(todayDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("nowIso", () => {
  it("returns a full ISO timestamp", () => {
    expect(nowIso()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe("createId", () => {
  it("returns a unique UUID each call", () => {
    expect(createId()).not.toBe(createId());
  });
});
