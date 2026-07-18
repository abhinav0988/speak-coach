"use client";

import Link from "next/link";
import { ArrowRight, Bookmark, Clock, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import type { PracticeModule } from "@/components/dashboard/constants";
import { AnimatedBadge, MiniRing, PremiumProgress, XPBadge } from "./primitives";
import { cn } from "@/lib/utils";

export function PracticeCard({
  module,
  completion,
  isRecommended,
  index,
}: {
  module: PracticeModule;
  completion: number;
  isRecommended: boolean;
  index: number;
}) {
  const Icon = module.icon;
  const badge = isRecommended ? "ai" : module.badge;
  const featured = isRecommended || badge === "trending";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-24px" }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 260, damping: 24 }}
      whileHover={{ y: -6 }}
    >
      <Link href={module.href} className="group block h-full">
        <div
          className={cn(
            "ph-card-border relative rounded-[26px] p-[1.5px]",
            featured && "ph-card-border-featured"
          )}
        >
          <article
            className={cn(
              "ph-practice-card relative h-full overflow-hidden rounded-[20px] border border-white/60 p-4 backdrop-blur-xl sm:rounded-[22px] sm:p-4",
              "bg-gradient-to-br",
              module.cardGradient,
              featured && "shadow-[0_28px_70px_rgba(124,58,237,0.22)]"
            )}
          >
            <div className="ph-shine pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/30 blur-2xl" />

            <div className="relative flex items-start justify-between gap-2">
              <motion.div
                className={cn(
                  "ph-icon-float flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br text-white shadow-[0_14px_32px_rgba(15,23,42,0.18)] sm:h-14 sm:w-14 sm:rounded-[18px]",
                  module.iconGradient
                )}
                whileHover={{ rotate: 6, scale: 1.06 }}
              >
                <Icon className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.2} />
              </motion.div>
              <div className="flex flex-col items-end gap-1.5">
                {badge === "ai" && <AnimatedBadge label="AI Pick" tone="ai" />}
                {badge === "new" && <AnimatedBadge label="New" tone="new" />}
                {badge === "trending" && <AnimatedBadge label="Trending" tone="hot" />}
                {badge === "recommended" && <AnimatedBadge label="For You" tone="primary" />}
                <div className="relative">
                  <MiniRing value={completion} size={40} />
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-foreground">
                    {completion}%
                  </span>
                </div>
              </div>
            </div>

            <h3 className="relative mt-4 text-base font-bold leading-snug tracking-tight text-foreground sm:text-lg">
              {module.title}
            </h3>
            <p className="relative mt-1 line-clamp-2 text-xs leading-relaxed text-muted sm:text-sm">{module.subtitle}</p>

            <div className="relative mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/60 bg-white/75 px-2.5 py-1 text-xs font-bold text-foreground shadow-sm">
                <Clock className="h-3 w-3" />
                {module.time}
              </span>
              <XPBadge xp={module.xpReward} />
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ring-1",
                  module.difficulty === "Hard"
                    ? "bg-red-100 text-red-700 ring-red-200"
                    : module.difficulty === "Medium"
                      ? "bg-amber-100 text-amber-700 ring-amber-200"
                      : "bg-emerald-100 text-emerald-700 ring-emerald-200"
                )}
              >
                {module.difficulty}
              </span>
            </div>

            <div className="relative mt-3">
              <PremiumProgress value={completion} glow />
            </div>

            <div className="relative mt-4 flex items-center justify-between gap-2">
              <span className="ph-continue-btn inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-3 py-2 text-xs font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.35)] transition group-hover:shadow-[0_14px_32px_rgba(124,58,237,0.45)] sm:text-sm">
                <Sparkles className="h-4 w-4" />
                Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <button
                type="button"
                aria-label="Favorite"
                className="rounded-2xl border border-white/60 bg-white/70 p-2.5 text-muted shadow-sm transition hover:scale-105 hover:text-amber-500"
                onClick={(e) => e.preventDefault()}
              >
                <Star className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Bookmark"
                className="rounded-2xl border border-white/60 bg-white/70 p-2.5 text-muted shadow-sm transition hover:scale-105 hover:text-primary"
                onClick={(e) => e.preventDefault()}
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>
          </article>
        </div>
      </Link>
    </motion.div>
  );
}
