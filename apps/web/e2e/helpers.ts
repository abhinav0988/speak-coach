import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { expect, type APIResponse, type Page, type TestInfo } from "@playwright/test";

const CSRF_KEY = "speak-coach-csrf";
const TEST_RESULTS_DIR = join(process.cwd(), "test-results");

export type RegisteredUser = {
  name: string;
  email: string;
  password: string;
};

/** Navigate to public auth surfaces (no legacy shared-secret seed). */
export async function gotoLogin(page: Page): Promise<void> {
  await page.goto("/auth/login");
}

export async function gotoWelcome(page: Page): Promise<void> {
  await page.goto("/auth");
}

/** Assert the page has no horizontal overflow at the current viewport. */
export async function expectNoHorizontalScroll(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const el = document.documentElement;
    return el.scrollWidth <= el.clientWidth + 1;
  });
}

/** Create a unique test user for isolated auth flows. */
export function uniqueTestUser(prefix = "e2e"): RegisteredUser {
  const rand = Math.random().toString(36).slice(2, 8);
  const ts = Date.now();
  return {
    name: `E2E User ${rand}`,
    email: `${prefix}-${rand}-${ts}@speak-coach.test`,
    password: "TestPass123!",
  };
}

function ensureResultsDir(subdir?: string): string {
  const dir = subdir ? join(TEST_RESULTS_DIR, subdir) : TEST_RESULTS_DIR;
  mkdirSync(dir, { recursive: true });
  return dir;
}

/** Save a full-page screenshot under test-results/ (optionally nested). */
export async function screenshotOnFailure(
  page: Page,
  name: string,
  subdir?: string
): Promise<string> {
  const dir = ensureResultsDir(subdir);
  const safe = name.replace(/[^a-zA-Z0-9._-]+/g, "-");
  const path = join(dir, `${safe}.png`);
  await page.screenshot({ path, fullPage: true });
  return path;
}

async function parseJson<T>(res: APIResponse): Promise<T> {
  expect(res.ok(), `HTTP ${res.status()}: ${await res.text()}`).toBeTruthy();
  return res.json() as Promise<T>;
}

/** Inject CSRF token into browser localStorage (API client reads this key). */
export async function syncCsrfToPage(page: Page, csrfToken: string): Promise<void> {
  await page.goto("/auth/login");
  await page.evaluate(
    ([key, token]) => {
      localStorage.setItem(key, token);
    },
    [CSRF_KEY, csrfToken] as const
  );
}

/**
 * Register, verify email (devOtp), complete profile setup via same-origin /api.
 * Uses in-page `fetch` so HttpOnly cookies are set by the browser document itself.
 */
export async function registerAndLogin(
  page: Page,
  user: RegisteredUser = uniqueTestUser()
): Promise<RegisteredUser> {
  await page.goto("/auth/login");
  // Avoid stale PWA/service-worker cache interfering with auth cookies / API.
  await page.evaluate(async () => {
    if (!("serviceWorker" in navigator)) return;
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  });

  const result = await page.evaluate(async (u) => {
    const registerRes = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: u.name,
        email: u.email,
        password: u.password,
        confirmPassword: u.password,
      }),
    });
    const registerBody = (await registerRes.json()) as {
      ok?: boolean;
      email?: string;
      devOtp?: string;
      error?: string;
    };
    if (!registerRes.ok) {
      return { ok: false as const, error: registerBody.error ?? `register ${registerRes.status}` };
    }
    if (!registerBody.devOtp) {
      return { ok: false as const, error: "missing devOtp" };
    }

    const verifyRes = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: u.email, otp: registerBody.devOtp }),
    });
    const verifyBody = (await verifyRes.json()) as {
      ok?: boolean;
      csrfToken?: string;
      error?: string;
    };
    if (!verifyRes.ok || !verifyBody.csrfToken) {
      return { ok: false as const, error: verifyBody.error ?? `verify ${verifyRes.status}` };
    }

    localStorage.setItem("speak-coach-csrf", verifyBody.csrfToken);

    const setupRes = await fetch("/api/auth/profile-setup", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": verifyBody.csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        learningGoal: "fluency",
        dailyGoalMinutes: 15,
        targetDays: 90,
      }),
    });
    const setupBody = (await setupRes.json()) as { ok?: boolean; error?: string };
    if (!setupRes.ok) {
      return { ok: false as const, error: setupBody.error ?? `setup ${setupRes.status}` };
    }

    const meRes = await fetch("/api/auth/me", { credentials: "include" });
    if (!meRes.ok) {
      return { ok: false as const, error: `me ${meRes.status}` };
    }

    return { ok: true as const };
  }, user);

  if (!result.ok) {
    throw new Error(`registerAndLogin failed: ${result.error}`);
  }

  // Land on an authenticated page and wait for AuthProvider bootstrap.
  await page.goto("/settings", { waitUntil: "domcontentloaded" });
  await expect(page).not.toHaveURL(/\/auth\//, { timeout: 30_000 });
  await expect(page.getByRole("button", { name: /sign out/i })).toBeVisible({
    timeout: 30_000,
  });

  return user;
}

