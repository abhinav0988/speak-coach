"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CONTAINER, PAGE_PADDING, PAGE_PADDING_BOTTOM, PAGE_PY, TYPE } from "@/lib/design-tokens";

type Width = keyof typeof CONTAINER;

export function PageContainer({
  children,
  className,
  width = "wide",
  aurora = false,
  noPadding = false,
  fullBleedMobile = false,
}: {
  children: ReactNode;
  className?: string;
  width?: Width;
  aurora?: boolean;
  /** Skip horizontal padding (page manages its own) */
  noPadding?: boolean;
  /** Edge-to-edge on mobile, padded on sm+ */
  fullBleedMobile?: boolean;
}) {
  return (
    <div
      className={cn(
        "ds-screen relative w-full min-w-0",
        !noPadding && PAGE_PY,
        !noPadding && PAGE_PADDING_BOTTOM,
        className
      )}
    >
      {aurora && <div className="ds-aurora pointer-events-none fixed inset-0 -z-10"><div className="ds-aurora-base absolute inset-0" /></div>}
      <div
        className={cn(
          "mx-auto w-full min-w-0",
          CONTAINER[width],
          !noPadding && (fullBleedMobile ? "px-0 sm:px-6 lg:px-8" : PAGE_PADDING)
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-end justify-between gap-3 md:mb-6", className)}>
      <div className="min-w-0">
        <h2 className={cn(TYPE.title, "text-foreground")}>{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px] text-muted md:text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function ResponsiveGrid({
  children,
  className,
  cols = "cards",
}: {
  children: ReactNode;
  className?: string;
  cols?: "cards" | "two" | "analytics";
}) {
  const gridClass =
    cols === "two"
      ? "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
      : cols === "analytics"
        ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        : "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3 2xl:grid-cols-4";
  return <div className={cn(gridClass, className)}>{children}</div>;
}
