import { LayoutDashboard } from "lucide-react";

export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="relative my-8 py-2" role="separator" aria-label={label}>
      <div className="absolute inset-0 flex items-center px-1">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-surface-border to-transparent dark:via-gray-700" />
      </div>
      <div className="relative flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-[var(--card)] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted shadow-soft dark:border-gray-800">
          {label === "Dashboard" && <LayoutDashboard className="h-3.5 w-3.5 text-primary" />}
          {label}
        </span>
      </div>
    </div>
  );
}
