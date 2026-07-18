"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GRADIENT_PRIMARY, RADIUS, TOUCH } from "@/lib/design-tokens";

export function GradientButton({
  href,
  children,
  className,
  variant = "primary",
  onClick,
  disabled,
  type = "button",
}: {
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "danger" | "send";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const cls = cn(
    "inline-flex items-center justify-center gap-2 font-bold transition active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none",
    RADIUS.btn,
    TOUCH,
    "px-5 py-3 text-sm",
    variant === "primary" && cn(GRADIENT_PRIMARY, "text-white shadow-[0_12px_32px_rgba(37,99,235,0.35)] ds-btn-shine"),
    variant === "ghost" && "border border-white/60 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-slate-800/50",
    variant === "danger" && "border border-rose-300/50 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    variant === "send" && cn(GRADIENT_PRIMARY, "h-12 w-12 rounded-full p-0 text-white shadow-lg"),
    className
  );
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
