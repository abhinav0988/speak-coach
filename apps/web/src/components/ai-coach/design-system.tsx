"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CoachAurora() {
  return (
    <div aria-hidden className="ac-aurora pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="ac-aurora-base absolute inset-0" />
      <div className="ac-blob ac-blob-blue absolute -left-20 top-0 h-80 w-80 rounded-full" />
      <div className="ac-blob ac-blob-purple absolute right-0 top-1/4 h-96 w-96 rounded-full" />
      <div className="ac-blob ac-blob-pink absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full" />
      <div className="ac-blob ac-blob-cyan absolute -bottom-16 right-1/4 h-56 w-56 rounded-full" />
      {Array.from({ length: 18 }).map((_, i) => (
        <span key={i} className="ac-particle absolute h-1 w-1 rounded-full"
          style={{ left: `${5 + (i * 5.2) % 92}%`, top: `${8 + (i * 6.8) % 85}%`, animationDelay: `${i * 0.35}s` }} />
      ))}
    </div>
  );
}

export function AcGlass({ children, className, glow }: { children: ReactNode; className?: string; glow?: "blue" | "purple" | "pink" }) {
  return (
    <div className={cn(
      "ac-glass relative overflow-hidden rounded-[24px] border border-white/60 shadow-[0_24px_64px_rgba(15,23,42,0.09)] backdrop-blur-[30px]",
      "dark:border-white/10 dark:bg-slate-900/55",
      glow === "blue" && "ac-glow-blue", glow === "purple" && "ac-glow-purple", glow === "pink" && "ac-glow-pink",
      className
    )}>
      <div className="ac-shine pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}

export function AcButton({ children, className, variant = "primary", onClick, disabled, type = "button" }: {
  children: ReactNode; className?: string; variant?: "primary" | "ghost" | "send"; onClick?: () => void; disabled?: boolean; type?: "button" | "submit";
}) {
  const styles = {
    primary: "bg-gradient-to-r from-[#2563EB] via-[#6366F1] to-[#7C3AED] text-white shadow-[0_12px_32px_rgba(37,99,235,0.35)] ac-btn-shine",
    ghost: "border border-white/60 bg-white/50 backdrop-blur dark:border-white/10 dark:bg-slate-800/50",
    send: "bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white shadow-lg h-11 w-11 rounded-full p-0",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={cn("inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition active:scale-[0.98] hover:-translate-y-0.5 disabled:opacity-50",
        styles[variant], className)}>
      {children}
    </button>
  );
}

export function AcLinkButton({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5", className)}>
      {children}
    </Link>
  );
}

export function AIOrb({ state = "idle" }: { state?: "idle" | "thinking" | "speaking" | "listening" }) {
  return (
    <div className="relative flex items-center justify-center">
      <div className={cn("ac-orb-ring absolute h-24 w-24 rounded-full border-2 border-violet-400/30",
        state === "thinking" && "ac-orb-thinking", state === "speaking" && "ac-orb-speaking", state === "listening" && "ac-orb-listening")} />
      <motion.div
        animate={{ scale: state === "thinking" ? [1, 1.08, 1] : state === "listening" ? [1, 1.12, 1] : [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: state === "thinking" ? 1.2 : 2.5, ease: "easeInOut" }}
        className="ac-orb-core relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] via-[#7C3AED] to-[#EC4899] text-3xl shadow-[0_0_40px_rgba(124,58,237,0.5)]"
      >
        ✨
      </motion.div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/40 bg-white/50 px-4 py-3 backdrop-blur dark:bg-white/5">
      <span className="flex gap-1">
        {[0, 150, 300].map((d) => (
          <span key={d} className="h-2 w-2 animate-bounce rounded-full bg-gradient-to-r from-[#2563EB] to-[#7C3AED]" style={{ animationDelay: `${d}ms` }} />
        ))}
      </span>
      <span className="text-[13px] font-medium text-muted">AI is thinking…</span>
    </div>
  );
}

export function LiveScoreStrip({ scores }: { scores: { label: string; value: number; color: string }[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {scores.map((s) => (
        <div key={s.label} className="ac-score-pill shrink-0 rounded-2xl border border-white/50 bg-white/45 px-3 py-2 backdrop-blur dark:bg-white/5">
          <p className="text-[9px] font-bold uppercase text-muted">{s.label}</p>
          <p className={cn("text-sm font-black", s.color)}>{s.value}%</p>
        </div>
      ))}
    </div>
  );
}

export function MarkdownLite({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="space-y-2 text-[15px] leading-relaxed">
      {lines.map((line, i) => {
        if (line.startsWith("```")) return null;
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return <li key={i} className="ml-4 list-disc">{line.slice(2)}</li>;
        }
        if (line.startsWith("## ")) return <h3 key={i} className="text-base font-bold">{line.slice(3)}</h3>;
        if (line.startsWith("# ")) return <h2 key={i} className="text-lg font-bold">{line.slice(2)}</h2>;
        const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
        if (line.trim() === "") return <br key={i} />;
        return <p key={i} dangerouslySetInnerHTML={{ __html: bold }} />;
      })}
    </div>
  );
}
