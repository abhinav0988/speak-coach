"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthAmbientBackground } from "@/components/auth/AuthAmbientBackground";
import { AuthPremiumInput } from "@/components/auth/AuthPremiumInput";
import { api } from "@/lib/api";
import { KeyRound } from "lucide-react";

function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") ?? "";
  const [otp, setOtp] = useState(params.get("devOtp") ?? "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.resetPassword({ email, otp, password, confirmPassword });
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/50 bg-white/85 p-8 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85">
      <h1 className="text-3xl font-black tracking-tight">Reset password</h1>
      <p className="mt-2 text-sm text-muted">Enter the code for {email || "your email"} and choose a new password.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-xl font-black tracking-[0.35em] dark:border-white/10 dark:bg-slate-800"
          placeholder="OTP"
          required
        />
        <AuthPremiumInput label="New password" icon={KeyRound} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
        <AuthPremiumInput label="Confirm password" icon={KeyRound} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-sm font-bold text-white disabled:opacity-60">
          {loading ? "Updating…" : "Update password"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link href="/auth/login" className="font-semibold text-violet-600">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <AuthAmbientBackground />
      <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
        <ResetForm />
      </Suspense>
    </div>
  );
}
