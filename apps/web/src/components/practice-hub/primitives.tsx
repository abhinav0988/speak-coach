"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function AmbientMesh({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] opacity-60",
        "bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(124,58,237,0.12),transparent_38%),radial-gradient(circle_at_50%_100%,rgba(236,72,153,0.08),transparent_40%)]",
        className
      )}
    />
  );
}

export function GlassCard({
  children,
  className,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/50 bg-white/60 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl",
        hover && "ph-card-hover transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GradientButton({
  href,
  children,
  className,
  onClick,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED] px-4 py-2.5 text-sm font-bold text-white shadow-[0_10px_28px_rgba(37,99,235,0.35)] transition hover:opacity-95 active:scale-[0.98]",
    className
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function XPBadge({ xp, className }: { xp: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200/60",
        className
      )}
    >
      +{xp} XP
    </span>
  );
}

export function AnimatedBadge({
  label,
  tone = "primary",
}: {
  label: string;
  tone?: "primary" | "ai" | "new" | "hot";
}) {
  const tones = {
    primary: "from-[#2563EB] to-[#7C3AED] text-white",
    ai: "from-[#EC4899] to-[#7C3AED] text-white",
    new: "from-[#10B981] to-[#14B8A6] text-white",
    hot: "from-[#F97316] to-[#EF4444] text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow-sm",
        tones[tone]
      )}
    >
      {label}
    </span>
  );
}

export function PremiumProgress({
  value,
  className,
  glow = false,
}: {
  value: number;
  className?: string;
  glow?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-muted">Progress</span>
        <span className="text-foreground">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
        <div
          className={cn(
            "ph-progress-fill h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED]",
            glow && "shadow-[0_0_12px_rgba(99,102,241,0.45)]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function MiniRing({ value, size = 44, className }: { value: number; size?: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  const dash = `${pct} ${100 - pct}`;
  return (
    <svg
      viewBox="0 0 36 36"
      className={cn("-rotate-90", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <path
        d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
        fill="none"
        stroke="rgba(148,163,184,0.35)"
        strokeWidth="3"
      />
      <path
        d="M18 2 a 16 16 0 1 1 0 32 a 16 16 0 1 1 0 -32"
        fill="none"
        stroke="url(#ringGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function MiniChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-16 items-end gap-1.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="ph-chart-bar flex-1 rounded-t-lg bg-gradient-to-t from-[#2563EB] via-[#6366F1] to-[#A855F7] shadow-[0_0_12px_rgba(99,102,241,0.25)]"
          style={{
            height: `${Math.max(14, (v / max) * 100)}%`,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ScoreOrb({
  label,
  value,
  gradient,
}: {
  label: string;
  value: number;
  gradient: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className={cn(
          "ph-score-orb relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg",
          gradient
        )}
      >
        <span className="text-xs font-bold">
          <AnimatedNumber value={value} suffix="%" />
        </span>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

export function AchievementCard3D({
  icon,
  name,
  tier,
}: {
  icon: string;
  name: string;
  tier: "gold" | "silver" | "crystal";
}) {
  const tiers = {
    gold: "from-amber-200 via-yellow-100 to-amber-300 shadow-[0_12px_28px_rgba(245,158,11,0.35)]",
    silver: "from-slate-200 via-gray-100 to-slate-300 shadow-[0_12px_28px_rgba(100,116,139,0.25)]",
    crystal: "from-cyan-200 via-sky-100 to-blue-300 shadow-[0_12px_28px_rgba(6,182,212,0.35)]",
  };
  return (
    <div
      className={cn(
        "ph-achievement-3d flex flex-1 flex-col items-center rounded-2xl bg-gradient-to-br p-3 text-center",
        tiers[tier]
      )}
    >
      <span className="text-2xl drop-shadow-sm">{icon}</span>
      <p className="mt-1.5 text-[10px] font-bold leading-tight text-foreground">{name}</p>
    </div>
  );
}

export function CoinStrip({ coins, dailyXp }: { coins: number; dailyXp: number }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50/90 to-yellow-50/90 px-4 py-2.5 shadow-inner">
      <span className="text-lg">🪙</span>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800/70">Coins</p>
        <p className="text-base font-bold text-amber-900">
          <AnimatedNumber value={coins} />
        </p>
      </div>
      <div className="h-8 w-px bg-amber-200" />
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800/70">Today XP</p>
        <p className="text-base font-bold text-emerald-700">+{dailyXp}</p>
      </div>
    </div>
  );
}

