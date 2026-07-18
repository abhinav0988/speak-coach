"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth, getInitials } from "@/components/AuthProvider";
import { useSidebarData } from "@/hooks/useSidebarData";
import { USER_NAME } from "@/components/dashboard/constants";
import { DESKTOP_SIDEBAR_NAV } from "@/lib/primaryNav";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const name = user?.name?.split(" ")[0] ?? USER_NAME;
  const sidebar = useSidebarData(name);

  return (
    <aside className="dk-sidebar sticky top-0 flex h-dvh max-h-dvh w-[280px] shrink-0 flex-col overflow-hidden self-start border-r border-white/50 p-5">
      <Link href="/dashboard" className="mb-6 flex shrink-0 items-center gap-3 px-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white shadow-[0_8px_24px_rgba(79,70,229,0.35)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[15px] font-black text-foreground">Speak Coach</p>
          <p className="text-[10px] font-semibold text-muted">Premium</p>
        </div>
      </Link>

      <div className="dk-glass mb-5 shrink-0 rounded-[20px] p-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#4F46E5] to-[#EC4899] text-sm font-bold text-white">
            {sidebar.initials || getInitials(user?.name ?? name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{sidebar.displayName || name}</p>
            <p className="text-[11px] text-muted">Lv {sidebar.level} · {sidebar.streak}d streak</p>
          </div>
        </div>
      </div>

      <nav className="dk-sidebar-scroll min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-y-contain" aria-label="Desktop navigation">
        {DESKTOP_SIDEBAR_NAV.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "dk-nav-item group relative flex items-center gap-3 rounded-2xl px-3.5 py-3 text-[14px] font-semibold transition-all",
                active
                  ? "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-[0_8px_24px_rgba(79,70,229,0.3)]"
                  : "text-muted hover:bg-white/60 hover:text-foreground"
              )}
            >
              {active && <span className="dk-nav-glow absolute inset-0 rounded-2xl" aria-hidden />}
              <Icon className="relative h-[18px] w-[18px] shrink-0" strokeWidth={active ? 2.5 : 2} />
              <span className="relative">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={signOut}
        className="mt-4 flex w-full shrink-0 items-center gap-3 rounded-2xl px-3.5 py-3 text-[14px] font-semibold text-rose-500 transition hover:bg-rose-500/10"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Logout
      </button>
    </aside>
  );
}
