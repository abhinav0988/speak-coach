"use client";

import { motion } from "framer-motion";
import { Mic2, Sparkles, Star } from "lucide-react";
import { PRACTICE_MODULES } from "@/components/dashboard/constants";
import type { PreviewCacheData } from "@/lib/preview-cache";
import { AuthAmbientBackground } from "./AuthAmbientBackground";

const FEATURE_IDS = ["session", "coach", "challenge"] as const;

export function AuthMarketingPanel({ preview }: { preview: PreviewCacheData }) {
  const features = FEATURE_IDS.map((id) => PRACTICE_MODULES.find((m) => m.id === id)).filter(Boolean);

  return (
    <div className="auth-marketing auth-marketing-gradient relative flex flex-col justify-between text-white">
      <AuthAmbientBackground variant="marketing" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex items-center gap-3 lg:mb-12"
        >
          <div className="auth-logo-glow flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5B5CF6] to-[#7C3AED] shadow-lg">
            <Mic2 className="h-6 w-6 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">Speak Coach</p>
            <p className="text-xs text-white/70">
              Level {preview.level} · {preview.levelName}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="max-w-lg"
        >
          <div className="mb-6 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex h-28 w-28 items-center justify-center rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-xl sm:h-32 sm:w-32">
                <span className="text-5xl sm:text-6xl" role="img" aria-label="AI speaking coach">
                  🗣️
                </span>
                <motion.span
                  className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-violet-500 shadow-lg"
                  animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="h-4 w-4 text-white" />
                </motion.span>
              </div>
            </div>
          </div>

          <h1 className="text-center text-[28px] font-bold leading-tight tracking-tight lg:text-left sm:text-[34px] xl:text-[40px]">
            Speak English with confidence.
          </h1>
          <p className="mt-4 text-center text-sm leading-relaxed text-white/75 lg:text-left sm:text-base">
            Your AI coach helps improve pronunciation, grammar, confidence and fluency every day.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-8 flex gap-3 overflow-x-auto pb-2 scrollbar-none lg:mt-10 lg:flex-col lg:overflow-visible"
        >
          {features.map((mod, i) => {
            if (!mod) return null;
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="auth-feature-card min-w-[200px] shrink-0 p-4 lg:min-w-0"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${mod.iconGradient} text-white shadow-md`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{mod.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-slate-600">{mod.subtitle}</p>
                    <p className="mt-1 text-[10px] font-semibold text-violet-600">
                      +{mod.xpReward} XP · {mod.time}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="relative z-10 mt-8 lg:mt-0"
      >
        <div className="flex items-center gap-1 text-amber-300">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <p className="mt-2 text-sm font-semibold text-white/90">Trusted by learners worldwide</p>
        <p className="mt-1 text-xs text-white/60">
          {preview.targetDays}-day learning journey
          {preview.totalSessions > 0 && (
            <>
              {" "}
              · <span className="text-white/80">{preview.totalSessions} sessions completed</span>
            </>
          )}
        </p>
        {preview.leaderboardTop3.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {preview.leaderboardTop3.slice(0, 3).map((row) => (
              <span
                key={row.name}
                className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/85"
              >
                {row.isYou ? "You" : row.name.split(" ")[0]} · {row.xp} XP
              </span>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
