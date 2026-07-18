import { describe, expect, it } from "vitest";
import { generateOtp, hashPassword, validatePassword, verifyPassword, sha256Hex } from "./password";

describe("validatePassword", () => {
  it("rejects short passwords", () => {
    expect(validatePassword("Ab1!")).toMatch(/8/);
  });

  it("requires complexity", () => {
    expect(validatePassword("abcdefgh")).toBeTruthy();
    expect(validatePassword("Abcdefgh")).toBeTruthy();
    expect(validatePassword("Abcdefg1")).toBeTruthy();
    expect(validatePassword("Abcdefg1!")).toBeNull();
  });
});

describe("hashPassword / verifyPassword", () => {
  it("round-trips a password", async () => {
    const hash = await hashPassword("SecurePass1!");
    expect(hash.startsWith("pbkdf2$")).toBe(true);
    expect(await verifyPassword("SecurePass1!", hash)).toBe(true);
    expect(await verifyPassword("WrongPass1!", hash)).toBe(false);
  });
});

describe("generateOtp", () => {
  it("returns 6 digits", () => {
    expect(generateOtp(6)).toMatch(/^\d{6}$/);
  });
});

describe("sha256Hex", () => {
  it("is deterministic", async () => {
    expect(await sha256Hex("abc")).toBe(await sha256Hex("abc"));
    expect(await sha256Hex("abc")).not.toBe(await sha256Hex("abcd"));
  });
});
