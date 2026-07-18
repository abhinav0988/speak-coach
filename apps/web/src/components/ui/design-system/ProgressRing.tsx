"use client";

import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function ProgressRing({
  value,
  size = 100,
  label,
  className,
}: {
  value: number;
  size?: number;
  label?: string;
  className?: string;
}) {
  const pct = Math.min(100, Math.max(0, value));
  const stroke = 6;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const id = `ring-${label?.replace(/\s/g, "") ?? "default"}`;
  return (
    <div className={className}>
      <div className="relative inline-flex flex-col items-center">
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c - (pct / 100) * c}
            className="transition-all duration-1000"
          />
          <defs>
            <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-black md:text-2xl">
            <AnimatedNumber value={pct} suffix="%" />
          </span>
          {label && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted md:text-[10px]">{label}</span>
          )}
        </div>
      </div>
    </div>
  );
}
