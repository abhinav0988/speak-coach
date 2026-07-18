"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Flame, Loader2, Sparkles, Target, Zap } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Skeleton } from "@/components/ui/primitives";
import type { PreviewCacheData } from "@/lib/preview-cache";
import { cn } from "@/lib/utils";

export function AuthLogo({ levelName }: { levelName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mb-8 text-center"
    >
      <div className="auth-logo-glow mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#5B5CF6] to-[#7C3AED] shadow-[0_12px_32px_rgba(91,92,246,0.4)]">
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 24 24" className="h-8 w-8 text-white" fill="currentColor" aria-hidden>
            <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Z" />
            <path d="M19 11v1a7 7 0 0 1-14 0v-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 18v3M8 21h8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>
      </div>
      <p className="text-lg font-bold tracking-tight text-slate-900">Speak Coach</p>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5B5CF6]">
        {levelName} Level
      </p>
    </motion.div>
  );
}

export function AuthSubmitButton({
  loading,
  isSignUp,
  disabled,
}: {
  loading: boolean;
  isSignUp: boolean;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="submit"
      disabled={disabled || loading}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className="auth-submit group relative flex items-center justify-center gap-2 overflow-hidden"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          <span>{isSignUp ? "Creating account…" : "Signing in…"}</span>
        </>
      ) : (
        <>
          <span>{isSignUp ? "Create account" : "Sign in"}</span>
          <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
        </>
      )}
    </motion.button>
  );
}

const SOCIAL_PROVIDERS = [
  { id: "google", label: "Continue with Google", icon: "G" },
  { id: "apple", label: "Continue with Apple", icon: "" },
  { id: "microsoft", label: "Continue with Microsoft", icon: "M" },
] as const;

export function AuthSocialButtons() {
  return (
    <div className="space-y-2">
      <div className="relative flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">or continue with</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>
      {SOCIAL_PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          disabled
          title="Coming soon"
          aria-label={`${p.label} — coming soon`}
          className="auth-social-btn flex w-full items-center justify-center gap-3 opacity-50"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-600">
            {p.id === "apple" ? "" : p.icon}
          </span>
          {p.label}
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-400">
            Soon
          </span>
        </button>
      ))}
    </div>
  );
}

const TRUST_ITEMS = [
  "No password stored",
  "Secure local device",
  "Private by design",
  "AI powered",
] as const;

export function AuthTrustSection() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2">
      {TRUST_ITEMS.map((item) => (
        <div key={item} className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] text-emerald-600">
            ✓
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}

const PREVIEW_META = [
  { key: "streak" as const, label: "Today's Streak", suffix: "d", icon: Flame, color: "text-orange-500" },
  { key: "xp" as const, label: "Current XP", suffix: "", icon: Zap, color: "text-violet-600" },
  { key: "level" as const, label: "Current Level", suffix: "", icon: Bot, color: "text-pink-500" },
  { key: "goal" as const, label: "Daily Goal", suffix: "m", icon: Target, color: "text-blue-500" },
  { key: "fluency" as const, label: "Fluency", suffix: "%", icon: Sparkles, color: "text-emerald-500" },
];

function previewValue(data: PreviewCacheData, key: (typeof PREVIEW_META)[number]["key"]) {
  switch (key) {
    case "streak":
      return data.streak;
    case "xp":
      return data.xp;
    case "level":
      return data.level;
    case "goal":
      return data.todayMinutes;
    case "fluency":
      return data.fluencyScore;
  }
}

export function AuthFeaturePreview({
  className,
  data,
  loading,
}: {
  className?: string;
  data: PreviewCacheData;
  loading?: boolean;
}) {
  return (
    <div className={cn("mt-6", className)}>
      <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {data.updatedAt ? "Your progress snapshot" : "What awaits you"}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none sm:grid sm:grid-cols-5 sm:overflow-visible">
        {PREVIEW_META.map((s, i) => {
          const Icon = s.icon;
          const value = previewValue(data, s.key);
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="auth-stat-chip min-w-[88px] shrink-0 px-2.5 py-2.5 text-center sm:min-w-0"
            >
              <Icon className={cn("mx-auto h-3.5 w-3.5", s.color)} />
              <p className="mt-1 text-[10px] font-medium text-slate-500">{s.label}</p>
              <div className="text-sm font-bold text-slate-800">
                {loading ? (
                  <Skeleton className="mx-auto h-4 w-10" />
                ) : (
                  <AnimatedNumber value={value ?? 0} suffix={s.suffix} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
