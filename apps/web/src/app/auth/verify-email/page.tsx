"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthAmbientBackground } from "@/components/auth/AuthAmbientBackground";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";

function VerifyEmailForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const email = params.get("email") ?? "";
  const [otp, setOtp] = useState(params.get("devOtp") ?? "");
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(60);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.verifyEmail({ email, otp });
      await refreshUser();
      router.push(res.next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (resendIn > 0) return;
    setMessage("");
    setError("");
    try {
      const res = await api.resendOtp({ email, purpose: "verify" });
      setMessage(res.message);
      if (res.devOtp) setOtp(res.devOtp);
      setResendIn(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not resend");
    }
  };

  return (
    <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/50 bg-white/85 p-8 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85">
      <h1 className="text-3xl font-black tracking-tight">Verify email</h1>
      <p className="mt-2 text-sm text-muted">
        Enter the 6-digit code sent to <strong>{email || "your email"}</strong>. Expires in 10 minutes.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center text-2xl font-black tracking-[0.4em] outline-none focus:border-violet-400 dark:border-white/10 dark:bg-slate-800"
          placeholder="000000"
          aria-label="One-time code"
          required
        />
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}
        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {loading ? "Verifying…" : "Verify & continue"}
        </button>
      </form>
      <button
        type="button"
        onClick={resend}
        disabled={resendIn > 0}
        className="mt-4 w-full text-sm font-semibold text-violet-600 disabled:text-muted"
      >
        {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
      </button>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <AuthAmbientBackground />
      <Suspense fallback={<div className="text-sm text-muted">Loading…</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
