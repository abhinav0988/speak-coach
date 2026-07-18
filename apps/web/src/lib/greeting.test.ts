import { describe, expect, it } from "vitest";
import {
  getDayPeriod,
  getPracticeNudge,
  getRecommendedModuleId,
  getTimeGreeting,
} from "./greeting";

function at(hour: number): Date {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d;
}

describe("getDayPeriod", () => {
  it("classifies morning", () => expect(getDayPeriod(at(8))).toBe("morning"));
  it("classifies afternoon", () => expect(getDayPeriod(at(14))).toBe("afternoon"));
  it("classifies evening", () => expect(getDayPeriod(at(19))).toBe("evening"));
  it("classifies night", () => expect(getDayPeriod(at(23))).toBe("night"));
});

describe("getTimeGreeting", () => {
  it("greets by period", () => {
    expect(getTimeGreeting("morning")).toBe("Good morning");
    expect(getTimeGreeting("night")).toBe("Good night");
  });
});

describe("getRecommendedModuleId", () => {
  it("maps each period to a module", () => {
    expect(getRecommendedModuleId("morning")).toBe("vocabulary");
    expect(getRecommendedModuleId("night")).toBe("coach");
  });
});

describe("getPracticeNudge", () => {
  it("acknowledges practice already done", () => {
    expect(getPracticeNudge("morning", true)).toMatch(/roll/i);
  });

  it("nudges when not practiced yet", () => {
    expect(getPracticeNudge("evening", false)).toMatch(/practice|habit/i);
  });
});
