import { describe, expect, it } from "vitest";
import { countFillerWords } from "./fillerWords";

describe("countFillerWords", () => {
  it("counts English fillers", () => {
    expect(countFillerWords("um uh like")).toBe(3);
  });

  it("counts Hindi fillers", () => {
    expect(countFillerWords("matlab toh bas yaani")).toBe(4);
  });

  it("is case-insensitive", () => {
    expect(countFillerWords("UM Like ACTUALLY")).toBe(3);
  });

  it("returns 0 for clean speech", () => {
    expect(countFillerWords("clear and confident delivery")).toBe(0);
  });
});
