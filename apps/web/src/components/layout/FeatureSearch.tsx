"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { CommandPalette } from "@/components/command-palette/CommandPalette";

export function FeatureSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "cp-trigger group flex min-w-0 items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-sm transition-all duration-300",
          "border-white/55 bg-white/50 text-muted backdrop-blur-md",
          "hover:border-violet-300/50 hover:bg-white/70 hover:text-foreground hover:shadow-[0_8px_32px_rgba(79,70,229,0.12)]",
          "dark:border-white/10 dark:bg-white/5",
          className
        )}
        aria-label="Open command palette"
      >
        <Search className="h-4 w-4 shrink-0 text-violet-600 transition group-hover:scale-110" />
        <span className="truncate text-[13px] font-semibold">Search anything…</span>
        <kbd className="cp-kbd ml-auto hidden shrink-0 md:inline-flex">⌘K</kbd>
      </button>

      {mounted && <CommandPalette open={open} onClose={close} />}
    </>
  );
}
