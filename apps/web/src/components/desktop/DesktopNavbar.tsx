"use client";

import Link from "next/link";
import { Bell, Flame, Moon, Plus, Sun, Zap } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { FeatureSearch } from "@/components/layout/FeatureSearch";
import { UserMenu } from "@/components/layout/UserMenu";
import type { DashboardMetrics } from "./dashboard-metrics";
import { cn } from "@/lib/utils";

export function DesktopNavbar({ m }: { m: DashboardMetrics }) {
  const { theme, toggle } = useTheme();

  return (
    <header className="dk-navbar sticky top-0 z-30 mx-10 mt-6 flex h-[4.5rem] items-center gap-4 rounded-[24px] border px-5">
      <FeatureSearch className="min-w-[200px] max-w-md flex-1" />

      <div className="hidden items-center gap-2 lg:flex">
        <span className="dk-pill flex items-center gap-1.5 text-orange-600">
          <Flame className="h-4 w-4" /> {m.dashboard.streak}d
        </span>
        <span className="dk-pill flex items-center gap-1.5 text-violet-700 dark:text-violet-300">
          <Zap className="h-4 w-4" /> {m.xp} XP
        </span>
        <span className="dk-pill">🪙 {m.coins}</span>
        <span className="dk-pill">Lv {m.level}</span>
      </div>

      <div className="flex items-center gap-1">
        <Link href="/session" className="dk-icon-btn hidden lg:flex" title="Quick add session">
          <Plus className="h-[18px] w-[18px]" />
        </Link>
        <span className="hidden rounded-xl bg-white/50 px-2.5 py-1.5 text-[11px] font-bold text-muted lg:inline">⌘K</span>
        <Link href="/settings" className="dk-icon-btn" aria-label="Settings and notifications">
          <Bell className="h-[18px] w-[18px]" />
        </Link>
        <button type="button" onClick={toggle} className="dk-icon-btn" aria-label="Theme">
          {theme === "dark" ? <Sun className="h-[18px] w-[18px] text-amber-400" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>
        <div className={cn("ml-1 border-l border-white/40 pl-2")}>
          <UserMenu variant="desktop" />
        </div>
      </div>
    </header>
  );
}
