"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_BOTTOM_NAV } from "@/lib/primaryNav";
import { cn } from "@/lib/utils";

/** Compact icon rail for tablet two-pane layout (768–1023px). */
export function TabletSidebarRail({ onExpandTree }: { onExpandTree?: () => void }) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden h-full w-[72px] shrink-0 flex-col items-center gap-1 border-r border-white/40 bg-white/40 py-4 dark:border-white/10 dark:bg-slate-900/40 md:flex lg:hidden"
      aria-label="Tablet navigation rail"
    >
      {MOBILE_BOTTOM_NAV.map((tab) => {
        const Icon = tab.icon;
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex h-12 w-12 flex-col items-center justify-center rounded-2xl transition",
              active
                ? "bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-[0_6px_18px_rgba(37,99,235,0.35)]"
                : "text-muted hover:bg-white/60 hover:text-foreground dark:hover:bg-white/10"
            )}
            aria-current={active ? "page" : undefined}
            title={tab.label}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
          </Link>
        );
      })}
      {onExpandTree && (
        <button
          type="button"
          onClick={onExpandTree}
          className="mt-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-dashed border-violet-300/60 text-violet-600 transition hover:bg-violet-500/10 dark:border-violet-500/30 dark:text-violet-400"
          title="Open feature tree"
          aria-label="Open feature tree"
        >
          <span className="text-lg">☰</span>
        </button>
      )}
    </nav>
  );
}
