"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { FEATURE_GROUPS, isPathActive } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function ExploreMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-btn px-3 py-2 text-sm font-medium transition-colors",
          open || FEATURE_GROUPS.some((g) => g.items.some((i) => isPathActive(pathname, i.href)))
            ? "bg-primary/10 text-primary"
            : "text-muted hover:bg-surface-muted hover:text-foreground"
        )}
        aria-expanded={open}
      >
        Explore
        <ChevronDown className={cn("h-3.5 w-3.5 transition", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute left-0 top-full z-50 mt-2 w-[min(90vw,720px)] rounded-card border border-surface-border bg-[var(--card)] p-4 shadow-elevated dark:border-gray-700">
            <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-muted">
              All features — organized for you
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURE_GROUPS.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <div key={group.id} className="rounded-xl bg-surface-muted/50 p-3 dark:bg-gray-900/50">
                    <div className="mb-2 flex items-center gap-2">
                      <GroupIcon className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{group.label}</p>
                        <p className="text-[11px] text-muted">{group.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const active = isPathActive(pathname, item.href);
                        return (
                          <li key={item.href + item.label}>
                            <Link
                              href={item.href}
                              onClick={() => {
                                setOpen(false);
                                onNavigate?.();
                              }}
                              className={cn(
                                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-[var(--card)]",
                                active && "font-semibold text-primary"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5 shrink-0 text-muted" />
                              <span className="truncate">{item.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
