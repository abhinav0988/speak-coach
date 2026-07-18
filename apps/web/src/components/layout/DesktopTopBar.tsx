"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Flame, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sparkles, Sun, Zap } from "lucide-react";
import { useAuthOptional } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { FeatureSearch } from "@/components/layout/FeatureSearch";
import { UserMenu } from "@/components/layout/UserMenu";
import { useSidebar } from "@/components/layout/SidebarContext";
import { useSidebarData } from "@/hooks/useSidebarData";
import { USER_NAME } from "@/components/dashboard/constants";
import { PRIMARY_NAV } from "@/lib/primaryNav";
import { cn } from "@/lib/utils";

/** Premium desktop header — full nav, search, stats, actions */
export function DesktopTopBar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { desktopOpen, toggleDesktop } = useSidebar();
  const auth = useAuthOptional();
  const firstName = auth?.user?.name?.split(" ")[0] ?? USER_NAME;
  const sidebar = useSidebarData(firstName, { autoRefresh: false });

  return (
    <header className="sticky top-0 z-40 hidden px-6 pt-4 lg:block xl:px-10">
      <div
        className={cn(
          "ds-topbar flex h-[4.25rem] items-center gap-4 rounded-[24px] border px-4 xl:gap-6 xl:px-5",
          "border-white/60 bg-white/75 shadow-glass backdrop-blur-[30px]",
          "dark:border-white/10 dark:bg-slate-900/75"
        )}
      >
        {/* Sidebar toggle — premium icon button */}
        <button
          type="button"
          onClick={toggleDesktop}
          className={cn(
            "group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
            "border border-white/60 bg-gradient-to-br from-white/90 to-white/50 shadow-md",
            "hover:border-violet-300/60 hover:shadow-[0_0_24px_rgba(124,58,237,0.2)]",
            "dark:border-white/10 dark:from-slate-800/90 dark:to-slate-900/50",
            desktopOpen && "border-violet-400/50 bg-gradient-to-br from-violet-500/15 to-blue-500/10 shadow-[0_0_20px_rgba(124,58,237,0.25)]"
          )}
          aria-label={desktopOpen ? "Close sidebar" : "Open sidebar"}
          aria-expanded={desktopOpen}
        >
          {desktopOpen ? (
            <PanelLeftClose className="h-[18px] w-[18px] text-violet-600 transition group-hover:scale-110 dark:text-violet-400" />
          ) : (
            <PanelLeftOpen className="h-[18px] w-[18px] text-violet-600 transition group-hover:scale-110 dark:text-violet-400" />
          )}
        </button>

        <Link href="/dashboard" className="group flex shrink-0 items-center gap-2.5 pr-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition group-hover:scale-105">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="hidden lg:block">
            <p className="text-[15px] font-black leading-none tracking-tight text-foreground">Speak Coach</p>
            <p className="mt-0.5 text-[10px] font-semibold text-muted">Premium Learning</p>
          </div>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto scrollbar-none xl:gap-1" aria-label="Main">
          {PRIMARY_NAV.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2.5 text-[13px] font-bold transition xl:px-3.5",
                  active
                    ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-[0_6px_20px_rgba(37,99,235,0.3)]"
                    : "text-muted hover:bg-white/60 hover:text-foreground dark:hover:bg-white/10"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
                <span className="hidden lg:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden w-full max-w-[200px] shrink-0 lg:block lg:max-w-[220px] xl:max-w-xs">
          <FeatureSearch className="w-full" />
        </div>

        <div className="flex shrink-0 items-center gap-1.5 xl:gap-2">
          {!sidebar.loading && (
            <>
              <Link
                href="/rewards"
                className="hidden items-center gap-1.5 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-2.5 py-2 text-[12px] font-bold text-orange-600 ring-1 ring-orange-500/20 transition hover:scale-105 md:flex"
                title="Streak"
              >
                <Flame className="h-4 w-4" />
                <span>{sidebar.streak}d</span>
              </Link>
              <div
                className="hidden items-center gap-1.5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 px-2.5 py-2 text-[12px] font-bold text-violet-700 ring-1 ring-violet-500/20 md:flex dark:text-violet-300"
                title="XP"
              >
                <Zap className="h-4 w-4" />
                <span>{sidebar.xp}</span>
              </div>
            </>
          )}

          <Link
            href="/settings"
            className="flex min-h-10 min-w-10 items-center justify-center rounded-2xl text-muted transition hover:bg-white/50 dark:hover:bg-white/10"
            aria-label="Settings and notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
          </Link>

          <button
            type="button"
            onClick={toggle}
            className="flex min-h-10 min-w-10 items-center justify-center rounded-2xl text-muted transition hover:bg-white/50 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px] text-amber-400" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          <div className="ml-0.5 border-l border-white/40 pl-2 dark:border-white/10">
            <UserMenu variant="desktop" />
          </div>
        </div>
      </div>
    </header>
  );
}

/** Compact mobile header */
export function MobileTopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] lg:hidden">
      <div
        className={cn(
          "mx-2 mt-2 flex h-14 items-center gap-2 rounded-[24px] border px-3 shadow-glass backdrop-blur-[30px] sm:mx-4 sm:gap-3 sm:px-4",
          "border-white/60 bg-white/70 dark:border-white/10 dark:bg-slate-900/70"
        )}
      >
        <button
          type="button"
          onClick={onMenuClick}
          className="flex min-h-touch min-w-touch items-center justify-center rounded-2xl text-muted transition hover:bg-white/50 dark:hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-1 items-center">
          <FeatureSearch className="w-full min-w-0" />
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={toggle}
            className="flex min-h-touch min-w-touch items-center justify-center rounded-2xl text-muted transition hover:bg-white/50 dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </button>
          <UserMenu variant="mobile" />
        </div>
      </div>
    </header>
  );
}
