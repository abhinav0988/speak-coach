"use client";

import Link from "next/link";
import { useState } from "react";
import { Bot, ChevronUp, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AICoachFloatingProps {
  fluencyScore: number;
  dayNumber: number;
  todayComplete: boolean;
  insights?: string[];
}

export function AICoachFloating({ fluencyScore, dayNumber, todayComplete, insights = [] }: AICoachFloatingProps) {
  const [open, setOpen] = useState(false);

  const suggestions =
    insights.length > 0
      ? insights.slice(0, 3)
      : [
          todayComplete
            ? "Great session! Try shadowing to polish your rhythm."
            : "Start with today's lesson — it's only 8 minutes.",
          fluencyScore < 50
            ? "Your pronunciation needs attention. Visit the Sound Gym."
            : "Your fluency is improving. Challenge yourself with roleplay.",
          `You're on Day ${dayNumber}. Consistency is your superpower.`,
        ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            className="mb-3 w-80 overflow-hidden rounded-card border border-surface-border bg-[var(--card)] shadow-elevated dark:border-gray-700"
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-primary to-secondary px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <span className="font-semibold">AI Coach</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close coach">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-4">
              {suggestions.map((s, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                  <p>{s}</p>
                </div>
              ))}
              <Link
                href="/coach"
                className="block rounded-btn bg-primary py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-700"
              >
                Chat with Coach
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-3.5 font-semibold text-white shadow-elevated"
        aria-label="Open AI Coach"
        aria-expanded={open}
      >
        <Bot className="h-5 w-5" />
        <span className="hidden sm:inline">AI Coach</span>
        {open ? <ChevronUp className="h-4 w-4" /> : null}
      </motion.button>
    </div>
  );
}
