"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ToolbarAction = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
};

type FloatingToolbarProps = {
  actions: ToolbarAction[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
};

export function FloatingToolbar({
  actions,
  collapsed,
  onToggleCollapse,
  className,
}: FloatingToolbarProps) {
  if (actions.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed z-30 flex flex-col items-end gap-2",
        "bottom-[calc(9.5rem+env(safe-area-inset-bottom))] right-4",
        "md:bottom-6 md:right-6 lg:hidden",
        className
      )}
    >
      {!collapsed && (
        <div
          className={cn(
            "flex flex-col gap-1 rounded-[20px] border border-white/60 bg-white/85 p-1.5 shadow-glass backdrop-blur-[24px]",
            "dark:border-white/10 dark:bg-slate-900/85",
            "animate-in fade-in slide-in-from-bottom-2 duration-200"
          )}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition",
                action.active
                  ? "bg-gradient-to-r from-[#2563EB]/15 to-[#7C3AED]/15 text-primary"
                  : "text-foreground hover:bg-white/60 dark:hover:bg-white/10"
              )}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/70 dark:bg-white/10">
                {action.icon}
              </span>
              {action.label}
            </button>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={onToggleCollapse}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-md backdrop-blur-md",
          "dark:border-white/10 dark:bg-slate-800/80",
          "transition hover:scale-105"
        )}
        aria-label={collapsed ? "Expand toolbar" : "Collapse toolbar"}
        aria-expanded={!collapsed}
      >
        {collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
    </div>
  );
}
