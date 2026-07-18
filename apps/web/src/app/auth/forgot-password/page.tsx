"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthAmbientBackground } from "@/components/auth/AuthAmbientBackground";
import { AuthPremiumInput } from "@/components/auth/AuthPremiumInput";
import { api } from "@/lib/api";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.forgotPassword({ email });
      const q = new URLSearchParams({ email });
      if (res.devOtp) q.set("devOtp", res.devOtp);
      router.push(`/auth/reset-password?${q.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <AuthAmbientBackground />
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/50 bg-white/85 p-8 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85">
        <h1 className="text-3xl font-black tracking-tight">Forgot password</h1>
        <p className="mt-2 text-sm text-muted">We&apos;ll email a one-time code to reset your password.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <AuthPremiumInput label="Email" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-sm font-bold text-white disabled:opacity-60">
            {loading ? "Sending…" : "Send reset code"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link href="/auth/login" className="font-semibold text-violet-600">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
