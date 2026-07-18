"use client";

import { useMemo, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bot,
  ChevronDown,
  Flame,
  Gem,
  Mic2,
  Moon,
  Play,
  Search,
  Settings,
  Sparkles,
  Sun,
  Target,
  Trophy,
  Waves,
  X,
} from "lucide-react";
import { useAuthOptional } from "@/components/AuthProvider";
import { USER_NAME } from "@/components/dashboard/constants";
import { useTheme } from "@/components/ThemeProvider";
import { useSidebarData } from "@/hooks/useSidebarData";
import { SIDEBAR_SECTIONS } from "@/lib/sidebarNav";
import { cn } from "@/lib/utils";

type SideNavProps = {
  onNavigate?: () => void;
  onClose?: () => void;
  className?: string;
  mobile?: boolean;
  desktopOverlay?: boolean;
};

const QUICK_ACTIONS = [
  { label: "Continue Practice", href: "/", icon: Sparkles, tint: "from-blue-500/20 to-violet-500/20" },
  { label: "Resume Lesson", href: "/session", icon: Play, tint: "from-cyan-500/20 to-blue-500/20" },
  { label: "Today's Goal", href: "/dashboard", icon: Target, tint: "from-amber-500/20 to-orange-500/20" },
  { label: "AI Coach", href: "/coach", icon: Bot, tint: "from-pink-500/20 to-fuchsia-500/20" },
] as const;

