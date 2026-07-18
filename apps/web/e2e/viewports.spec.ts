import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll, gotoLogin, gotoWelcome } from "./helpers";

test.describe("adaptive shell — public auth", () => {
  test("welcome page renders", async ({ page }) => {
    await gotoWelcome(page);
    await expect(page.getByText(/speaking journey/i).first()).toBeVisible();
  });

  test("login page renders responsively", async ({ page }) => {
    await gotoLogin(page);
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    expect(await expectNoHorizontalScroll(page)).toBe(true);
  });

  test("register page has password requirements", async ({ page }) => {
    await page.goto("/auth/register");
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
    await expect(page.getByText(/8\+ characters/i)).toBeVisible();
  });
});

test.describe("phone layout", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile-iphone", "phone only");
  });

  test("login has no horizontal scroll", async ({ page }) => {
    await gotoLogin(page);
    expect(await expectNoHorizontalScroll(page)).toBe(true);
  });

  test("touch-friendly submit button", async ({ page }) => {
    await gotoLogin(page);
    const btn = page.getByRole("button", { name: /sign in/i });
    const box = await btn.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
  });
});

test.describe("tablet layout", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "tablet-ipad", "tablet only");
  });

  test("welcome has no horizontal scroll", async ({ page }) => {
    await gotoWelcome(page);
    expect(await expectNoHorizontalScroll(page)).toBe(true);
  });
});

test.describe("desktop layout", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chrome", "desktop only");
  });

  test("bundle embeds an API host", async () => {
    const chunkDir = join(process.cwd(), "out", "_next", "static", "chunks");
    let found = false;
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".js")) {
          const content = readFileSync(full, "utf8");
          if (/workers\.dev|localhost:87\d\d|\/api\//.test(content)) found = true;
          if (/speak-coach-dev|APP_SECRET|DEV_ACCESS_CODE/.test(content)) {
            throw new Error("Legacy shared-secret auth strings found in production bundle");
          }
        }
      }
    };
    walk(chunkDir);
    expect(found).toBe(true);
  });
});
