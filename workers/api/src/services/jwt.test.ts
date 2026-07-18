import { describe, expect, it } from "vitest";
import {
  ACCESS_TTL_SEC,
  WS_TOKEN_TTL_SEC,
  signAccessToken,
  signWsToken,
  verifyAccessToken,
  verifyWsToken,
} from "./jwt";

const SECRET = "test-jwt-secret-for-unit-tests-only";

describe("access JWT", () => {
  it("signs and verifies access tokens", async () => {
    const token = await signAccessToken(SECRET, {
      userId: "user-abc",
      email: "a@example.com",
      sessionId: "sess-1",
    });
    const claims = await verifyAccessToken(SECRET, token);
    expect(claims.sub).toBe("user-abc");
    expect(claims.email).toBe("a@example.com");
    expect(claims.sid).toBe("sess-1");
    expect(claims.typ).toBe("access");
    expect(ACCESS_TTL_SEC).toBe(15 * 60);
  });

  it("rejects wrong secret", async () => {
    const token = await signAccessToken(SECRET, {
      userId: "u1",
      email: "a@example.com",
      sessionId: "s1",
    });
    await expect(verifyAccessToken("other-secret", token)).rejects.toThrow();
  });
});

describe("websocket JWT", () => {
  it("signs short-lived ws tokens", async () => {
    const token = await signWsToken(SECRET, "user-xyz");
    const claims = await verifyWsToken(SECRET, token);
    expect(claims.sub).toBe("user-xyz");
    expect(claims.typ).toBe("ws");
    expect(WS_TOKEN_TTL_SEC).toBe(60);
  });

  it("rejects access token as ws token", async () => {
    const token = await signAccessToken(SECRET, {
      userId: "u1",
      email: "a@example.com",
      sessionId: "s1",
    });
    await expect(verifyWsToken(SECRET, token)).rejects.toThrow(/Invalid WS/);
  });
});
