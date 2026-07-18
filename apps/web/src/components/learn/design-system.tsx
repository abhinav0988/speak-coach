"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function LearnAurora() {
  return (
    <div aria-hidden className="ln-aurora pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ln-aurora-base absolute inset-0" />
      <div className="ln-blob ln-blob-blue absolute -left-20 top-10 h-72 w-72 rounded-full" />
      <div className="ln-blob ln-blob-purple absolute right-0 top-1/3 h-80 w-80 rounded-full" />
      <div className="ln-blob ln-blob-pink absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full" />
      <div className="ln-blob ln-blob-cyan absolute -bottom-16 right-1/4 h-56 w-56 rounded-full" />
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="ln-particle absolute h-1 w-1 rounded-full"
          style={{ left: `${6 + (i * 6) % 90}%`, top: `${10 + (i * 8) % 82}%`, animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </div>
  );
}

export function LearnGlass({
  children,
  className,
  glow,
}: {
  children: ReactNode;
  className?: string;
  glow?: "blue" | "purple" | "pink" | "cyan" | "amber";
}) {
  return (
    <div
      className={cn(
        "ln-glass relative overflow-hidden rounded-[24px] border border-white/60 shadow-[0_24px_64px_rgba(15,23,42,0.09)] backdrop-blur-2xl",
        "dark:border-white/10 dark:bg-slate-900/55",
        glow === "blue" && "ln-glow-blue",
        glow === "purple" && "ln-glow-purple",
        glow === "pink" && "ln-glow-pink",
        glow === "cyan" && "ln-glow-cyan",
        glow === "amber" && "ln-glow-amber",
        className
      )}
    >
      <div className="ln-shine pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}

export function LearnGradientBorder({
  children,
  className,
  animated = true,
}: {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={cn("ln-gradient-border rounded-[26px] p-[1.5px]", animated && "ln-gradient-border-animated")}>
      <div className={cn("ln-glass relative overflow-hidden rounded-[24px]", className)}>{children}</div>
    </div>
  );
}

export function LearnButton({
  href,
  children,
  className,
  variant = "primary",
  onClick,
  disabled,
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "white";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const styles = {
    primary: "bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_14px_36px_rgba(37,99,235,0.35)] ln-btn-shine",
    ghost: "border border-white/60 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-slate-800/50",
    white: "bg-white/90 text-primary shadow-lg",
  };
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition active:scale-[0.98] hover:-translate-y-0.5",
    styles[variant],
    disabled && "pointer-events-none opacity-50",
    className
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function LearnProgressRing({
  value,
  size = 88,
  label,
}: {
  value: number;
  size?: number;
  label?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const stroke = 6;
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
          stroke="url(#lnRing)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
        <defs>
          <linearGradient id="lnRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black"><AnimatedNumber value={pct} suffix="%" /></span>
        {label && <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{label}</span>}
      </div>
    </div>
  );
}

export function XPBadge({ xp }: { xp: number }) {
  return (
    <span className="inline-flex rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-200/60">
      +{xp} XP
    </span>
  );
}

export function LearnBadge({
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
    <span className={cn("inline-flex rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-bold uppercase", tones[tone])}>
      {label}
    </span>
  );
}

export function AIOrb() {
  return (
    <div className="ln-ai-orb relative flex h-14 w-14 shrink-0 items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#EC4899] opacity-70 blur-md" />
      <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#EC4899] text-xl shadow-lg">
        ✨
      </div>
    </div>
  );
}

export function LessonCompleteSheet({
  open,
  onClose,
  onShare,
  xp,
  lessonName,
  aiSummary,
}: {
  open: boolean;
  onClose: () => void;
  onShare?: () => void;
  xp: number;
  lessonName: string;
  aiSummary: string;
}) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="ln-glass w-full max-w-lg rounded-t-[32px] border border-white/60 p-6 shadow-[0_-20px_80px_rgba(15,23,42,0.2)] sm:rounded-[32px]"
      >
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/40 sm:hidden" />
        <p className="text-center text-4xl">🎉</p>
        <h3 className="mt-2 text-center text-[28px] font-black text-foreground">Lesson Complete!</h3>
        <p className="text-center text-[16px] font-semibold text-muted">{lessonName}</p>
        <div className="mt-4 flex justify-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-muted">XP Earned</p>
            <p className="text-3xl font-black text-violet-600">+{xp}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-muted">Coins</p>
            <p className="text-3xl font-black text-amber-600">+{Math.floor(xp / 5)}</p>
          </div>
        </div>
        <p className="mt-4 rounded-2xl bg-violet-50/80 p-3 text-[13px] leading-relaxed text-foreground dark:bg-violet-950/30">
          <span className="font-bold text-violet-600">AI Summary · </span>
          {aiSummary}
        </p>
        <div className="mt-5 flex gap-3">
          <LearnButton className="flex-1" onClick={onClose}>Continue</LearnButton>
          <LearnButton variant="ghost" className="flex-1" onClick={onShare}>Share</LearnButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
