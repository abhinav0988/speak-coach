"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Rocket, XCircle, RefreshCw } from "lucide-react";
import type { HealthStatus, LaunchCheck } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

async function fetchCheck(
  id: string,
  label: string,
  path: string,
  options?: RequestInit
): Promise<LaunchCheck> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: { ...(options?.headers ?? {}) },
    });
    if (!res.ok) {
      return { id, label, status: "fail", detail: `HTTP ${res.status}` };
    }
    return { id, label, status: "pass", detail: "OK" };
  } catch (e) {
    return { id, label, status: "fail", detail: e instanceof Error ? e.message : "Failed" };
  }
}

export default function LaunchPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [checks, setChecks] = useState<LaunchCheck[]>([]);
  const [running, setRunning] = useState(false);

  const runChecks = async () => {
    setRunning(true);
    const results: LaunchCheck[] = [];

    try {
      const healthRes = await fetch(`${API_URL}/api/health`);
      const healthData = (await healthRes.json()) as HealthStatus;
      setHealth(healthData);
      results.push({
        id: "health",
        label: "API Health",
        status: healthData.status === "ok" ? "pass" : "fail",
        detail: `${healthData.checks.tableCount} tables, jwt=${healthData.checks.jwtConfigured}`,
      });
    } catch {
      results.push({ id: "health", label: "API Health", status: "fail", detail: "Unreachable" });
    }

    const endpoints: Array<[string, string, string, RequestInit?]> = [
      ["dashboard", "Dashboard", "/api/dashboard"],
      ["vocab", "Vocabulary", "/api/vocabulary/today"],
      ["curriculum", "Curriculum", "/api/curriculum/overview"],
      [
        "correct",
        "Roman Hindi Fix",
        "/api/correct/roman-hindi",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: "main ghar pohach gya hu" }),
        },
      ],
      ["streak", "Streak Engine", "/api/streak"],
      ["timeline", "Voice Timeline", "/api/voice/timeline"],
      ["report", "Weekly Report", "/api/reports/weekly"],
    ];

    for (const [id, label, path, opts] of endpoints) {
      results.push(await fetchCheck(id, label, path, opts));
    }

    const icon192 = await fetch("/icon-192.png")
      .then((r) => r.ok)
      .catch(() => false);
    const icon512 = await fetch("/icon-512.png")
      .then((r) => r.ok)
      .catch(() => false);
    results.push({
      id: "pwa",
      label: "PWA Icons",
      status: icon192 && icon512 ? "pass" : "fail",
      detail: icon192 && icon512 ? "192 + 512 present" : "Missing icons",
    });

    const manifestOk = await fetch("/manifest.json")
      .then((r) => r.ok)
      .catch(() => false);
    results.push({
      id: "manifest",
      label: "PWA Manifest",
      status: manifestOk ? "pass" : "fail",
    });

    setChecks(results);
    setRunning(false);
  };

  useEffect(() => {
    runChecks();
  }, []);

  const passed = checks.filter((c) => c.status === "pass").length;
  const failed = checks.filter((c) => c.status === "fail").length;
  const allPass = checks.length > 0 && failed === 0;

  return (
    <div className="space-y-8">
      <PageBack href="/" />
      <PageHeader title="Launch Checklist" subtitle={`Production readiness — API: ${API_URL}`} badge="DevOps" />

      {running && checks.length === 0 ? (
        <Skeleton className="h-32" />
      ) : (
        health && (
          <Card className={health.status === "ok" ? "border-success/30 bg-success/5" : "border-warning/30 bg-warning/5"}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">API Status: {health.status.toUpperCase()}</p>
                <p className="text-sm text-muted">
                  v{health.version} · Phase {health.phase} · {health.checks.tableCount} DB tables
                </p>
              </div>
              <Badge variant={health.status === "ok" ? "success" : "warning"}>
                {health.status === "ok" ? "Healthy" : "Degraded"}
              </Badge>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-3">
              <span>DB: {health.checks.database ? "Yes" : "No"}</span>
              <span>Auth tables: {health.checks.authTables ? "Yes" : "No"}</span>
              <span>JWT: {health.checks.jwtConfigured ? "Configured" : "Missing"}</span>
              <span>AI: {health.checks.aiBinding ? "Yes" : "No"}</span>
              <span>Voice R2: {health.checks.voiceBucket ? "Yes" : "No"}</span>
              <span>WebSocket DO: {health.checks.durableObjects ? "Yes" : "No"}</span>
            </div>
          </Card>
        )
      )}

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            Smoke Tests — {passed}/{checks.length} passed
          </h2>
          <Button variant="secondary" onClick={runChecks} disabled={running}>
            <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
            {running ? "Running..." : "Re-run"}
          </Button>
        </div>

        <div className="space-y-2">
          {checks.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between border-b border-surface-border py-2 last:border-0 dark:border-gray-800"
            >
              <span className="text-foreground">{c.label}</span>
              <div className="flex items-center gap-2 text-sm">
                {c.detail && <span className="text-muted">{c.detail}</span>}
                {c.status === "pass" ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : c.status === "fail" ? (
                  <XCircle className="h-4 w-4 text-danger" />
                ) : (
                  <span className="text-muted">…</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {allPass && (
        <Card className="border-success/30 bg-success/5 text-center">
          <Rocket className="mx-auto h-8 w-8 text-success" />
          <p className="mt-2 text-lg font-semibold text-foreground">Ready to launch!</p>
          <p className="mt-1 text-sm text-muted">All checks passed. Start your Day 1 session.</p>
        </Card>
      )}

      <Card className="space-y-3">
        <h2 className="font-semibold text-foreground">Deploy Commands</h2>
        <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm text-green-400">
          {`# Full production deploy
export NEXT_PUBLIC_API_URL=https://your-api.workers.dev
# Set JWT_SECRET on the API Worker (wrangler secret put JWT_SECRET)
npm run deploy:all

# Smoke test only
npm run smoke

# Validate env
npm run validate:env`}
        </pre>
      </Card>
    </div>
  );
}
