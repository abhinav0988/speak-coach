"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_BOTTOM_NAV } from "@/lib/primaryNav";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname === "/sign-in" || pathname === "/sign-up" || pathname === "/auth" || pathname.startsWith("/auth/")) return null;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.5rem+env(safe-area-inset-bottom))] sm:px-4 md:hidden"
      aria-label="Mobile navigation"
    >
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-lg items-stretch justify-around gap-0.5 rounded-[28px] border p-1.5",
          "border-white/50 bg-white/75 shadow-glass backdrop-blur-[30px]",
          "dark:border-white/10 dark:bg-slate-900/80"
        )}
      >
        {MOBILE_BOTTOM_NAV.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex min-h-touch min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[22px] px-1 py-1.5 text-[10px] font-bold transition sm:text-[11px]",
                active
                  ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)]"
                  : "text-muted hover:text-foreground"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className={cn("h-5 w-5 shrink-0 sm:h-[22px] sm:w-[22px]", active && "scale-110")} strokeWidth={active ? 2.5 : 2} />
              <span className="max-w-full truncate leading-tight">{tab.shortLabel ?? tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
