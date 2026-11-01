/**
 * Same-origin API proxy.
 *
 * The web app (Cloudflare Pages) and the API (Cloudflare Worker) live on
 * different hosts. Auth uses HttpOnly cookies, which browsers treat as
 * third-party (and often block) when set from the Worker host directly.
 *
 * Routing every `/api/*` request through this Pages Function makes the API
 * same-origin with the app, so Set-Cookie responses are first-party and work
 * in every browser (including Safari and incognito). WebSocket upgrades for
 * the coach are forwarded transparently.
 */
const WORKER_ORIGIN = "https://speak-coach-api.appsphere.workers.dev";

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const target = WORKER_ORIGIN + url.pathname + url.search;

  const proxied = new Request(target, request);
  // Preserve the original client host for the Worker's logging / auditing.
  proxied.headers.set("X-Forwarded-Host", url.host);

  return fetch(proxied);
}
