"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { api } from "@/lib/api";

const GOALS = [
  { id: "fluency", label: "Speak fluently every day" },
  { id: "grammar", label: "Fix grammar & Hinglish mixing" },
  { id: "pronunciation", label: "Improve pronunciation" },
  { id: "confidence", label: "Build speaking confidence" },
];

export default function ProfileSetupPage() {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [learningGoal, setLearningGoal] = useState(GOALS[0].id);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finish = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.profileSetup({ learningGoal, dailyGoalMinutes, targetDays: 90 });
      await refreshUser();
      router.push(res.next || "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <p className="text-xs font-bold uppercase tracking-widest text-violet-600">Profile setup</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight">
        {step === 1 ? "What is your learning goal?" : "Set a daily practice goal"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        {step === 1
          ? "We'll personalize coaching tips around this focus."
          : "Consistency beats intensity. Start with a target you can keep."}
      </p>

      {step === 1 ? (
        <div className="mt-8 grid gap-3">
          {GOALS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setLearningGoal(g.id)}
              className={`rounded-2xl border px-4 py-4 text-left text-sm font-bold transition ${
                learningGoal === g.id
                  ? "border-violet-400 bg-violet-500/10 text-violet-700"
                  : "border-white/60 bg-white/60 dark:border-white/10 dark:bg-white/5"
              }`}
            >
              {g.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-4 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-sm font-bold text-white"
          >
            Continue
          </button>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <div>
            <label className="text-sm font-bold">Daily minutes: {dailyGoalMinutes}</label>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={dailyGoalMinutes}
              onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
              className="mt-3 w-full accent-violet-600"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-2xl border border-white/60 py-3 text-sm font-bold dark:border-white/10">
              Back
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={finish}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {loading ? "Saving…" : "Go to dashboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
