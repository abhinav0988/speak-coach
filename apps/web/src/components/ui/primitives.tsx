import { forwardRef, type HTMLAttributes, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  hover = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[24px] border border-surface-border bg-[var(--card)] p-4 shadow-soft transition-all duration-300 dark:border-gray-800 md:p-6",
        hover && "hover:-translate-y-1 hover:shadow-elevated",
        className
      )}
      {...props}
    />
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }
>(function Button({ className, variant = "primary", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex min-h-touch items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
        variant === "primary" && "bg-primary text-white shadow-sm hover:bg-primary-700 hover:shadow-md",
        variant === "secondary" &&
          "border border-surface-border bg-[var(--card)] text-foreground hover:bg-surface-muted dark:border-gray-700",
        variant === "ghost" && "text-muted hover:bg-surface-muted hover:text-foreground",
        className
      )}
      {...props}
    />
  );
});

export function Badge({
  className,
  variant = "default",
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "success" | "warning" | "secondary" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "success" && "bg-success/10 text-success",
        variant === "warning" && "bg-warning/10 text-warning",
        variant === "secondary" && "bg-secondary/10 text-secondary",
        className
      )}
      {...props}
    />
  );
}

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("h-2.5 overflow-hidden rounded-full bg-surface-border dark:bg-gray-800", className)}>
      <div
        className={cn("h-full rounded-full bg-primary transition-all duration-700 ease-out", barClassName)}
        style={{ width: `${pct}%` }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[24px] bg-surface-border/80 dark:bg-gray-800", className)} />;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  titleId,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  titleId?: string;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4 md:mb-6">
      <div className="min-w-0">
        <h2 id={titleId} className="text-section text-foreground md:text-section-md xl:text-section-xl">
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-muted md:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
