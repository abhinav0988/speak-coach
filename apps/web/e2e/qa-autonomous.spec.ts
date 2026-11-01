import { expect, test, type Page, type Request, type Response } from "@playwright/test";
import {
  attachScreenshot,
  detectPageIssues,
  gotoAndSettle,
  pageSlug,
  registerAndLogin,
  trackPageErrors,
  uniqueTestUser,
} from "./helpers";

/** Routes discovered from the app shell + known feature pages. */
const PUBLIC_ROUTES = [
  "/auth",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
] as const;

const AUTH_ROUTES = [
  "/",
  "/dashboard",
  "/session",
  "/explore",
  "/coach",
  "/profile",
  "/settings",
  "/vocabulary",
  "/mistakes",
  "/homework",
  "/journey",
  "/curriculum",
  "/analytics",
  "/reports",
  "/heatmap",
  "/voice",
  "/voice-library",
  "/voice-timeline",
  "/live-speak",
  "/shadowing",
  "/roleplay",
  "/sound-gym",
  "/listen-repeat",
  "/challenge",
  "/correct",
  "/whatsapp",
  "/code-switch",
  "/phrases",
  "/journal",
  "/rewards",
  "/comeback",
  "/night-review",
  "/paragraphs/write",
  "/paragraphs/read",
  "/paragraphs/history",
  "/launch",
] as const;

type NetIssue = { url: string; status?: number; failure?: string };

function attachNetworkMonitors(page: Page) {
  const failures: NetIssue[] = [];
  const onReqFailed = (req: Request) => {
    const u = req.url();
    if (!u.includes("/api/") && !u.includes("localhost")) return;
    failures.push({ url: u, failure: req.failure()?.errorText ?? "failed" });
  };
  const onRes = (res: Response) => {
    const u = res.url();
    if (!u.includes("/api/")) return;
    if (res.status() >= 500) failures.push({ url: u, status: res.status() });
  };
  page.on("requestfailed", onReqFailed);
  page.on("response", onRes);
  return {
    failures,
    detach: () => {
      page.off("requestfailed", onReqFailed);
      page.off("response", onRes);
    },
  };
}

test.describe("QA autonomous — public + auth forms", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chrome", "desktop only");
  });

  test("health API is up", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok(), await res.text()).toBeTruthy();
    const body = (await res.json()) as { status?: string; checks?: { database?: boolean } };
    expect(body.status).toBe("ok");
    expect(body.checks?.database).toBe(true);
  });

  test("register invalid + valid + OTP + login + logout", async ({ page }, testInfo) => {
    const { errors, detach } = trackPageErrors(page);
    const net = attachNetworkMonitors(page);
    const user = uniqueTestUser("qa");

    await page.goto("/auth/register");
    // Invalid: empty submit
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL(/\/auth\/register/);

    // Invalid: weak password / mismatch
    await page.getByLabel("Full name").fill("QA");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password", { exact: true }).fill("short");
    await page.getByLabel("Confirm password").fill("different");
    await page.getByRole("button", { name: /create account/i }).click();
    await expect(page).toHaveURL(/\/auth\/register/);

    // Valid register
    await page.getByLabel("Full name").fill(user.name);
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill(user.password);
    await page.getByLabel("Confirm password").fill(user.password);
    await page.getByRole("button", { name: /create account/i }).click();
    await page.waitForURL(/\/auth\/verify-email/, { timeout: 30_000 });

    const devOtp = new URL(page.url()).searchParams.get("devOtp");
    expect(devOtp, "AUTH_DEV_EXPOSE_OTP must return OTP for local QA").toBeTruthy();
    await page.getByRole("button", { name: /verify & continue/i }).click();
    await page.waitForURL(/\/profile\/setup/, { timeout: 30_000 });
    await page.getByRole("button", { name: /^continue$/i }).click();
    await page.getByRole("button", { name: /go to dashboard/i }).click();
    await expect(page).not.toHaveURL(/\/auth\/|\/profile\/setup/, { timeout: 30_000 });

    // Forgot password surface
    await page.goto("/auth/forgot-password");
    await page.getByLabel(/email/i).fill(user.email);
    await page.getByRole("button", { name: /send|reset|continue/i }).first().click();
    await page.waitForTimeout(800);

    // Settings logout
    await page.goto("/settings");
    await page.getByRole("button", { name: /sign out/i }).click();
    await page.waitForURL(/\/auth\/login/, { timeout: 30_000 });

    // Bad login
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill("WrongPass999!");
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/auth\/login/);

    // Good login
    await page.getByLabel("Password").fill(user.password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await expect(page).not.toHaveURL(/\/auth\/login/, { timeout: 30_000 });

    const api500 = net.failures.filter((f) => (f.status ?? 0) >= 500);
    if (errors.length || api500.length) {
      await attachScreenshot(testInfo, page, "auth-forms", "qa");
    }
    expect(errors, errors.map((e) => e.message).join("\n")).toHaveLength(0);
    expect(api500, JSON.stringify(api500)).toHaveLength(0);
    detach();
    net.detach();
  });

  for (const path of PUBLIC_ROUTES) {
    test(`public crawl ${path}`, async ({ page }, testInfo) => {
      const { errors, detach } = trackPageErrors(page);
      await gotoAndSettle(page, path);
      const issues = await detectPageIssues(page);
      if (issues.isBlank || errors.length) await attachScreenshot(testInfo, page, pageSlug(path), "qa");
      expect(errors).toHaveLength(0);
      expect(issues.isBlank).toBe(false);
      detach();
    });
  }
});

