"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Moon, Sun, X } from "lucide-react";
import type { UserProfile, UserSettings } from "@speak-coach/shared";
import { api } from "@/lib/api";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { PfButton, PfGlass } from "./design-system";

const ACCENTS = ["US English", "UK English", "Australian", "Indian English"];
const LANGUAGES = ["English", "Hindi", "Hinglish"];
const GOALS = ["Fluency", "Interview prep", "Business English", "Travel", "Pronunciation"];

export function ProfileEditorModal({
  open,
  onClose,
  profile,
  settings,
  initials,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  settings: UserSettings | null;
  initials: string;
  onSaved: (profile: UserProfile) => void;
}) {
  const { theme, toggle } = useTheme();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [country, setCountry] = useState("India");
  const [language, setLanguage] = useState("Hinglish");
  const [accent, setAccent] = useState("Indian English");
  const [goal, setGoal] = useState("Fluency");
  const [level, setLevel] = useState("Intermediate");
  const [dailyGoal, setDailyGoal] = useState(settings?.daily_goal_minutes ?? 15);
  const [reminder, setReminder] = useState(!!settings?.reminder_enabled);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(profile.name);
    setEmail(profile.email);
    setDailyGoal(settings?.daily_goal_minutes ?? 15);
    setReminder(!!settings?.reminder_enabled);
    setSaved(false);
    setNameError("");
  }, [open, profile, settings]);

  const save = async () => {
    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      return;
    }
    setSaving(true);
    try {
      const [profileRes] = await Promise.all([
        api.updateProfile({ name: name.trim(), email: email.trim() }),
        api.updateSettings({ dailyGoalMinutes: dailyGoal, reminderEnabled: reminder }),
      ]);
      onSaved(profileRes.profile);
      setSaved(true);
      setTimeout(() => { setSaved(false); onClose(); }, 1200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center">
          <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[28px]">
            <PfGlass className="p-6" glow="purple">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[22px] font-black">Edit Profile</h2>
                <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-white/30" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-6 flex flex-col items-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#EC4899] text-2xl font-black text-white">
                    {initials}
                  </div>
                  <button type="button" className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg dark:bg-slate-800" aria-label="Change photo">
                    <Camera className="h-4 w-4 text-primary" />
                  </button>
                </div>
                <p className="mt-2 text-[12px] text-muted">Tap to change photo</p>
              </div>

              <div className="space-y-4">
                <FloatingField label="Display name" value={name} onChange={(v) => { setName(v); setNameError(""); }} error={nameError} />
                <FloatingField label="Email" value={email} onChange={setEmail} type="email" />
                <FloatingSelect label="Country" value={country} options={["India", "USA", "UK", "Canada", "Australia"]} onChange={setCountry} />
                <FloatingSelect label="Language" value={language} options={LANGUAGES} onChange={setLanguage} />
                <FloatingSelect label="Accent" value={accent} options={ACCENTS} onChange={setAccent} />
                <FloatingSelect label="Learning goal" value={goal} options={GOALS} onChange={setGoal} />
                <FloatingSelect label="Speaking level" value={level} options={["Beginner", "Intermediate", "Advanced", "Native-like"]} onChange={setLevel} />
                <div>
                  <label className="text-[12px] font-bold text-muted">Daily goal — {dailyGoal} min</label>
                  <input type="range" min={5} max={60} step={5} value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="mt-2 w-full accent-violet-600" />
                </div>
                <label className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-4 py-3 dark:bg-white/5">
                  <span className="text-sm font-semibold">Practice reminders</span>
                  <input type="checkbox" checked={reminder} onChange={(e) => setReminder(e.target.checked)} className="accent-violet-600" />
                </label>
                <button type="button" onClick={toggle}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-4 py-3 dark:bg-white/5">
                  <span className="text-sm font-semibold">Appearance</span>
                  <span className="flex items-center gap-2 text-sm text-muted">
                    {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    {theme === "dark" ? "Dark" : "Light"}
                  </span>
                </button>
              </div>

              <div className="mt-6 flex gap-3">
                <PfButton variant="ghost" onClick={onClose} className="flex-1">Cancel</PfButton>
                <PfButton onClick={() => void save()} disabled={saving} className="flex-1">
                  {saved ? "Saved!" : saving ? "Saving…" : "Save changes"}
                </PfButton>
              </div>
            </PfGlass>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FloatingField({ label, value, onChange, type = "text", error }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; error?: string;
}) {
  return (
    <div className="relative">
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder=" "
        className={cn("peer w-full rounded-2xl border bg-white/50 px-4 pb-2 pt-6 text-[15px] outline-none transition focus:border-violet-400 dark:bg-white/5",
          error ? "border-rose-400" : "border-white/50")} />
      <label className="pointer-events-none absolute left-4 top-2 text-[11px] font-bold text-muted transition peer-placeholder-shown:top-4 peer-placeholder-shown:text-[14px] peer-focus:top-2 peer-focus:text-[11px]">
        {label}
      </label>
      {error && <p className="mt-1 text-[11px] font-medium text-rose-500">{error}</p>}
    </div>
  );
}

function FloatingSelect({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl border border-white/50 bg-white/50 px-4 pb-2 pt-6 text-[15px] outline-none focus:border-violet-400 dark:bg-white/5">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <label className="pointer-events-none absolute left-4 top-2 text-[11px] font-bold text-muted">{label}</label>
    </div>
  );
}
