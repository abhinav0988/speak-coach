"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthAmbientBackground } from "@/components/auth/AuthAmbientBackground";
import { AuthPremiumInput } from "@/components/auth/AuthPremiumInput";
import { useAuth } from "@/components/AuthProvider";
import { KeyRound, Mail } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const next = await login({ email, password, rememberMe });
      router.push(next);
    } catch (err) {
      const e = err as Error & { next?: string; email?: string; status?: number };
      if (e.status === 403 && e.next?.includes("verify")) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(e.email || email)}`);
        return;
      }
      setError(e.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <AuthAmbientBackground />
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/50 bg-white/85 p-8 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85">
        <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-muted">Sign in with your verified email.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <AuthPremiumInput
            label="Email"
            icon={Mail}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <AuthPremiumInput
            label="Password"
            icon={KeyRound}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 font-medium text-foreground">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-violet-600"
              />
              Remember me
            </label>
            <Link href="/auth/forgot-password" className="font-semibold text-violet-600 hover:text-violet-700">
              Forgot password?
            </Link>
          </div>
          {error && (
            <p role="alert" className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] px-4 py-3 text-sm font-bold text-white disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/auth/register" className="font-semibold text-violet-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
