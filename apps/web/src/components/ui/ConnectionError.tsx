"use client";

import { useState } from "react";
import { RefreshCw, Server, Terminal } from "lucide-react";
import { Button, Card } from "@/components/ui/primitives";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export function ConnectionError({
  title = "Can't reach the server",
  description,
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  const [retrying, setRetrying] = useState(false);

  const retry = async () => {
    if (!onRetry) {
      window.location.reload();
      return;
    }
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  };

  return (
    <Card className="mx-auto max-w-lg text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
        <Server className="h-6 w-6 text-danger" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <p className="mt-2 text-sm text-muted">
        {description ??
          "The app couldn't load your data. This usually means the API isn't running yet."}
      </p>

      <div className="mt-6 rounded-lg bg-surface-muted p-4 text-left text-sm dark:bg-gray-800/50">
        <p className="mb-2 flex items-center gap-2 font-medium text-foreground">
          <Terminal className="h-4 w-4 text-primary" />
          Quick fix
        </p>
        <p className="text-muted">From the project root, start API + web together:</p>
        <code className="mt-2 block rounded-md bg-gray-900 px-3 py-2 text-xs text-green-400">
          cd ~/Videos/Speak{"\n"}
          npm run dev
        </code>
        <p className="mt-3 text-xs text-muted">
          API expected at <span className="font-mono text-foreground">{API_URL}</span>
        </p>
      </div>

      <Button className="mt-6" onClick={retry} disabled={retrying}>
        <RefreshCw className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`} />
        {retrying ? "Retrying…" : "Try again"}
      </Button>
    </Card>
  );
}
