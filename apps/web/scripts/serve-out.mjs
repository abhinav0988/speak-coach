// Static file server for Next.js `out/` + same-origin `/api` proxy to local Worker.
// Matches Cloudflare Pages Functions behavior so HttpOnly auth cookies work in Playwright.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";

const ROOT = join(process.cwd(), "out");
const PORT = Number(process.env.PORT ?? 4321);
const API_ORIGIN = process.env.API_ORIGIN ?? "http://127.0.0.1:8787";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

async function resolveFile(pathname) {
  const clean = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const candidates = [
    join(ROOT, clean),
    join(ROOT, `${clean}.html`),
    join(ROOT, clean, "index.html"),
  ];
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* try next */
    }
  }
  return join(ROOT, "404.html");
}

function proxyApi(req, res) {
  const target = new URL(req.url ?? "/", API_ORIGIN);
  const isHttps = target.protocol === "https:";
  const transport = isHttps ? httpsRequest : httpRequest;
  const headers = { ...req.headers, host: target.host };
  delete headers["accept-encoding"];

  const upstream = transport(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || (isHttps ? 443 : 80),
      path: target.pathname + target.search,
      method: req.method,
      headers,
    },
    (up) => {
      res.writeHead(up.statusCode ?? 502, up.headers);
      up.pipe(res);
    }
  );
  upstream.on("error", (err) => {
    res.writeHead(502, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: `API proxy failed: ${err.message}` }));
  });
  req.pipe(upstream);
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
    proxyApi(req, res);
    return;
  }

  const file = await resolveFile(url.pathname === "/" ? "/index.html" : url.pathname);
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": MIME[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    res.end("<!doctype html><title>404</title>Not found");
  }
});

server.listen(PORT, () => {
  console.log(`serve-out listening on http://localhost:${PORT} (API → ${API_ORIGIN})`);
});
