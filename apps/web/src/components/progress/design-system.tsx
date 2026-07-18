"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function ProgressAurora() {
  return (
    <div aria-hidden className="pr-aurora pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="pr-aurora-base absolute inset-0" />
      <div className="pr-blob pr-blob-blue absolute -left-24 top-0 h-96 w-96 rounded-full" />
      <div className="pr-blob pr-blob-purple absolute right-0 top-1/4 h-[28rem] w-[28rem] rounded-full" />
      <div className="pr-blob pr-blob-pink absolute bottom-1/3 left-1/4 h-72 w-72 rounded-full" />
      <div className="pr-blob pr-blob-cyan absolute -bottom-24 right-1/3 h-64 w-64 rounded-full" />
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="pr-particle absolute h-1 w-1 rounded-full"
          style={{ left: `${4 + (i * 4.8) % 94}%`, top: `${6 + (i * 7.1) % 88}%`, animationDelay: `${i * 0.3}s` }}
        />
      ))}
    </div>
  );
}

export function PrGlass({ children, className, glow }: { children: ReactNode; className?: string; glow?: "blue" | "purple" | "pink" | "cyan" | "amber" }) {
  return (
    <div
      className={cn(
        "pr-glass relative overflow-hidden rounded-[24px] border border-white/60 shadow-[0_24px_64px_rgba(15,23,42,0.09)] backdrop-blur-2xl",
        "dark:border-white/10 dark:bg-slate-900/55",
        glow === "blue" && "pr-glow-blue",
        glow === "purple" && "pr-glow-purple",
        glow === "pink" && "pr-glow-pink",
        glow === "cyan" && "pr-glow-cyan",
        glow === "amber" && "pr-glow-amber",
        className
      )}
    >
      <div className="pr-shine pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}

export function PrGradientBorder({ children, className, animated = true }: { children: ReactNode; className?: string; animated?: boolean }) {
  return (
    <div className={cn("pr-gradient-border rounded-[26px] p-[1.5px]", animated && "pr-gradient-border-animated")}>
      <div className={cn("pr-glass relative overflow-hidden rounded-[24px]", className)}>{children}</div>
    </div>
  );
}

export function PrButton({ href, children, className, variant = "primary", onClick }: {
  href?: string; children: ReactNode; className?: string; variant?: "primary" | "ghost"; onClick?: () => void;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition active:scale-[0.98] hover:-translate-y-0.5",
    variant === "primary" && "bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_14px_36px_rgba(37,99,235,0.35)] pr-btn-shine",
    variant === "ghost" && "border border-white/60 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-slate-800/50",
    className
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

export function PrRing({ value, size = 120, label }: { value: number; size?: number; label?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#prRing)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} className="transition-all duration-1000" />
        <defs>
          <linearGradient id="prRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" /><stop offset="50%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black"><AnimatedNumber value={pct} suffix="%" /></span>
        {label && <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</span>}
      </div>
    </div>
  );
}

export function MetricCard({ icon: Icon, label, value, suffix = "", trend, sparkline, gradient }: {
  icon: LucideIcon; label: string; value: number; suffix?: string; trend?: number; sparkline?: number[]; gradient: string;
}) {
  const max = sparkline ? Math.max(...sparkline, 1) : 1;
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
      <PrGlass className="p-4" glow="blue">
        <div className="flex items-start justify-between">
          <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", gradient)}>
            <Icon className="h-5 w-5" />
          </div>
          {trend !== undefined && (
            <span className={cn("text-xs font-bold", trend >= 0 ? "text-emerald-600" : "text-rose-500")}>
              {trend >= 0 ? "↑" : "↓"}{Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="mt-3 text-[13px] font-semibold text-muted">{label}</p>
        <p className="text-2xl font-black text-foreground"><AnimatedNumber value={value} suffix={suffix} /></p>
        {sparkline && sparkline.length > 0 && (
          <div className="mt-3 flex h-8 items-end gap-0.5">
            {sparkline.map((v, i) => (
              <div key={i} className="pr-spark flex-1 rounded-t bg-gradient-to-t from-[#2563EB] to-[#7C3AED]" style={{ height: `${Math.max(12, (v / max) * 100)}%` }} />
            ))}
          </div>
        )}
      </PrGlass>
    </motion.div>
  );
}

export function PrRadar({ scores }: { scores: { label: string; value: number }[] }) {
  const n = scores.length;
  const cx = 100; const cy = 100; const maxR = 72;
  const pts = scores.map((s, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (s.value / 100) * maxR;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-48 w-48">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon key={scale} points={scores.map((_, i) => {
          const a = (Math.PI * 2 * i) / n - Math.PI / 2;
          const r = maxR * scale;
          return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
        }).join(" ")} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
      ))}
      <polygon points={pts} fill="rgba(99,102,241,0.25)" stroke="url(#prRadarGrad)" strokeWidth="2" />
      <defs>
        <linearGradient id="prRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PrChart({ values, labels }: { values: number[]; labels?: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-32 items-end gap-2">
      {values.map((v, i) => (
        <motion.div key={i} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
          transition={{ delay: i * 0.05, type: "spring", stiffness: 280 }}
          className="group relative flex-1 origin-bottom">
          <div className="pr-bar w-full rounded-t-xl bg-gradient-to-t from-[#2563EB] via-[#6366F1] to-[#A855F7] shadow-[0_0_16px_rgba(99,102,241,0.3)] transition group-hover:brightness-110"
            style={{ height: `${Math.max(8, (v / max) * 100)}%` }} />
          {labels?.[i] && <span className="mt-1 block text-center text-[9px] font-bold text-muted">{labels[i]}</span>}
        </motion.div>
      ))}
    </div>
  );
}

export function PrHeatmap({ days }: { days: Array<{ date: string; level: string; minutes?: number }> }) {
  const levels: Record<string, string> = {
    none: "bg-slate-200/60 dark:bg-slate-800",
    light: "bg-blue-300/50", moderate: "bg-indigo-400/60", active: "bg-violet-500/70", intense: "bg-gradient-to-br from-emerald-400 to-teal-500",
    low: "bg-blue-300/40", medium: "bg-indigo-400/50", high: "bg-emerald-500/70", clean: "bg-gradient-to-br from-emerald-400 to-cyan-500",
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {days.slice(-84).map((d) => (
        <motion.div key={d.date} whileHover={{ scale: 1.2 }} title={`${d.date}: ${d.minutes ?? 0} min`}
          className={cn("h-3.5 w-3.5 rounded-md transition", levels[d.level] ?? levels.none)} />
      ))}
    </div>
  );
}

export function PrBadge3D({ icon, name, tier, earned }: { icon: string; name: string; tier: "gold" | "silver" | "crystal" | "diamond"; earned: boolean }) {
  const tiers = {
    gold: "from-amber-200 via-yellow-100 to-amber-300 shadow-[0_16px_40px_rgba(245,158,11,0.4)]",
    silver: "from-slate-200 via-gray-100 to-slate-300",
    crystal: "from-cyan-200 via-sky-100 to-blue-300 shadow-[0_16px_40px_rgba(6,182,212,0.35)]",
    diamond: "from-violet-200 via-purple-100 to-fuchsia-300 shadow-[0_16px_40px_rgba(124,58,237,0.4)]",
  };
  return (
    <motion.div whileHover={earned ? { y: -6, rotateX: 8 } : undefined}
      className={cn("pr-badge-3d flex flex-col items-center rounded-[20px] bg-gradient-to-br p-4 text-center", tiers[tier], !earned && "opacity-50 blur-[1px]")}>
      <span className="text-3xl">{icon}</span>
      <p className="mt-2 text-[11px] font-extrabold">{name}</p>
    </motion.div>
  );
}

export function FloatingAIOrb({ tip }: { tip: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-24 right-4 z-40 max-w-[200px] lg:bottom-8 lg:right-8">
      <PrGlass className="p-3" glow="purple">
        <div className="flex items-start gap-2">
          <div className="pr-ai-orb flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#EC4899] text-lg">✨</div>
          <p className="text-[11px] font-medium leading-snug text-foreground">{tip.slice(0, 80)}…</p>
        </div>
      </PrGlass>
    </motion.div>
  );
}

export function SectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-[28px] font-black tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
