"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Gift, Sparkles, Trophy, Users } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { ConfettiCelebration } from "@/components/dashboard/MotivationHub";
import { ConnectionError } from "@/components/ui/ConnectionError";
import { Skeleton } from "@/components/ui/primitives";
import { AuroraBackground } from "@/components/luxury-dashboard/AuroraBackground";
import { GlassCard, GradientButton, PillBadge, SectionLabel } from "@/components/luxury-dashboard/design-system";
import { cn } from "@/lib/utils";

const SPIN_REWARDS = [
  { label: "+25 XP", color: "from-blue-500 to-indigo-600" },
  { label: "+50 XP", color: "from-violet-500 to-purple-600" },
  { label: "+10 Coins", color: "from-amber-400 to-orange-500" },
  { label: "Streak Shield", color: "from-cyan-500 to-teal-500" },
  { label: "+75 XP", color: "from-pink-500 to-rose-500" },
  { label: "Bonus Chest", color: "from-emerald-500 to-green-600" },
];

const TABS = [
  { id: "daily", label: "Daily Reward", icon: Gift },
  { id: "spin", label: "Lucky Spin", icon: Sparkles },
  { id: "chest", label: "Treasure Chest", icon: Trophy },
  { id: "challenge", label: "Challenge", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function RewardsHub() {
  const searchParams = useSearchParams();
  const tabParam = (searchParams.get("tab") ?? "daily") as TabId;
  const [tab, setTab] = useState<TabId>(TABS.some((t) => t.id === tabParam) ? tabParam : "daily");
  const { data, loading, error, refresh } = useDashboardData();
  const [celebrate, setCelebrate] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);

  useEffect(() => {
    if (TABS.some((t) => t.id === tabParam)) setTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    const key = `speak-daily-reward-${todayKey()}`;
    setDailyClaimed(localStorage.getItem(key) === "1");
    setChestOpen(localStorage.getItem(`speak-chest-${todayKey()}`) === "1");
  }, []);

  const practicedToday = data?.dashboard.practicedToday ?? false;
  const weeklyDays = data?.analytics?.weeklyStats?.filter((w) => w.minutes > 0).length ?? 0;
  const chestUnlocked = weeklyDays >= 3 || (data?.dashboard.streak ?? 0) >= 5;

  const claimDaily = useCallback(() => {
    if (!practicedToday || dailyClaimed) return;
    localStorage.setItem(`speak-daily-reward-${todayKey()}`, "1");
    setDailyClaimed(true);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2500);
  }, [practicedToday, dailyClaimed]);

  const spinWheel = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    const idx = Math.floor(Math.random() * SPIN_REWARDS.length);
    const segment = 360 / SPIN_REWARDS.length;
    const target = 360 * 5 + idx * segment + segment / 2;
    setRotation((r) => r + target);
    setTimeout(() => {
      setSpinResult(SPIN_REWARDS[idx].label);
      setSpinning(false);
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2500);
    }, 4200);
  }, [spinning]);

  const openChest = useCallback(() => {
    if (!chestUnlocked || chestOpen) return;
    localStorage.setItem(`speak-chest-${todayKey()}`, "1");
    setChestOpen(true);
    setCelebrate(true);
    setTimeout(() => setCelebrate(false), 2500);
  }, [chestUnlocked, chestOpen]);

  const activeTab = useMemo(() => TABS.find((t) => t.id === tab) ?? TABS[0], [tab]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-64 rounded-[28px]" />
      </div>
    );
  }

  if (error || !data) {
    return <ConnectionError title="Rewards couldn't load" onRetry={refresh} />;
  }

  return (
    <div className="relative mx-auto w-full min-w-0 max-w-narrow space-y-8">
      <AuroraBackground />
      {celebrate && <ConfettiCelebration show={celebrate} />}

      <div className="relative flex items-center gap-4">
        <Link href="/" className="ld-glass flex h-11 w-11 items-center justify-center rounded-2xl border border-white/60 shadow-sm transition hover:-translate-y-0.5">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-[30px] font-black tracking-tight text-foreground">Rewards Center</h1>
          <p className="text-[13px] text-muted">Daily bonuses, spins, and treasure chests</p>
        </div>
      </div>

      <div className="relative flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition",
                active
                  ? "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-lg"
                  : "ld-glass border border-white/60 text-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      <GlassCard className="relative p-6 sm:p-8" glow="purple">
        <SectionLabel title={activeTab.label} subtitle="Premium gamification rewards" />

        {tab === "daily" && (
          <div className="text-center">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="mx-auto flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-amber-400 to-orange-500 text-5xl shadow-[0_20px_50px_rgba(245,158,11,0.4)]"
            >
              🎁
            </motion.div>
            <p className="mt-6 text-[22px] font-bold text-foreground">
              {dailyClaimed ? "Today's reward claimed!" : practicedToday ? "Your daily reward is ready" : "Practice today to unlock"}
            </p>
            <p className="mt-2 text-[13px] text-muted">
              {dailyClaimed ? "+50 XP added to your account" : "Complete any session to claim +50 XP and bonus coins"}
            </p>
            <GradientButton
              className="mt-6"
              onClick={practicedToday && !dailyClaimed ? claimDaily : undefined}
              href={!practicedToday && !dailyClaimed ? "/session" : undefined}
              variant={dailyClaimed ? "ghost" : "primary"}
            >
              {dailyClaimed ? "Come back tomorrow" : practicedToday ? "Claim Reward" : "Start Session"}
            </GradientButton>
            {!practicedToday && !dailyClaimed && (
              <Link href="/session" className="mt-3 block text-sm font-bold text-primary">
                Go to daily session →
              </Link>
            )}
          </div>
        )}

        {tab === "spin" && (
          <div className="flex flex-col items-center">
            <div className="relative">
              <motion.div
                className="ld-spin-wheel relative h-56 w-56 rounded-full border-4 border-white/80 shadow-[0_24px_60px_rgba(124,58,237,0.35)]"
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: [0.2, 0.8, 0.2, 1] }}
                style={{
                  background: `conic-gradient(${SPIN_REWARDS.map((r, i) => {
                    const hue = i * (360 / SPIN_REWARDS.length);
                    return `#6366f1 ${hue}deg ${hue + 360 / SPIN_REWARDS.length}deg`;
                  }).join(", ")})`,
                }}
              />
              <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 text-2xl">▼</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl shadow-lg">🎰</div>
              </div>
            </div>
            {spinResult && <PillBadge tone="ai">{spinResult}</PillBadge>}
            <GradientButton className="mt-6" onClick={spinWheel} variant={spinning ? "ghost" : "primary"}>
              {spinning ? "Spinning…" : "Spin the Wheel"}
            </GradientButton>
          </div>
        )}

        {tab === "chest" && (
          <div className="text-center">
            <motion.button
              type="button"
              onClick={openChest}
              disabled={!chestUnlocked || chestOpen}
              animate={chestOpen ? { scale: [1, 1.1, 1] } : { y: [0, -6, 0] }}
              transition={{ repeat: chestOpen ? 0 : Infinity, duration: 2 }}
              className={cn(
                "mx-auto flex h-32 w-32 items-center justify-center rounded-[28px] text-6xl shadow-xl transition",
                chestUnlocked ? "bg-gradient-to-br from-amber-300 to-yellow-500" : "bg-slate-200 grayscale"
              )}
            >
              {chestOpen ? "✨" : "📦"}
            </motion.button>
            <p className="mt-6 text-[22px] font-bold text-foreground">
              {chestOpen ? "Treasure unlocked!" : chestUnlocked ? "Tap to open your chest" : "Keep practicing to unlock"}
            </p>
            <p className="mt-2 text-[13px] text-muted">
              {chestUnlocked
                ? "Contains 200 XP, rare badge, and league boost"
                : `${weeklyDays}/3 active days this week · or reach a 5-day streak`}
            </p>
          </div>
        )}

        {tab === "challenge" && (
          <div className="space-y-4">
            <GlassCard className="p-4" hover={false}>
              <p className="font-bold text-foreground">Weekly Speaking Challenge</p>
              <p className="text-[13px] text-muted">Speak 5 days · earn 500 bonus XP</p>
              <GradientButton href="/challenge" className="mt-4 w-full">
                Join Challenge
              </GradientButton>
            </GlassCard>
            <GlassCard className="p-4" hover={false}>
              <p className="font-bold text-foreground">Challenge Friends</p>
              <p className="text-[13px] text-muted">Invite friends and compete on the global leaderboard</p>
              <GradientButton href="/" variant="ghost" className="mt-4 w-full">
                View Leaderboard
              </GradientButton>
            </GlassCard>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
