"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mic2, ShieldCheck, Sparkles } from "lucide-react";
import { AuthAmbientBackground } from "@/components/auth/AuthAmbientBackground";

export default function AuthWelcomePage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <AuthAmbientBackground />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg rounded-[28px] border border-white/50 bg-white/80 p-8 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80"
      >
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-white shadow-lg">
          <Mic2 className="h-7 w-7" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Speak Coach</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Your 90-day speaking journey
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Create an account with email verification, practice daily, and track fluency with secure sessions.
        </p>

        <ul className="mt-6 space-y-2 text-sm text-foreground">
          {[
            { icon: ShieldCheck, text: "Email verification + secure JWT sessions" },
            { icon: Sparkles, text: "AI coach, voice practice, and curriculum" },
          ].map((item) => (
            <li key={item.text} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-primary" />
              {item.text}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth/register"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-[1.01]"
          >
            Create account <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/60 bg-white/70 px-5 py-3 text-sm font-bold text-foreground transition hover:bg-white dark:border-white/10 dark:bg-slate-800/70"
          >
            Sign in
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
