"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthAmbientBackground } from "@/components/auth/AuthAmbientBackground";
import { AuthPremiumInput } from "@/components/auth/AuthPremiumInput";
import { useAuth } from "@/components/AuthProvider";
import { KeyRound, Mail, User } from "lucide-react";

function passwordChecks(pw: string) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const checks = useMemo(() => passwordChecks(password), [password]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!Object.values(checks).every(Boolean)) {
      setError("Password does not meet requirements");
      return;
    }
    setLoading(true);
    try {
      const res = await register({ name, email, password, confirmPassword });
      const q = new URLSearchParams({ email: res.email });
      if (res.devOtp) q.set("devOtp", res.devOtp);
      router.push(`/auth/verify-email?${q.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-10">
      <AuthAmbientBackground />
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/50 bg-white/85 p-8 shadow-glass backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85">
        <h1 className="text-3xl font-black tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-muted">We&apos;ll send a 6-digit code to verify your email.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <AuthPremiumInput label="Full name" icon={User} value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          <AuthPremiumInput label="Email" icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          <AuthPremiumInput label="Password" icon={KeyRound} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
          <AuthPremiumInput label="Confirm password" icon={KeyRound} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password" />
          <ul className="grid grid-cols-2 gap-1 text-[11px] font-medium text-muted">
            {[
              ["8+ characters", checks.length],
              ["Uppercase", checks.upper],
              ["Lowercase", checks.lower],
              ["Number", checks.number],
              ["Special char", checks.special],
            ].map(([label, ok]) => (
              <li key={String(label)} className={ok ? "text-emerald-600" : ""}>
                {ok ? "✓" : "○"} {label}
              </li>
            ))}
          </ul>
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
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-violet-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
