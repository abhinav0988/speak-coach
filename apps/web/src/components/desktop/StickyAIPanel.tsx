"use client";

import Link from "next/link";
import { Bot, Mic, Play, Volume2 } from "lucide-react";
import { AIOrb } from "@/components/luxury-dashboard/design-system";
import type { DashboardMetrics } from "./dashboard-metrics";
import { DkButton, DkGlass } from "./design-system";

export function StickyAIPanel({ m }: { m: DashboardMetrics }) {
  const mistake = m.mistakes[0];

  return (
    <aside className="sticky top-[7.5rem] hidden h-[calc(100dvh-8rem)] w-[360px] shrink-0 lg:block">
      <DkGlass className="flex h-full flex-col p-5" glow>
        <div className="flex items-center gap-3 border-b border-white/40 pb-4">
          <AIOrb />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600">AI Coach</p>
            <p className="text-[22px] font-black">Always here</p>
          </div>
        </div>

        <div className="mt-4 flex-1 space-y-4 overflow-y-auto scrollbar-none">
          <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-4 ring-1 ring-violet-500/15">
            <p className="text-[10px] font-bold uppercase text-muted">Today&apos;s Recommendation</p>
            <p className="mt-2 text-[15px] font-medium leading-relaxed">&ldquo;{m.aiTip}&rdquo;</p>
          </div>

          {mistake && (
            <div className="rounded-2xl bg-rose-500/5 p-4 ring-1 ring-rose-500/15">
              <p className="text-[10px] font-bold uppercase text-rose-600">Mistake to fix</p>
              <p className="mt-1 text-sm font-bold line-through text-rose-500">{mistake.wrong}</p>
              <p className="text-sm font-bold text-emerald-600">→ {mistake.correct}</p>
            </div>
          )}

          <div className="rounded-2xl bg-white/40 p-4 dark:bg-white/5">
            <p className="text-[10px] font-bold uppercase text-muted">Grammar tip</p>
            <p className="mt-1 text-sm">Focus on: <strong>{m.aiAttention}</strong></p>
          </div>

          <div className="rounded-2xl bg-white/40 p-4 dark:bg-white/5">
            <p className="text-[10px] font-bold uppercase text-muted">Vocabulary</p>
            <p className="mt-1 text-sm">Score: <strong>{m.scores.vocabulary}%</strong> · keep practicing daily</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 p-4">
            <p className="text-[10px] font-bold uppercase text-amber-700">Daily motivation</p>
            <p className="mt-1 text-sm italic">&ldquo;{m.motivation}&rdquo;</p>
          </div>

          {m.resume && (
            <div className="rounded-2xl border border-dashed border-violet-300/50 p-4">
              <p className="text-[10px] font-bold uppercase text-muted">Upcoming lesson</p>
              <p className="mt-1 font-bold">Day {m.resume.dayNumber} · {m.resume.label}</p>
              <DkButton href="/session" variant="ghost" className="mt-3 w-full !py-2 text-xs">
                <Play className="h-3.5 w-3.5" /> Resume
              </DkButton>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-2 border-t border-white/40 pt-4">
          <DkButton href="/coach" className="w-full">
            <Bot className="h-4 w-4" /> Quick Ask AI
          </DkButton>
          <DkButton href="/live-speak" variant="ghost" className="w-full">
            <Mic className="h-4 w-4" /> Voice Practice
          </DkButton>
          <Link href="/sound-gym" className="flex items-center justify-center gap-2 text-xs font-bold text-primary hover:underline">
            <Volume2 className="h-3.5 w-3.5" /> Pronunciation drill
          </Link>
        </div>
      </DkGlass>
    </aside>
  );
}
