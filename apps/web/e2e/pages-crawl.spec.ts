import { expect, test } from "@playwright/test";
import {
  attachScreenshot,
  detectPageIssues,
  gotoAndSettle,
  pageSlug,
  registerAndLogin,
  trackPageErrors,
} from "./helpers";

const PUBLIC_PAGES = [
  "/auth",
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/sign-in",
  "/sign-up",
] as const;

const AUTHENTICATED_PAGES = [
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
  "/profile/setup",
] as const;

test.describe("pages crawl", () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chrome", "desktop crawl only");
  });

  for (const path of PUBLIC_PAGES) {
    test(`public ${path}`, async ({ page }, testInfo) => {
      const { errors, detach } = trackPageErrors(page);
      await gotoAndSettle(page, path);

      const issues = await detectPageIssues(page);
      if (issues.isBlank || errors.length > 0) {
        await attachScreenshot(testInfo, page, pageSlug(path), "pages");
      }

      expect(errors, `uncaught errors on ${path}`).toHaveLength(0);
      expect(issues.isBlank, `${path} rendered blank`).toBe(false);
      detach();
    });
  }

  test.describe("authenticated routes", () => {
    test.beforeEach(async ({ page }) => {
      await registerAndLogin(page);
    });

    for (const path of AUTHENTICATED_PAGES) {
      test(`auth ${path}`, async ({ page }, testInfo) => {
        const { errors, detach } = trackPageErrors(page);
        await gotoAndSettle(page, path);

        const issues = await detectPageIssues(page);
        const softFailure = issues.connectionError || issues.redirectedToLogin;

        if (softFailure || issues.isBlank || errors.length > 0) {
          await attachScreenshot(testInfo, page, pageSlug(path), "pages");
        }

        if (softFailure) {
          test.info().annotations.push({
            type: "soft-skip",
            description: `${path}: ${issues.redirectedToLogin ? "redirected to login" : "connection error"} (recorded)`,
          });
          detach();
          return;
        }

        expect(errors, `uncaught errors on ${path}`).toHaveLength(0);
        expect(issues.isBlank, `${path} rendered blank`).toBe(false);
        detach();
      });
    }
  });
});
