import { expect, test } from "@playwright/test";
import {
  loginViaApi,
  registerAndLogin,
  uniqueTestUser,
  type RegisteredUser,
} from "./helpers";

test.describe("auth flow", () => {
  test("register → verify OTP → profile setup → dashboard", async ({ page }) => {
    const user = uniqueTestUser("ui-reg");

    await page.goto("/auth/register");
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();

    await page.getByLabel("Full name").fill(user.name);
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill(user.password);
    await page.getByLabel("Confirm password").fill(user.password);
    await page.getByRole("button", { name: /create account/i }).click();

    await page.waitForURL(/\/auth\/verify-email/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: /verify email/i })).toBeVisible();

    const devOtp = new URL(page.url()).searchParams.get("devOtp");
    if (devOtp) {
      await expect(page.getByLabel(/one-time code/i)).toHaveValue(devOtp);
    } else {
      test.skip(true, "devOtp not in URL — AUTH_DEV_EXPOSE_OTP must be enabled on API");
    }

    await page.getByRole("button", { name: /verify & continue/i }).click();
    await page.waitForURL(/\/profile\/setup/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: /learning goal/i })).toBeVisible();

    await page.getByRole("button", { name: /^continue$/i }).click();
    await expect(page.getByText(/daily minutes/i)).toBeVisible();
    await page.getByRole("button", { name: /go to dashboard/i }).click();

    await expect(page).not.toHaveURL(/\/auth\/|\/profile\/setup/, { timeout: 30_000 });
    expect(page.url()).toMatch(/\/dashboard(\/)?$|\/$/);
  });

  test("login with remembered user", async ({ page }) => {
    const user = await registerAndLogin(page);

    await page.context().clearCookies();
    await page.goto("/auth/login");
    await page.evaluate(() => localStorage.clear());

    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 30_000 });
  });

  test("protected route redirects unauthenticated users to login", async ({ page }) => {
    await page.context().clearCookies();
    await page.goto("/dashboard");
    await page.waitForURL(/\/auth\/login/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
  });

  test("logout via settings UI", async ({ page }) => {
    await registerAndLogin(page);
    // registerAndLogin already lands on /settings with Sign out visible
    await page.getByRole("button", { name: /sign out/i }).click();

    await page.waitForURL(/\/auth\/login/, { timeout: 30_000 });
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();

    const me = await page.evaluate(async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      return res.status;
    });
    expect(me).toBe(401);
  });
});
