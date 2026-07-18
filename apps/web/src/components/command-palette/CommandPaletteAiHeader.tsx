"use client";

import { motion } from "framer-motion";
import { Bot, Play } from "lucide-react";
import { getDisplayMeta } from "@/lib/command-palette";
import { cn } from "@/lib/utils";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

type CommandPaletteAiHeaderProps = {
  userName: string;
  resumeLabel?: string | null;
  onResume: () => void;
  onAskAi: () => void;
};

export function CommandPaletteAiHeader({
  userName,
  resumeLabel,
  onResume,
  onAskAi,
}: CommandPaletteAiHeaderProps) {
  const continueLabel = resumeLabel ? `Continue ${resumeLabel}` : "Continue today's lesson";
  const meta = getDisplayMeta({ href: "/session", label: continueLabel, icon: Play, keywords: [] });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="cp-ai-card mb-3 rounded-[18px] border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-foreground">
            👋 {getGreeting()} {userName.split(" ")[0]}
          </p>
          <p className="mt-1 text-[17px] font-bold tracking-tight text-foreground">{continueLabel}</p>
          <p className="mt-1.5 text-[13px] text-muted">
            Estimated {meta.duration}
            <span className="mx-2 text-muted/40">·</span>
            <span className="font-semibold text-violet-600">+{meta.xp} XP</span>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onResume}
            className={cn(
              "cp-magnetic flex items-center gap-1.5 rounded-[12px] bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] px-4 py-2 text-[13px] font-bold text-white shadow-[0_8px_24px_rgba(79,70,229,0.3)] transition hover:shadow-[0_12px_28px_rgba(79,70,229,0.4)]"
            )}
          >
            <Play className="h-3.5 w-3.5" fill="currentColor" />
            Resume
          </button>
          <button
            type="button"
            onClick={onAskAi}
            className="cp-magnetic flex items-center gap-1.5 rounded-[12px] border border-slate-200 bg-white px-4 py-2 text-[13px] font-bold text-slate-800 shadow-sm transition hover:border-violet-200 hover:bg-violet-50"
          >
            <Bot className="h-3.5 w-3.5 text-violet-600" />
            Ask AI
          </button>
        </div>
      </div>
    </motion.div>
  );
}
