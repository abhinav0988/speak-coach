"use client";

import { cn } from "@/lib/utils";

export function ChartDetailPanel({
  title,
  rows,
  onClear,
  className,
}: {
  title: string;
  rows: Array<{ label: string; value: string | number; highlight?: boolean }>;
  onClear?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm dark:bg-primary/10",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="font-semibold text-foreground">{title}</p>
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted hover:text-foreground"
          >
            Clear
          </button>
        )}
      </div>
      <dl className="grid gap-1.5 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3 sm:block">
            <dt className="text-muted">{row.label}</dt>
            <dd className={cn("font-semibold text-foreground", row.highlight && "text-primary")}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
