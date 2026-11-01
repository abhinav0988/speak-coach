#!/usr/bin/env node
/**
 * Full smoke suite for Speak Coach email auth + API.
 * Env: API_URL, WEB_URL, SMOKE_EMAIL, SMOKE_PASSWORD
 */
const API_URL = process.env.API_URL ?? "https://speak-coach-api.appsphere.workers.dev";
const WEB_URL = process.env.WEB_URL ?? "https://speak-coach-web.pages.dev";
const EMAIL = process.env.SMOKE_EMAIL ?? `smoke_${Date.now()}@example.com`;
const PASSWORD = process.env.SMOKE_PASSWORD ?? "SmokeTest1!";

let pass = 0;
let fail = 0;
const failures = [];
const jar = new Map();

function assert(name, cond) {
  if (cond) {
    pass++;
    console.log(`  ✅ ${name}`);
  } else {
    fail++;
    failures.push(name);
    console.log(`  ❌ ${name}`);
  }
}

function section(title) {
  console.log(`\n── ${title}`);
}

function storeCookies(res) {
  const raw = typeof res.headers.getSetCookie === "function" ? res.headers.getSetCookie() : [];
  const single = res.headers.get("set-cookie");
  const list = raw.length ? raw : single ? [single] : [];
  for (const c of list) {
    const [pair] = c.split(";");
    const eq = pair.indexOf("=");
    if (eq > 0) jar.set(pair.slice(0, eq), pair.slice(eq + 1));
  }
}

function cookieHeader() {
  return [...jar.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

async function api(path, { method = "GET", body, csrf } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (csrf && jar.get("sc_csrf")) headers["X-CSRF-Token"] = jar.get("sc_csrf");
  if (jar.size) headers.Cookie = cookieHeader();
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  storeCookies(res);
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }
  return { status: res.status, json };
}

async function run() {
  console.log("=== Speak Coach Auth Smoke ===");
  console.log(`API: ${API_URL}`);
  console.log(`WEB: ${WEB_URL}`);
  console.log(`EMAIL: ${EMAIL}`);

  section("Routing / health");
  {
    const web = await fetch(WEB_URL);
    assert("web root 200", web.status === 200);
    const health = await api("/api/health");
    assert("health 200", health.status === 200);
    assert("jwt configured", health.json?.checks?.jwtConfigured === true);
    assert("auth tables present", health.json?.checks?.authTables === true);
  }

  section("Register + verify");
  {
    const reg = await api("/api/auth/register", {
      method: "POST",
      body: { name: "Smoke Tester", email: EMAIL, password: PASSWORD, confirmPassword: PASSWORD },
    });
    assert("register 200", reg.status === 200);
    const otp = reg.json?.devOtp;
    assert("dev OTP available (or email configured)", Boolean(otp) || reg.json?.ok === true);
    if (otp) {
      const ver = await api("/api/auth/verify-email", {
        method: "POST",
        body: { email: EMAIL, otp },
      });
      assert("verify-email 200", ver.status === 200);
      assert("access cookie set", jar.has("sc_access"));
      assert("refresh cookie set", jar.has("sc_refresh"));
    }
  }

  section("Protected route + me");
  {
    const me = await api("/api/auth/me");
    assert("me 200", me.status === 200);
    assert("me returns email", me.json?.user?.email === EMAIL);
    const dash = await api("/api/dashboard");
    assert("dashboard 200", dash.status >= 200 && dash.status < 300);
  }

  section("Unauthorized without cookies");
  {
    const bare = await fetch(`${API_URL}/api/dashboard`);
    assert("dashboard without auth is 401", bare.status === 401);
  }

  section("Logout");
  {
    const out = await api("/api/auth/logout", { method: "POST", csrf: true });
    assert("logout 200", out.status === 200);
  }

  section("Login");
  {
    jar.clear();
    const login = await api("/api/auth/login", {
      method: "POST",
      body: { email: EMAIL, password: PASSWORD },
    });
    assert("login 200", login.status === 200);
    assert("login csrf returned", Boolean(login.json?.csrfToken));
  }

  console.log(`\n=== ${pass} passed, ${fail} failed (${pass + fail} asserts) ===`);
  if (fail > 0) {
    console.log(`Failed: ${failures.join(", ")}`);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
