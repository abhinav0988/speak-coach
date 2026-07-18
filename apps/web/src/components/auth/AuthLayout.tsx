"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import type { PreviewCacheData } from "@/lib/preview-cache";
import { AuthAmbientBackground } from "./AuthAmbientBackground";
import { AuthMarketingPanel } from "./AuthMarketingPanel";

type AuthLayoutProps = {
  mode: "sign-in" | "sign-up";
  preview: PreviewCacheData;
  children: ReactNode;
};

export function AuthLayout({ mode, preview, children }: AuthLayoutProps) {
  const isSignUp = mode === "sign-up";

  return (
    <div className="auth-screen">
      <div className="auth-split">
        <AuthMarketingPanel preview={preview} />

        <div className="auth-form-panel">
          <AuthAmbientBackground variant="form" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-[480px]"
          >
            <div className="auth-card">{children}</div>
            <p className="mt-4 text-center text-[11px] text-slate-400 lg:hidden">
              {isSignUp
                ? `${preview.targetDays}-day learning journey`
                : preview.journeyDay > 1
                  ? `Day ${preview.journeyDay} of ${preview.targetDays}`
                  : "Trusted by learners worldwide"}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
