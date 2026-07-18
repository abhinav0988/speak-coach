"use client";

import { cn } from "@/lib/utils";

type FloatingActionButtonProps = {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className?: string;
  /** Offset above bottom nav on phone */
  aboveNav?: boolean;
};

export function FloatingActionButton({
  onClick,
  icon,
  label,
  className,
  aboveNav = true,
}: FloatingActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "fixed z-40 flex h-14 w-14 items-center justify-center rounded-full",
        "bg-gradient-to-br from-[#2563EB] via-[#6366F1] to-[#7C3AED] text-white",
        "shadow-[0_12px_32px_rgba(37,99,235,0.45)] transition hover:scale-105 active:scale-95",
        "lg:hidden",
        aboveNav ? "bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-4" : "bottom-4 right-4",
        className
      )}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