/** Log in an existing verified user via in-page fetch (browser cookies). */
export async function loginViaApi(page: Page, user: RegisteredUser): Promise<void> {
  await page.goto("/auth/login");
  const result = await page.evaluate(async (u) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: u.email,
        password: u.password,
        rememberMe: true,
      }),
    });
    const body = (await res.json()) as { ok?: boolean; csrfToken?: string; next?: string; error?: string };
    if (!res.ok || !body.csrfToken) {
      return { ok: false as const, error: body.error ?? `login ${res.status}` };
    }
    localStorage.setItem("speak-coach-csrf", body.csrfToken);
    return { ok: true as const, next: body.next ?? "/dashboard" };
  }, user);

  if (!result.ok) throw new Error(`loginViaApi failed: ${result.error}`);
  await page.goto(result.next, { waitUntil: "domcontentloaded" });
  await expect(page).not.toHaveURL(/\/auth\//, { timeout: 30_000 });
}

/** Slug for screenshot filenames from a route path. */
export function pageSlug(path: string): string {
  if (path === "/") return "home";
  return path.replace(/^\//, "").replace(/\//g, "-");
}

/** Track uncaught page errors during navigation. */
export function trackPageErrors(page: Page): { errors: Error[]; detach: () => void } {
  const errors: Error[] = [];
  const handler = (err: Error) => errors.push(err);
  page.on("pageerror", handler);
  return {
    errors,
    detach: () => page.off("pageerror", handler),
  };
}

/** Wait for page load with networkidle fallback to load; retry once on disconnect. */
export async function gotoAndSettle(page: Page, path: string): Promise<void> {
  const attempt = async () => {
    try {
      await page.goto(path, { waitUntil: "networkidle", timeout: 45_000 });
    } catch {
      await page.goto(path, { waitUntil: "load", timeout: 45_000 });
    }
  };
  try {
    await attempt();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/ERR_INTERNET_DISCONNECTED|ERR_NETWORK|TIMEOUT/i.test(msg)) {
      await page.waitForTimeout(1000);
      await attempt();
      return;
    }
    throw err;
  }
}

/** Detect common failure surfaces during page crawl. */
export async function detectPageIssues(page: Page): Promise<{
  isBlank: boolean;
  connectionError: boolean;
  redirectedToLogin: boolean;
}> {
  const bodyText = await page.locator("body").innerText().catch(() => "");
  const trimmed = bodyText.trim();
  return {
    isBlank: trimmed.length < 10,
    connectionError: /couldn't load|can't reach the server|connection error/i.test(trimmed),
    redirectedToLogin: /\/auth\/login/.test(page.url()),
  };
}

/** Attach screenshot to Playwright report on failure. */
export async function attachScreenshot(
  testInfo: TestInfo,
  page: Page,
  name: string,
  subdir?: string
): Promise<void> {
  const path = await screenshotOnFailure(page, name, subdir);
  await testInfo.attach(name, { path, contentType: "image/png" });
}
