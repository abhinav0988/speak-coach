"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GLASS, RADIUS } from "@/lib/design-tokens";

type Glow = "blue" | "purple" | "pink" | "cyan" | "amber";

export function GlassCard({
  children,
  className,
  hover = true,
  glow,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: Glow;
  as?: "div" | "section" | "article";
}) {
  const glowClass = glow ? `ds-glow-${glow}` : "";
  const inner = (
    <Tag
      className={cn(
        GLASS,
        RADIUS.card,
        "relative overflow-hidden",
        hover && "ds-card-hover transition-all duration-300",
        glowClass,
        className
      )}
    >
      <div className="ds-shine pointer-events-none absolute inset-0" />
      {children}
    </Tag>
  );
  if (hover) {
    return (
      <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
        {inner}
      </motion.div>
    );
  }
  return inner;
}

export function GradientBorderCard({
  children,
  className,
  animated = true,
}: {
  children: ReactNode;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={cn("ds-gradient-border rounded-[26px] p-[1.5px]", animated && "ds-gradient-border-animated")}>
      <div className={cn(GLASS, RADIUS.card, "relative overflow-hidden", className)}>
        <div className="ds-shine pointer-events-none absolute inset-0" />
        {children}
      </div>
    </div>
  );
}