const SECTION_EMOJI: Record<string, string> = {
  Home: "🏠",
  Learning: "📚",
  Analytics: "📈",
  AI: "🤖",
  Recordings: "🎤",
  Account: "⚙",
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

function StatSkeleton() {
  return <div className="h-8 w-16 animate-pulse rounded-lg bg-slate-200/80" />;
}

function iconTheme(label: string) {
  if (/coach|ai|feedback|analysis|suggestions|plan/i.test(label)) {
    return { bg: "from-pink-500/25 to-fuchsia-500/25", fg: "text-pink-600" };
  }
  if (/grammar|correction/i.test(label)) {
    return { bg: "from-emerald-500/25 to-green-500/25", fg: "text-emerald-600" };
  }
  if (/vocabulary/i.test(label)) return { bg: "from-amber-500/25 to-orange-500/25", fg: "text-amber-600" };
  if (/progress|analytics|score|report|performance|activity|achievement/i.test(label)) {
    return { bg: "from-cyan-500/25 to-sky-500/25", fg: "text-cyan-600" };
  }
  if (/record|voice|session|saved|favorites/i.test(label)) {
    return { bg: "from-indigo-500/25 to-violet-500/25", fg: "text-indigo-600" };
  }
  if (/settings|profile|notification|account|language|appearance|help/i.test(label)) {
    return { bg: "from-slate-400/25 to-slate-500/25", fg: "text-slate-600" };
  }
  return { bg: "from-blue-500/25 to-violet-500/25", fg: "text-blue-600" };
}

function ProgressRing({ pct }: { pct: number }) {
  return (
    <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90 drop-shadow-sm" aria-hidden>
      <path
        d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
        fill="none"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="3"
      />
      <path
        d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={`${pct} ${100 - pct}`}
        className="premium-ring-progress"
      />
    </svg>
  );
}

export function SideNav({ onNavigate, onClose, className, mobile = false, desktopOverlay = false }: SideNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuthOptional();
  const { theme, toggle } = useTheme();
  const displayName = auth?.user?.name?.split(" ")[0] ?? USER_NAME;
  const sidebar = useSidebarData(displayName);
  const [query, setQuery] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(SIDEBAR_SECTIONS.map((s) => [s.title, true]))
  );

  const greeting = sidebar.greeting || getGreeting();
  const weeklyPct = sidebar.weeklyXpTarget
    ? Math.min(100, Math.round((sidebar.weeklyXp / sidebar.weeklyXpTarget) * 100))
    : 0;

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SIDEBAR_SECTIONS;
    return SIDEBAR_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.label.toLowerCase().includes(q)),
    })).filter((section) => section.items.length > 0);
  }, [query]);

  const handleNavigate =
    (href: string) => (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      onNavigate?.();
      router.push(href);
    };

  return (
    <aside
      className={cn(
        "relative flex h-full min-h-0 shrink-0 flex-col overflow-hidden",
        "border border-white/50 bg-[linear-gradient(180deg,#F8FAFC_0%,#EEF2FF_45%,#F6F5FF_75%,#FFFFFF_100%)]",
        "shadow-[0_28px_70px_-30px_rgba(37,99,235,0.4)] backdrop-blur-2xl",
        mobile
          ? "premium-drawer-enter w-[84vw] max-w-[390px] rounded-r-[32px] border-l-0"
          : desktopOverlay
            ? "premium-drawer-enter w-[min(400px,32vw)] min-w-[340px] max-w-[420px] rounded-r-[32px] border-l-0 shadow-[0_32px_80px_-20px_rgba(37,99,235,0.35)]"
            : "hidden w-[330px] rounded-r-[28px] border-l-0 lg:flex",
        className
      )}
      aria-label="Navigation"
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-white/50 bg-white/70 text-muted shadow-sm backdrop-blur transition hover:bg-white hover:text-foreground dark:border-white/10 dark:bg-slate-800/80"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-12 top-16 h-44 w-44 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -right-10 top-1/3 h-52 w-52 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute bottom-32 left-8 h-36 w-36 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-4 top-2 h-24 w-24 rounded-full bg-pink-400/8 blur-2xl" />
      </div>

      <div className="premium-drawer-scroll relative min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-5 pb-10 pt-5">
        {/* Profile header */}
        <div
          className="premium-fade-up premium-card-glow premium-gradient-border rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-[0_16px_48px_-24px_rgba(15,23,42,0.14)] backdrop-blur-xl"
          style={{ animationDelay: "0.04s" }}
        >
          <div className="flex items-start gap-3.5">
            <div className="premium-avatar-ring rounded-full bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#EC4899] p-[3px] shadow-[0_0_24px_rgba(124,58,237,0.35)]">
              <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-gradient-to-br from-white to-slate-50 text-xl font-bold text-[#1E293B]">
                {sidebar.initials}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-wide text-muted">{greeting} 👋</p>
              <p className="truncate text-[22px] font-bold tracking-tight text-foreground">{sidebar.displayName}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-gradient-to-r from-primary/15 to-secondary/15 px-2.5 py-0.5 text-[11px] font-bold text-primary ring-1 ring-primary/15">
                  Level {sidebar.level} {sidebar.levelName}
                </span>
                <span className="premium-flame rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200/60">
                  🔥 {sidebar.streak} Days
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-violet-100/80 px-3 py-2.5 shadow-inner">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">XP</p>
              {sidebar.loading ? <StatSkeleton /> : <p className="text-[26px] font-bold leading-tight text-foreground">{sidebar.xp}</p>}
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-100/80 px-3 py-2.5 shadow-inner">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Level</p>
              {sidebar.loading ? (
                <StatSkeleton />
              ) : (
                <div>
                  <p className="text-[26px] font-bold leading-tight text-foreground">{sidebar.level}</p>
                  <p className="text-[11px] font-semibold text-emerald-700">{sidebar.levelName}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[11px] font-semibold text-muted">
              <span>Weekly XP</span>
              <span className="text-primary">
                {sidebar.loading ? "…" : `${sidebar.weeklyXp} / ${sidebar.weeklyXpTarget}`}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#22C55E] via-[#14B8A6] to-[#06B6D4] transition-all duration-700"
                style={{ width: sidebar.loading ? "0%" : `${weeklyPct}%` }}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[11px] font-semibold text-muted">
              <span>Level Progress</span>
              <span className="text-secondary">{sidebar.loading ? "…" : `${sidebar.levelProgressPct}%`}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED] transition-all duration-700"
                style={{ width: sidebar.loading ? "0%" : `${sidebar.levelProgressPct}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Link
              href="/profile"
              onClick={onNavigate}
              className="flex-1 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-center text-xs font-bold text-foreground shadow-sm transition hover:bg-white hover:shadow-md active:scale-[0.98]"
            >
              Edit Profile
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              className="rounded-xl border border-white/80 bg-white/90 p-2.5 text-muted shadow-sm transition hover:text-foreground hover:shadow-md active:scale-[0.98]"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link
              href="/settings"
              onClick={onNavigate}
              aria-label="Settings"
              className="rounded-xl border border-white/80 bg-white/90 p-2.5 text-muted shadow-sm transition hover:text-foreground hover:shadow-md active:scale-[0.98]"
            >
              <Settings className="h-4 w-4" />
            </Link>
            <Link
              href="/settings"
              onClick={onNavigate}
              aria-label="Settings and notifications"
              className="relative rounded-xl border border-white/80 bg-white/90 p-2.5 text-muted shadow-sm transition hover:text-foreground hover:shadow-md active:scale-[0.98]"
            >
              <Bell className="h-4 w-4" />
              {!sidebar.practicedToday && sidebar.streak > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </Link>
          </div>
        </div>

        {sidebar.resume && (
        <Link
          href="/session"
          onClick={onNavigate}
          className="premium-fade-up premium-card-glow mt-4 flex items-center gap-3 rounded-[20px] border border-white/55 bg-gradient-to-r from-[#2563EB]/12 via-[#6366F1]/10 to-[#7C3AED]/12 p-3.5 shadow-[0_10px_32px_rgba(15,23,42,0.08)] backdrop-blur"
          style={{ animationDelay: "0.06s" }}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]">
            <Play className="h-4 w-4" fill="currentColor" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted">Continue where you left off</p>
            <p className="truncate text-sm font-bold text-foreground">
              Day {sidebar.resume.dayNumber} · Step {sidebar.resume.nextStep} of {sidebar.resume.totalSteps}
            </p>
            <p className="truncate text-xs text-muted">{sidebar.resume.label}</p>
          </div>
          <ChevronDown className="h-4 w-4 -rotate-90 text-primary" />
        </Link>
        )}

        {/* Search */}
        <div
          className="premium-fade-up premium-card-glow mt-4 flex items-center gap-2 rounded-[20px] border border-white/55 bg-white/60 px-3.5 py-3 shadow-[0_10px_32px_rgba(15,23,42,0.07)] backdrop-blur"
          style={{ animationDelay: "0.08s" }}
        >
          <Search className="h-4 w-4 shrink-0 text-primary/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons or features"
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
            aria-label="Search navigation"
          />
          <button
            type="button"
            aria-label="Voice search"
            className="rounded-xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 p-2 text-cyan-700 transition hover:from-cyan-500/25 hover:to-blue-500/25"
          >
            <Mic2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Quick actions */}
        <div
          className="premium-fade-up mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none"
          style={{ animationDelay: "0.1s" }}
        >
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                onClick={handleNavigate(action.href)}
                className={cn(
                  "premium-chip inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r px-3.5 py-2.5 text-xs font-bold text-primary ring-1 ring-primary/15 transition hover:scale-[1.04] active:scale-[0.98]",
                  action.tint
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {action.label}
              </Link>
            );
          })}
        </div>

        {/* Grouped navigation */}
        <nav className="mt-5 space-y-4" aria-label="Main navigation">
          {filteredSections.map((section, sectionIdx) => {
            const SectionIcon = section.icon;
            const isOpen = openSections[section.title] ?? true;

            return (
              <div
                key={section.title}
                className="premium-fade-up premium-card-glow rounded-[22px] border border-white/50 bg-white/55 p-3.5 shadow-[0_10px_32px_rgba(15,23,42,0.08)] backdrop-blur"
                style={{ animationDelay: `${0.12 + sectionIdx * 0.04}s` }}
              >
                <button
                  type="button"
                  onClick={() => setOpenSections((prev) => ({ ...prev, [section.title]: !isOpen }))}
                  className="flex w-full items-center justify-between rounded-xl px-1 py-1"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm leading-none" aria-hidden>
                      {SECTION_EMOJI[section.title]}
                    </span>
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100/80">
                      <SectionIcon className="h-3.5 w-3.5 text-slate-500" strokeWidth={2.2} />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
                      {section.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-slate-400 transition-transform duration-300",
                      isOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>
                <div className="mt-2.5 h-px bg-gradient-to-r from-slate-200 via-slate-300/80 to-transparent" />

                {isOpen && (
                  <ul className="mt-3 space-y-1.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = item.match(pathname);
                      const theme = iconTheme(item.label);
                      return (
                        <li key={`${section.title}-${item.label}`}>
                          <Link
                            href={item.href}
                            onClick={handleNavigate(item.href)}
                            className={cn(
                              "premium-nav-item",
                              active ? "premium-nav-item-active ring-1 ring-blue-300/50" : "premium-nav-item-idle"
                            )}
                          >
                            {active && (
                              <>
                                <span className="absolute left-0 top-3 bottom-3 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
                                <span className="premium-active-dot absolute right-3.5 h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.9)]" />
                              </>
                            )}
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-transform duration-300",
                                active ? "from-white/30 to-white/15" : theme.bg
                              )}
                            >
                              <Icon
                                className={cn("h-[22px] w-[22px]", active ? "text-white" : theme.fg)}
                                strokeWidth={active ? 2.3 : 2}
                              />
                            </div>
                            <span className="premium-nav-label flex-1">{item.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom cards */}
        <div className="mt-6 space-y-3">
          <div className="premium-fade-up premium-goal-card rounded-[24px] p-4 text-white shadow-[0_24px_48px_-22px_rgba(37,99,235,0.8)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/75">Today&apos;s Goal</p>
                <p className="text-2xl font-bold">
                  {sidebar.loading ? "…" : `${sidebar.todayMinutes} / ${sidebar.goalMinutes} min`}
                </p>
                <p className="mt-0.5 text-xs text-white/70">
                  {sidebar.loading
                    ? "Loading…"
                    : sidebar.goalRemainingMin > 0
                      ? `+${sidebar.goalRemainingMin} min to complete`
                      : "Goal complete!"}
                </p>
              </div>
              <ProgressRing pct={sidebar.loading ? 0 : sidebar.goalProgressPct} />
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.5)] transition-all duration-700"
                style={{ width: sidebar.loading ? "0%" : `${sidebar.goalProgressPct}%` }}
              />
            </div>
            <Link
              href="/session"
              onClick={onNavigate}
              className="mt-3 inline-flex rounded-xl bg-white/25 px-4 py-2.5 text-sm font-bold backdrop-blur transition hover:bg-white/35 active:scale-[0.98]"
            >
              Continue
            </Link>
          </div>

          <div className="premium-fade-up premium-card-glow rounded-[20px] border border-amber-200/50 bg-gradient-to-br from-amber-50/90 to-orange-50/80 p-4 shadow-[0_10px_32px_rgba(15,23,42,0.07)]">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Achievement</p>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div>
                {sidebar.latestBadge && (
                  <>
                    <p className="text-xs font-semibold text-amber-800/70">Latest Badge</p>
                    <p className="text-sm font-bold text-foreground">{sidebar.latestBadge}</p>
                  </>
                )}
                <p className={cn("text-xs font-medium text-muted", sidebar.latestBadge && "mt-1.5")}>Current Streak</p>
                <p className="text-xl font-bold text-foreground">
                  {sidebar.loading ? "…" : `${sidebar.streak} Days`}
                </p>
              </div>
              <span className="premium-flame text-3xl drop-shadow-sm" aria-hidden>
                🔥
              </span>
            </div>
          </div>

          <div className="premium-fade-up premium-card-glow rounded-[20px] border border-violet-200/50 bg-gradient-to-br from-violet-50/95 to-blue-50/90 p-4 shadow-[0_10px_32px_rgba(15,23,42,0.07)]">
            <div className="flex items-center gap-2">
              <Gem className="h-4 w-4 text-secondary" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-secondary">Premium Membership</p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              Unlimited AI Coach, advanced analytics, voice insights & priority support.
            </p>
          </div>

          <div className="premium-fade-up premium-ai-border relative rounded-[20px] border border-white/50 bg-white/70 p-4 shadow-[0_10px_32px_rgba(15,23,42,0.07)] backdrop-blur-xl">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
              <Sparkles className="h-3.5 w-3.5 text-secondary" />
              AI Coach Tip
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {sidebar.loading ? "Loading your coach insights…" : sidebar.aiTip}
            </p>
            {!sidebar.loading && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-2.5 py-1 text-[11px] font-bold text-pink-700">
              <Waves className="h-3 w-3" />
              {sidebar.aiRecommendation}
            </div>
            )}
            <Link
              href="/coach"
              onClick={onNavigate}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#7C3AED] via-[#6366F1] to-[#2563EB] px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(124,58,237,0.35)] transition hover:opacity-95 active:scale-[0.98]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Practice Now
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="premium-fade-up mt-5 rounded-2xl border border-white/50 bg-white/60 px-3.5 py-3.5 text-[11px] text-muted shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between">
            <span className="font-medium">Version 1.0.0</span>
            <span className="rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Premium
            </span>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
            <span>Fluency: {sidebar.loading ? "…" : `${sidebar.fluencyScore}%`}</span>
            <span className={sidebar.practicedToday ? "text-emerald-600" : "text-amber-600"}>
              {sidebar.loading ? "…" : sidebar.practicedToday ? "● Practiced today" : "○ Practice today"}
            </span>
          </div>
          <div className="mt-2 flex gap-4">
            <button type="button" className="font-medium transition hover:text-foreground">
              Privacy
            </button>
            <button type="button" className="font-medium transition hover:text-foreground">
              Terms
            </button>
          </div>
        </footer>
      </div>
    </aside>
  );
}
