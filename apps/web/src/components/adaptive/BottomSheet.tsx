"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  /** Snap height: default 85vh, full for table mode */
  fullScreen?: boolean;
};

export function BottomSheet({
  open,
  onClose,
  title,
  subtitle,
  children,
  className,
  fullScreen = false,
}: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true">
      <div
        className="premium-backdrop-enter absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={sheetRef}
        className={cn(
          "absolute inset-x-0 bottom-0 flex flex-col rounded-t-[28px] border border-white/60 bg-white/95 shadow-[0_-24px_64px_rgba(15,23,42,0.18)] backdrop-blur-[30px]",
          "dark:border-white/10 dark:bg-slate-900/95",
          "animate-in slide-in-from-bottom duration-300",
          fullScreen ? "top-0 rounded-t-none" : "max-h-[85dvh]",
          className
        )}
      >
        <div className="flex shrink-0 flex-col items-center px-4 pt-3">
          {!fullScreen && (
            <div className="mb-2 h-1 w-10 rounded-full bg-slate-300/80 dark:bg-slate-600" aria-hidden />
          )}
          {(title || subtitle) && (
            <div className="flex w-full items-start justify-between gap-3 pb-3">
              <div className="min-w-0">
                {title && <h2 className="text-base font-black tracking-tight">{title}</h2>}
                {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/80 text-muted transition hover:text-foreground dark:border-white/10 dark:bg-slate-800/80"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] scrollbar-none">
          {children}
        </div>
      </div>
    </div>
  );
}
