"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  DEFAULT_SPLIT_RATIO,
  MAX_SPLIT_PANE_PX,
  MIN_SPLIT_PANE_PX,
} from "@/lib/adaptive-layout";
import { cn } from "@/lib/utils";

type ResizableSplitViewProps = {
  /** Tree / navigation pane */
  sidebar: ReactNode;
  /** Main editor / content */
  main: ReactNode;
  /** Optional right panel (AI, compare) — desktop only */
  aside?: ReactNode;
  storageKey?: string;
  className?: string;
  /** Show sidebar by default on tablet */
  defaultOpen?: boolean;
};

function clampRatio(ratio: number, containerWidth: number): number {
  const minRatio = MIN_SPLIT_PANE_PX / containerWidth;
  const maxRatio = MAX_SPLIT_PANE_PX / containerWidth;
  return Math.min(maxRatio, Math.max(minRatio, ratio));
}

export function ResizableSplitView({
  sidebar,
  main,
  aside,
  storageKey = "adaptive-split-ratio",
  className,
  defaultOpen = true,
}: ResizableSplitViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(DEFAULT_SPLIT_RATIO);
  const [sidebarVisible, setSidebarVisible] = useState(defaultOpen);
  const dragging = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) setRatio(Number(stored));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const persistRatio = useCallback(
    (next: number) => {
      setRatio(next);
      try {
        localStorage.setItem(storageKey, String(next));
      } catch {
        /* ignore */
      }
    },
    [storageKey]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        if (!dragging.current || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const next = clampRatio((ev.clientX - rect.left) / rect.width, rect.width);
        persistRatio(next);
      };

      const onUp = () => {
        dragging.current = false;
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [persistRatio]
  );

  return (
    <div ref={containerRef} className={cn("flex min-h-0 w-full", className)}>
      {/* Tablet: icon rail or collapsible tree pane */}
      {sidebarVisible && (
        <div
          className={cn(
            "hidden shrink-0 overflow-hidden md:flex lg:flex",
            "border-r border-white/40 dark:border-white/10"
          )}
          style={{ width: `clamp(${MIN_SPLIT_PANE_PX}px, ${ratio * 100}%, ${MAX_SPLIT_PANE_PX}px)` }}
        >
          {sidebar}
        </div>
      )}

      {/* Resize handle — tablet + desktop */}
      {sidebarVisible && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize navigation panel"
          onPointerDown={onPointerDown}
          className={cn(
            "hidden w-1.5 shrink-0 cursor-col-resize md:block",
            "bg-transparent hover:bg-violet-400/30 active:bg-violet-500/40",
            "transition-colors"
          )}
        />
      )}

      {/* Editor — full width on phone, flex-1 on tablet/desktop */}
      <div className="min-w-0 flex-1">{main}</div>

      {/* Desktop: optional AI / compare panel */}
      {aside && (
        <div
          className={cn(
            "hidden shrink-0 overflow-hidden border-l border-white/40 dark:border-white/10",
            "lg:block lg:w-[min(360px,28vw)]"
          )}
        >
          {aside}
        </div>
      )}
    </div>
  );
}

/** Toggle button for tablet sidebar visibility */
export function SplitSidebarToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="hidden rounded-xl border border-white/60 bg-white/70 px-2.5 py-1.5 text-xs font-bold text-muted transition hover:text-foreground md:inline-flex lg:hidden dark:border-white/10 dark:bg-slate-800/70"
      aria-expanded={visible}
    >
      {visible ? "Hide tree" : "Show tree"}
    </button>
  );
}
