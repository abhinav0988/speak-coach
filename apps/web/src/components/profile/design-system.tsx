"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function ProfileAurora() {
  return (
    <div aria-hidden className="pf-aurora pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="pf-aurora-base absolute inset-0" />
      <div className="pf-blob pf-blob-blue absolute -left-20 top-0 h-96 w-96 rounded-full" />
      <div className="pf-blob pf-blob-purple absolute right-0 top-1/4 h-[26rem] w-[26rem] rounded-full" />
      <div className="pf-blob pf-blob-pink absolute bottom-1/4 left-1/3 h-80 w-80 rounded-full" />
      <div className="pf-blob pf-blob-cyan absolute -bottom-20 right-1/4 h-64 w-64 rounded-full" />
      {Array.from({ length: 22 }).map((_, i) => (
        <span key={i} className="pf-particle absolute h-1 w-1 rounded-full"
          style={{ left: `${4 + (i * 4.4) % 94}%`, top: `${6 + (i * 6.5) % 88}%`, animationDelay: `${i * 0.32}s` }} />
      ))}
    </div>
  );
}

export function PfGlass({ children, className, glow }: { children: ReactNode; className?: string; glow?: "blue" | "purple" | "pink" | "cyan" | "amber" }) {
  return (
    <div className={cn(
      "pf-glass relative overflow-hidden rounded-[24px] border border-white/60 shadow-[0_24px_64px_rgba(15,23,42,0.09)] backdrop-blur-[30px]",
      "dark:border-white/10 dark:bg-slate-900/55",
      glow === "blue" && "pf-glow-blue", glow === "purple" && "pf-glow-purple", glow === "pink" && "pf-glow-pink",
      glow === "cyan" && "pf-glow-cyan", glow === "amber" && "pf-glow-amber",
      className
    )}>
      <div className="pf-shine pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}

export function PfGradientBorder({ children, className, animated = true }: { children: ReactNode; className?: string; animated?: boolean }) {
  return (
    <div className={cn("pf-gradient-border rounded-[26px] p-[1.5px]", animated && "pf-gradient-border-animated")}>
      <div className={cn("pf-glass relative overflow-hidden rounded-[24px]", className)}>{children}</div>
    </div>
  );
}

export function PfButton({ href, children, className, variant = "primary", onClick, disabled }: {
  href?: string; children: ReactNode; className?: string; variant?: "primary" | "ghost" | "danger"; onClick?: () => void; disabled?: boolean;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-50",
    variant === "primary" && "bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_14px_36px_rgba(37,99,235,0.35)] pf-btn-shine",
    variant === "ghost" && "border border-white/60 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-slate-800/50",
    variant === "danger" && "border border-rose-300/50 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    className
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} disabled={disabled} className={cls}>{children}</button>;
}

export function PfSectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
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

export function PfAvatar({ initials, level, online = true, size = "lg" }: { initials: string; level: number; online?: boolean; size?: "md" | "lg" | "xl" }) {
  const sizes = { md: "h-16 w-16 text-lg", lg: "h-24 w-24 text-2xl", xl: "h-32 w-32 text-4xl" };
  return (
    <div className="relative inline-flex">
      <div className={cn("pf-avatar-ring absolute -inset-1.5 rounded-full", size === "xl" && "-inset-2")} />
      <div className={cn("relative flex items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#EC4899] font-black text-white shadow-[0_0_48px_rgba(124,58,237,0.45)]", sizes[size])}>
        {initials}
      </div>
      {online && <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />}
      <span className="absolute -bottom-1 -right-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-1.5 text-[10px] font-black text-white shadow-lg">
        Lv{level}
      </span>
    </div>
  );
}

export function PfRing({ value, size = 100, label }: { value: number; size?: number; label?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#pfRing)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} className="transition-all duration-1000" />
        <defs>
          <linearGradient id="pfRing" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" /><stop offset="50%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black"><AnimatedNumber value={pct} suffix="%" /></span>
        {label && <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{label}</span>}
      </div>
    </div>
  );
}

export function GlassMetricCard({ icon: Icon, label, value, suffix = "", trend, sparkline, gradient }: {
  icon: LucideIcon; label: string; value: number; suffix?: string; trend?: number; sparkline?: number[]; gradient: string;
}) {
  const max = sparkline ? Math.max(...sparkline, 1) : 1;
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
      <PfGlass className="p-4" glow="blue">
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
              <div key={i} className="pf-spark flex-1 rounded-t bg-gradient-to-t from-[#2563EB] to-[#7C3AED]" style={{ height: `${Math.max(12, (v / max) * 100)}%` }} />
            ))}
          </div>
        )}
      </PfGlass>
    </motion.div>
  );
}

