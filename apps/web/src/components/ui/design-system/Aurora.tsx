"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Aurora({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("ds-aurora pointer-events-none fixed inset-0 -z-10 overflow-hidden", className)}>
      <div className="ds-aurora-base absolute inset-0" />
      <div className="ds-blob ds-blob-blue absolute -left-20 top-0 h-72 w-72 rounded-full sm:h-96 sm:w-96" />
      <div className="ds-blob ds-blob-purple absolute right-0 top-1/4 h-80 w-80 rounded-full lg:h-[28rem] lg:w-[28rem]" />
      <div className="ds-blob ds-blob-pink absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full" />
      <div className="ds-blob ds-blob-cyan absolute -bottom-16 right-1/4 h-48 w-48 rounded-full sm:h-64 sm:w-64" />
      {Array.from({ length: 16 }).map((_, i) => (
        <span
          key={i}
          className="ds-particle absolute h-1 w-1 rounded-full"
          style={{ left: `${5 + (i * 5.5) % 92}%`, top: `${8 + (i * 6.5) % 85}%`, animationDelay: `${i * 0.35}s` }}
        />
      ))}
    </div>
  );
}
