import { describe, expect, it } from "vitest";
import { ADAPTIVE_BREAKPOINTS, tierFromWidth } from "./adaptive-layout";

describe("tierFromWidth", () => {
  it("classifies phone below 768px", () => {
    expect(tierFromWidth(390)).toBe("phone");
    expect(tierFromWidth(ADAPTIVE_BREAKPOINTS.phoneMax)).toBe("phone");
  });

  it("classifies tablet between 768 and 1023px", () => {
    expect(tierFromWidth(ADAPTIVE_BREAKPOINTS.tabletMin)).toBe("tablet");
    expect(tierFromWidth(834)).toBe("tablet");
    expect(tierFromWidth(ADAPTIVE_BREAKPOINTS.tabletMax)).toBe("tablet");
  });

  it("classifies desktop at 1024px and above", () => {
    expect(tierFromWidth(ADAPTIVE_BREAKPOINTS.desktopMin)).toBe("desktop");
    expect(tierFromWidth(1440)).toBe("desktop");
  });
});
