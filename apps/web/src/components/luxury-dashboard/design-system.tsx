"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function SectionLabel({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-[30px] font-black tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  hover = true,
  glow,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: "blue" | "purple" | "pink" | "cyan" | "amber";
}) {
  return (
    <div
      className={cn(
        "ld-glass relative overflow-hidden rounded-[24px] border border-white/60 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl",
        "dark:border-white/10 dark:bg-slate-900/55 dark:shadow-[0_20px_60px_rgba(0,0,0,0.35)]",
        hover && "ld-card-hover transition-all duration-300",
        glow === "blue" && "ld-glow-blue",
        glow === "purple" && "ld-glow-purple",
        glow === "pink" && "ld-glow-pink",
        glow === "cyan" && "ld-glow-cyan",
        glow === "amber" && "ld-glow-amber",
        className
      )}
    >
      <div className="ld-glass-shine pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}

export function GradientBorderCard({
  children,
  className,
  animated = false,
}: {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={cn("ld-gradient-border rounded-[26px] p-[1.5px]", animated && "ld-gradient-border-animated")}>
      <div className={cn("ld-glass relative overflow-hidden rounded-[24px] backdrop-blur-2xl", className)}>
        {children}
      </div>
    </div>
  );
}

export function GradientButton({
  href,
  children,
  className,
  variant = "primary",
  onClick,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "white";
  onClick?: () => void;
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_12px_32px_rgba(37,99,235,0.35)] ld-btn-shine",
    ghost: "border border-white/60 bg-white/50 text-foreground shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-800/50",
    white: "bg-white/90 text-primary shadow-lg",
  };
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition active:scale-[0.98] hover:-translate-y-0.5",
    variants[variant],
    className
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function ProgressRing({
  value,
  size = 88,
  stroke = 6,
  label,
  sublabel,
}: {
  value: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.25)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ldRingGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="ld-ring-progress transition-all duration-1000"
        />
        <defs>
          <linearGradient id="ldRingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-foreground">
          <AnimatedNumber value={pct} suffix="%" />
        </span>
        {label && <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</span>}
      </div>
      {sublabel && <p className="mt-1 text-[11px] text-muted">{sublabel}</p>}
    </div>
  );
}

export function StatWidget({
  icon: Icon,
  label,
  value,
  suffix = "",
  trend,
  sparkline,
  gradient,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  trend?: number;
  sparkline?: number[];
  gradient: string;
}) {
  const max = sparkline ? Math.max(...sparkline, 1) : 1;
  return (
    <GlassCard className="p-4" glow="blue">
      <div className="flex items-start justify-between">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", gradient)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend !== undefined && (
          <span className={cn("text-xs font-bold", trend >= 0 ? "text-emerald-600" : "text-rose-500")}>
            {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-3 text-[13px] font-semibold text-muted">{label}</p>
      <p className="text-2xl font-black text-foreground">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      {sparkline && sparkline.length > 0 && (
        <div className="mt-3 flex h-8 items-end gap-0.5">
          {sparkline.map((v, i) => (
            <div
              key={i}
              className="ld-spark-bar flex-1 rounded-t bg-gradient-to-t from-[#2563EB] to-[#7C3AED]"
              style={{ height: `${Math.max(12, (v / max) * 100)}%` }}
            />
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export function AIOrb({ className }: { className?: string }) {
  return (
    <div className={cn("ld-ai-orb relative flex h-14 w-14 items-center justify-center", className)}>
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#EC4899] opacity-80 blur-md" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] via-[#6366F1] to-[#EC4899] text-2xl shadow-lg">
        ✨
      </div>
    </div>
  );
}

export function AchievementBadge3D({
  icon,
  name,
  earned,
  tier = "gold",
}: {
  icon: string;
  name: string;
  earned: boolean;
  tier?: "gold" | "silver" | "crystal" | "locked";
}) {
  const tiers = {
    gold: "from-amber-200 via-yellow-100 to-amber-300 shadow-[0_16px_40px_rgba(245,158,11,0.4)]",
    silver: "from-slate-200 via-gray-100 to-slate-300 shadow-[0_16px_40px_rgba(100,116,139,0.3)]",
    crystal: "from-cyan-200 via-sky-100 to-blue-300 shadow-[0_16px_40px_rgba(6,182,212,0.4)]",
    locked: "from-slate-100 to-slate-200 opacity-60 blur-[1px]",
  };
  return (
    <motion.div
      whileHover={earned ? { y: -6, rotateX: 8 } : undefined}
      className={cn(
        "ld-badge-3d flex flex-col items-center rounded-[20px] bg-gradient-to-br p-4 text-center",
        tiers[earned ? tier : "locked"]
      )}
    >
      <span className={cn("text-3xl", !earned && "grayscale")}>{icon}</span>
      <p className="mt-2 text-[11px] font-extrabold leading-tight text-foreground">{name}</p>
      {!earned && <span className="mt-1 text-[9px] font-bold uppercase text-muted">Locked</span>}
    </motion.div>
  );
}

export function MiniRadar({
  scores,
}: {
  scores: { label: string; value: number }[];
}) {
  const n = scores.length;
  const cx = 80;
  const cy = 80;
  const maxR = 60;
  const points = scores.map((s, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (s.value / 100) * maxR;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  });
  const gridPoints = [0.25, 0.5, 0.75, 1].map((scale) =>
    scores
      .map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const r = maxR * scale;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      })
      .join(" ")
  );
  return (
    <svg viewBox="0 0 160 160" className="mx-auto h-40 w-40">
      {gridPoints.map((pts, i) => (
        <polygon key={i} points={pts} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
      ))}
      <polygon points={points.join(" ")} fill="rgba(99,102,241,0.2)" stroke="url(#ldRadarGrad)" strokeWidth="2" />
      <defs>
        <linearGradient id="ldRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PillBadge({
  children,
  tone = "primary",
}: {
  children: ReactNode;
  tone?: "primary" | "ai" | "hot" | "success" | "amber";
}) {
  const tones = {
    primary: "from-[#2563EB] to-[#7C3AED] text-white",
    ai: "from-[#EC4899] to-[#7C3AED] text-white",
    hot: "from-[#F97316] to-[#EF4444] text-white",
    success: "from-[#10B981] to-[#06B6D4] text-white",
    amber: "from-[#FBBF24] to-[#F97316] text-white",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm", tones[tone])}>
      {children}
    </span>
  );
}

export function AnimatedChart({
  values,
  className,
}: {
  values: number[];
  className?: string;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className={cn("flex h-20 items-end gap-1.5", className)}>
      {values.map((v, i) => (
        <motion.div
          key={i}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, type: "spring", stiffness: 300, damping: 22 }}
          className="ld-chart-bar flex-1 origin-bottom rounded-t-lg bg-gradient-to-t from-[#2563EB] via-[#6366F1] to-[#A855F7] shadow-[0_0_16px_rgba(99,102,241,0.3)]"
          style={{ height: `${Math.max(10, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
