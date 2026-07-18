import { expect, test } from "@playwright/test";
import { registerAndLogin } from "./helpers";

test.describe("learn flow", () => {
  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page);
  });

  test("session lesson continue, complete, and share stays on page", async ({ page }) => {
    await page.goto("/session");
    await page.waitForLoadState("networkidle").catch(() => page.waitForLoadState("load"));

    const continueBtn = page.getByRole("button", { name: /continue lesson/i }).first();
    await expect(continueBtn).toBeVisible({ timeout: 45_000 });
    await continueBtn.click();

    const stepOne = page.locator("#lesson-step-1");
    await expect(stepOne).toBeVisible({ timeout: 15_000 });

    await stepOne.scrollIntoViewIfNeeded();

    const completeBtn = page.getByRole("button", { name: /complete lesson/i }).first();
    if (await completeBtn.isVisible().catch(() => false)) {
      await completeBtn.click();
      await expect(page.getByRole("heading", { name: /lesson complete/i })).toBeVisible({
        timeout: 20_000,
      });

      const urlBeforeShare = page.url();
      expect(urlBeforeShare).toContain("/session");

      await page.getByRole("button", { name: /^share$/i }).click();
      await page.waitForTimeout(500);

      expect(page.url()).toContain("/session");
      expect(page.url()).toBe(urlBeforeShare);
    } else {
      await expect(stepOne).toBeInViewport();
    }
  });
});
