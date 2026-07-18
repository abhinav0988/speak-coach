"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { cn } from "@/lib/utils";

export function DkGlass({ children, className, glow }: { children: ReactNode; className?: string; glow?: boolean }) {
  return (
    <div className={cn("dk-glass relative overflow-hidden rounded-[28px]", glow && "dk-glow", className)}>
      <div className="dk-shine pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}

export function DkGradientBorder({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="dk-gradient-border rounded-[30px] p-[1.5px]">
      <div className={cn("dk-glass relative overflow-hidden rounded-[28px]", className)}>
        <div className="dk-shine pointer-events-none absolute inset-0" />
        {children}
      </div>
    </div>
  );
}

export function DkButton({
  href, children, className, variant = "primary", onClick,
}: {
  href?: string; children: ReactNode; className?: string; variant?: "primary" | "ghost"; onClick?: () => void;
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 active:scale-[0.98]",
    variant === "primary" && "bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white shadow-[0_12px_32px_rgba(79,70,229,0.35)]",
    variant === "ghost" && "border border-white/60 bg-white/50 text-foreground backdrop-blur hover:bg-white/70",
    className
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

export function DkSectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-[34px] font-black tracking-tight text-foreground leading-none">{title}</h2>
        {subtitle && <p className="mt-1.5 text-[13px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function DkStatCard({ label, value, suffix, icon: Icon, gradient }: {
  label: string; value: number; suffix?: string; icon: React.ComponentType<{ className?: string }>; gradient: string;
}) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400 }}>
      <DkGlass className="p-5" glow>
        <div className={cn("mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", gradient)}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-[13px] font-semibold text-muted">{label}</p>
        <p className="mt-1 text-[40px] font-black leading-none text-foreground">
          <AnimatedNumber value={value} suffix={suffix} />
        </p>
      </DkGlass>
    </motion.div>
  );
}