test.describe("QA autonomous — authenticated crawl + nav", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chrome", "desktop only");
  });

  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page);
  });

  for (const path of AUTH_ROUTES) {
    test(`auth crawl ${path}`, async ({ page }, testInfo) => {
      const { errors, detach } = trackPageErrors(page);
      const net = attachNetworkMonitors(page);
      await gotoAndSettle(page, path);
      const issues = await detectPageIssues(page);

      // Click primary nav links visible on this page (best-effort discovery).
      const nav = page.locator("nav a[href], aside a[href], [data-nav] a[href]");
      const count = await nav.count();
      const hrefs = new Set<string>();
      for (let i = 0; i < Math.min(count, 20); i++) {
        const href = await nav.nth(i).getAttribute("href");
        if (href?.startsWith("/")) hrefs.add(href);
      }

      if (issues.isBlank || issues.redirectedToLogin || errors.length) {
        await attachScreenshot(testInfo, page, pageSlug(path), "qa");
      }

      expect(issues.redirectedToLogin, `${path} bounced to login`).toBe(false);
      expect(issues.isBlank, `${path} blank`).toBe(false);
      expect(errors, errors.map((e) => e.message).join("\n")).toHaveLength(0);
      const api500 = net.failures.filter((f) => (f.status ?? 0) >= 500);
      expect(api500, JSON.stringify(api500)).toHaveLength(0);
      detach();
      net.detach();
      // Keep discovered routes in annotation for the report
      testInfo.annotations.push({
        type: "discovered-nav",
        description: [...hrefs].slice(0, 30).join(", "),
      });
    });
  }

  test("settings + profile interactive", async ({ page }, testInfo) => {
    const { errors, detach } = trackPageErrors(page);
    await gotoAndSettle(page, "/settings");
    // Toggle any checkbox/switches without destroying account
    const toggles = page.locator('input[type="checkbox"], button[role="switch"]');
    const n = await toggles.count();
    if (n > 0) {
      await toggles.first().click({ force: true }).catch(() => undefined);
    }
    await gotoAndSettle(page, "/profile");
    const issues = await detectPageIssues(page);
    if (errors.length || issues.isBlank) await attachScreenshot(testInfo, page, "profile-settings", "qa");
    expect(errors).toHaveLength(0);
    expect(issues.isBlank).toBe(false);
    detach();
  });

  test("explore / dashboard click cards", async ({ page }) => {
    await gotoAndSettle(page, "/explore");
    const cards = page.locator('a[href^="/"], button').filter({ hasText: /.+/ });
    const n = await cards.count();
    for (let i = 0; i < Math.min(n, 8); i++) {
      const el = cards.nth(i);
      if (!(await el.isVisible().catch(() => false))) continue;
      await el.click({ timeout: 3000 }).catch(() => undefined);
      await page.waitForTimeout(300);
      await page.goBack().catch(() => undefined);
    }
    await gotoAndSettle(page, "/dashboard");
    await expect(page.locator("body")).not.toBeEmpty();
  });
});

test.describe("QA autonomous — responsive", () => {
  for (const vp of [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 834, height: 1194 },
    { name: "desktop", width: 1440, height: 900 },
  ] as const) {
    test(`${vp.name} dashboard layout`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== "desktop-chrome", "resize desktop project only");
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await registerAndLogin(page);
      await gotoAndSettle(page, "/dashboard");
      const overflow = await page.evaluate(() => {
        const el = document.documentElement;
        return el.scrollWidth > el.clientWidth + 2;
      });
      if (overflow) await attachScreenshot(testInfo, page, `overflow-${vp.name}`, "qa");
      expect(overflow, `${vp.name} horizontal overflow`).toBe(false);
    });
  }
});
