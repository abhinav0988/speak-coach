"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Clock,
  Sparkles,
  Star,
  Target,
  Zap,
} from "lucide-react";
import type { NavItem } from "@/lib/navigation";
import {
  getCategoryBadge,
  getDisplayMeta,
  getIconGradient,
  getSectionForItem,
} from "@/lib/command-palette";
import { cn } from "@/lib/utils";

const DIFFICULTY = ["Beginner", "Intermediate", "Advanced"];

type DesktopPreviewPanelProps = {
  item: NavItem | null;
  pinned: boolean;
  onOpen: () => void;
  onAskAi: () => void;
  onTogglePin: () => void;
};

export function DesktopPreviewPanel({
  item,
  pinned,
  onOpen,
  onAskAi,
  onTogglePin,
}: DesktopPreviewPanelProps) {
  if (!item) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-200 bg-slate-50 px-8 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[#5B5CF6]/20 to-[#7C3AED]/20 text-4xl">
          ✨
        </div>
        <p className="text-[16px] font-bold text-foreground">Select a command</p>
        <p className="mt-2 max-w-xs text-[14px] text-muted">
          Browse lessons, practice modes, and AI tools. Details appear here.
        </p>
      </div>
    );
  }

  const Icon = item.icon;
  const meta = getDisplayMeta(item);
  const gradient = getIconGradient(item);
  const category = getCategoryBadge(item);
  const section = getSectionForItem(item);
  const difficulty = DIFFICULTY[(item.label.length + item.href.length) % 3];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={item.href + item.label}
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -8 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex h-full min-h-0 flex-col"
      >
        <div
          className={cn(
            "flex h-[140px] shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
            gradient
          )}
        >
          <Icon className="h-16 w-16 text-white drop-shadow-lg" strokeWidth={1.6} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto cp-desktop-preview-scroll pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#5B5CF6]/10 px-2.5 py-1 text-[12px] font-semibold text-[#5B5CF6]">
              {category}
            </span>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[12px] font-semibold text-emerald-700">
              {difficulty}
            </span>
          </div>

          <h2 className="mt-3 text-[22px] font-bold leading-tight tracking-tight text-foreground">
            {item.label}
          </h2>
          {item.description && (
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{item.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatPill icon={Zap} label="XP" value={`+${meta.xp}`} accent />
            <StatPill icon={Clock} label="Time" value={meta.duration} />
            <StatPill icon={Target} label="Progress" value={`${meta.completion}%`} />
            <StatPill icon={Sparkles} label="Section" value={section.replace("-", " ")} />
          </div>

          <div className="mt-5 rounded-[14px] border border-slate-200 bg-white p-3.5 shadow-sm">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-muted">
              AI recommendation
            </p>
            <p className="mt-1.5 text-[13px] leading-snug text-foreground/85">
              Great next step for your learning path. Completing this builds streak momentum.
            </p>
          </div>

          <div className="mt-4 rounded-[14px] border border-slate-200 bg-slate-50 p-3.5">
            <p className="text-[12px] font-semibold text-muted">Skills you&apos;ll improve</p>
            <p className="mt-1 text-[13px] text-foreground/80">
              Fluency · Confidence · Pronunciation accuracy
            </p>
          </div>
        </div>

        <div className="mt-4 shrink-0 space-y-2 border-t border-slate-200 pt-4">
          <motion.button
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpen}
            className="group flex w-full items-center justify-center gap-2 rounded-[14px] bg-gradient-to-r from-[#5B5CF6] to-[#7C3AED] py-3 text-[14px] font-bold text-white shadow-[0_10px_28px_rgba(91,92,246,0.35)]"
          >
            Resume Lesson
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </motion.button>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onAskAi}
              className="flex items-center justify-center gap-1.5 rounded-[12px] border border-slate-200 bg-white py-2.5 text-[13px] font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
            >
              <Bot className="h-4 w-4 text-[#5B5CF6]" />
              Ask AI Coach
            </button>
            <button
              type="button"
              onClick={onTogglePin}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-[12px] border border-slate-200 bg-white py-2.5 text-[13px] font-semibold shadow-sm transition hover:bg-slate-50",
                pinned && "border-amber-300/50 text-amber-600"
              )}
            >
              <Star className={cn("h-4 w-4", pinned && "fill-amber-400")} />
              {pinned ? "Favorited" : "Favorite"}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function StatPill({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[12px] border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p
        className={cn(
          "mt-0.5 text-[14px] font-bold capitalize",
          accent ? "text-[#5B5CF6]" : "text-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
