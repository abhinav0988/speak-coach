"use client";

import Link from "next/link";
import { Bot, Mic, Play, Sparkles } from "lucide-react";
import { useAdaptiveLayoutOptional } from "./AdaptiveLayoutProvider";

/** Lightweight AI assistant panel for bottom sheet (phone) and slide-over (tablet). */
export function AdaptiveAIPanel() {
  const layout = useAdaptiveLayoutOptional();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-4 ring-1 ring-violet-500/15">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600">AI Coach</p>
            <p className="text-lg font-black">Ask anything</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Get grammar fixes, pronunciation tips, and bilingual coaching tailored to your practice.
        </p>
      </div>

      <div className="grid gap-2">
        {[
          { href: "/coach", label: "Open full coach chat", icon: Bot },
          { href: "/session", label: "Continue daily session", icon: Play },
          { href: "/live-speak", label: "Practice live speaking", icon: Mic },
          { href: "/", label: "Browse practice hub", icon: Sparkles },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => layout?.closeAi()}
            className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/60 px-4 py-3 text-sm font-bold transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
          >
            <item.icon className="h-4 w-4 text-primary" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