export function PfRadar({ scores }: { scores: { label: string; value: number }[] }) {
  const n = scores.length;
  const cx = 100; const cy = 100; const maxR = 72;
  const pts = scores.map((s, i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (s.value / 100) * maxR;
    return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 200 200" className="mx-auto h-52 w-52">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon key={scale} points={scores.map((_, i) => {
          const a = (Math.PI * 2 * i) / n - Math.PI / 2;
          const r = maxR * scale;
          return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
        }).join(" ")} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="1" />
      ))}
      <polygon points={pts} fill="rgba(99,102,241,0.22)" stroke="url(#pfRadarGrad)" strokeWidth="2" />
      {scores.map((s, i) => {
        const a = (Math.PI * 2 * i) / n - Math.PI / 2;
        const lx = cx + (maxR + 18) * Math.cos(a);
        const ly = cy + (maxR + 18) * Math.sin(a);
        return <text key={s.label} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="fill-muted text-[8px] font-bold">{s.label}</text>;
      })}
      <defs>
        <linearGradient id="pfRadarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563EB" /><stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PfBadge3D({ icon, name, tier, earned, xp }: { icon: string; name: string; tier: "gold" | "silver" | "crystal" | "diamond"; earned: boolean; xp?: number }) {
  const tiers = {
    gold: "from-amber-200 via-yellow-100 to-amber-300 shadow-[0_16px_40px_rgba(245,158,11,0.4)]",
    silver: "from-slate-200 via-gray-100 to-slate-300",
    crystal: "from-cyan-200 via-sky-100 to-blue-300 shadow-[0_16px_40px_rgba(6,182,212,0.35)]",
    diamond: "from-violet-200 via-purple-100 to-fuchsia-300 shadow-[0_16px_40px_rgba(124,58,237,0.4)]",
  };
  return (
    <motion.div whileHover={earned ? { y: -6, scale: 1.04 } : undefined}
      className={cn("pf-badge-3d flex flex-col items-center rounded-[20px] bg-gradient-to-br p-4 text-center", tiers[tier], !earned && "opacity-45 blur-[2px] grayscale")}>
      <span className="text-3xl">{icon}</span>
      <p className="mt-2 text-[11px] font-extrabold">{name}</p>
      {xp !== undefined && <p className="mt-1 text-[9px] font-bold text-muted">+{xp} XP</p>}
    </motion.div>
  );
}

export function PfHeatmap({ days }: { days: Array<{ date: string; level: string; minutes?: number }> }) {
  const levels: Record<string, string> = {
    none: "bg-slate-200/60 dark:bg-slate-800",
    light: "bg-blue-300/50", moderate: "bg-indigo-400/60", active: "bg-violet-500/70",
    intense: "bg-gradient-to-br from-emerald-400 to-teal-500",
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {days.slice(-84).map((d) => (
        <motion.div key={d.date} whileHover={{ scale: 1.25 }} title={`${d.date}: ${d.minutes ?? 0} min`}
          className={cn("h-3.5 w-3.5 rounded-md transition", levels[d.level] ?? levels.none)} />
      ))}
    </div>
  );
}

export function MembershipCard() {
  return (
    <PfGradientBorder animated>
      <div className="relative overflow-hidden p-6">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-amber-400/30 to-orange-500/20 blur-2xl" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">Premium</p>
        <h3 className="mt-1 text-[22px] font-black">Speak Coach Max</h3>
        <ul className="mt-4 space-y-2 text-[13px] text-muted">
          {["AI Coach unlimited", "Advanced analytics", "Voice analysis", "Priority features"].map((b) => (
            <li key={b} className="flex items-center gap-2"><span className="text-emerald-500">✓</span>{b}</li>
          ))}
        </ul>
        <PfButton className="mt-5 w-full">Upgrade — $20/mo</PfButton>
      </div>
    </PfGradientBorder>
  );
}

export function SettingsCard({ icon: Icon, title, subtitle, href, onClick }: {
  icon: LucideIcon; title: string; subtitle: string; href?: string; onClick?: () => void;
}) {
  const inner = (
    <PfGlass className="flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-foreground">{title}</p>
        <p className="text-[12px] text-muted">{subtitle}</p>
      </div>
      <span className="text-muted">→</span>
    </PfGlass>
  );
  if (href) return <Link href={href}>{inner}</Link>;
  return <button type="button" onClick={onClick} className="w-full text-left">{inner}</button>;
}
