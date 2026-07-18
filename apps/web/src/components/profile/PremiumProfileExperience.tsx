"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Bell,
  BookOpen,
  Brain,
  Calendar,
  Crown,
  Download,
  Flame,
  Gauge,
  Globe,
  LogOut,
  Menu,
  Mic,
  Moon,
  Search,
  Settings,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
  Sun,
  Target,
  Volume2,
  Zap,
} from "lucide-react";
import { useAuth, getInitials } from "@/components/AuthProvider";
import { useTheme } from "@/components/ThemeProvider";
import { ACHIEVEMENT_DEFS } from "@/components/dashboard/constants";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Skeleton } from "@/components/ui/primitives";
import { useProfileData, type ProfileData } from "@/hooks/useProfileData";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ProfileEditorModal } from "./ProfileEditorModal";
import {
  GlassMetricCard,
  MembershipCard,
  PfAvatar,
  PfBadge3D,
  PfButton,
  PfGlass,
  PfGradientBorder,
  PfHeatmap,
  PfRadar,
  PfRing,
  PfSectionTitle,
  ProfileAurora,
  SettingsCard,
} from "./design-system";

const TIER_CYCLE = ["gold", "silver", "crystal", "diamond"] as const;
const QUOTES = [
  "Every word you speak builds your future.",
  "Consistency beats perfection.",
  "Your voice is your superpower.",
  "Small steps, big fluency gains.",
];

function profileCompletion(profile: ProfileData["profile"], settings: ProfileData["settings"]) {
  let score = 0;
  if (profile.name?.length >= 2) score += 25;
  if (profile.email?.includes("@")) score += 25;
  if (settings?.daily_goal_minutes) score += 25;
  if (profile.startDate) score += 25;
  return score;
}

function ProfileContent({ data, onRefresh }: { data: ProfileData; onRefresh: () => void }) {
  const { user, signOut, updateUser } = useAuth();
  const { theme, toggle } = useTheme();
  const [editorOpen, setEditorOpen] = useState(false);
  const [profile, setProfile] = useState(data.profile);
  const [streakInfo, setStreakInfo] = useState(data.streak);

  const { stats, dashboard: d, analytics: a, insights, journey, practice, leaderboard, settings } = data;

  const displayName = profile.name ?? user?.name ?? "Learner";
  const initials = getInitials(displayName);
  const xp = d?.gamification?.xp ?? (a ? a.totals.sessions * 45 + a.totals.recordings * 18 : 0);
  const level = d?.gamification?.level ?? Math.max(1, Math.round((stats.dayNumber || 1) / 8));
  const rank = leaderboard?.yourRank ?? null;
  const fluency = d?.fluencyScore ?? stats.fluencyScore ?? (a ? Math.round(a.averages.clarity * 0.85) : 0);
  const completion = profileCompletion(profile, settings);
  const quote = QUOTES[stats.dayNumber % QUOTES.length];
  const dailyGoal = settings?.daily_goal_minutes ?? a?.goalMinutes ?? 15;
  const goalPct = a?.goalProgressPct ?? 0;
  const weeklyGoalPct = Math.min(100, Math.round((a?.weeklyStats.slice(-7).reduce((s, w) => s + w.minutes, 0) ?? 0) / (dailyGoal * 7) * 100));
  const monthlyGoalPct = Math.min(100, Math.round((a?.monthlyStats.slice(-1)[0]?.minutes ?? 0) / (dailyGoal * 30) * 100));
  const speakingMin = a?.totals.speakingMinutes ?? stats.totalSessions * 8;
  const confidence = a ? Math.round(a.averages.clarity * 0.45 + a.averages.loudness * 0.25 + goalPct * 0.3) : 55;
  const grammar = a ? Math.max(40, 100 - Math.round((a.totals.corrections / Math.max(a.totals.sessions, 1)) * 3)) : 60;
  const pronunciation = a ? Math.round(a.averages.clarity * 0.9 + a.averages.loudness * 0.1) : 58;
  const vocabulary = a ? Math.min(99, 35 + a.totals.sessions * 2) : 40;
  const badgeCount = ACHIEVEMENT_DEFS.filter((b) => b.threshold({ sessions: stats.totalSessions, streak: streakInfo.streak, xp, day: stats.dayNumber, fluency })).length;
  const weeklySpark = a?.weeklyStats.slice(-7).map((w) => w.minutes) ?? [3, 5, 8, 6, 10, 7, 9];
  const xpSpark = a?.weeklyStats.slice(-7).map((w, i) => w.minutes * 8 + w.sessions * 15 + i * 5) ?? [40, 55, 70, 60, 90, 75, 100];

  const achievementCtx = { sessions: stats.totalSessions, streak: streakInfo.streak, xp, day: stats.dayNumber, fluency };
  const achievements = ACHIEVEMENT_DEFS.map((def, i) => ({
    ...def,
    earned: def.threshold(achievementCtx),
    tier: TIER_CYCLE[i % TIER_CYCLE.length],
  }));

  const radarScores = [
    { label: "Grammar", value: grammar },
    { label: "Fluency", value: fluency },
    { label: "Vocab", value: vocabulary },
    { label: "Confidence", value: confidence },
    { label: "Pronunciation", value: pronunciation },
  ];

  const aiStrength = insights.find((i) => /improved|strong|great|better/i.test(i)) ?? "Speaking clarity";
  const aiWeakness = insights.find((i) => /focus|attention|work on|weak/i.test(i)) ?? (a?.topMistakes[0]?.wrong ?? "Word endings");
  const aiSummary = insights[0] ?? `You're on day ${stats.dayNumber} with ${streakInfo.streak}-day streak. Keep practicing ${dailyGoal} min daily.`;
  const predictedLevel = Math.min(99, level + Math.max(1, Math.round(streakInfo.streak / 14)));
  const nextAchievement = achievements.find((b) => !b.earned)?.name ?? "All unlocked!";

  const timelineItems = useMemo(() => {
    const items: Array<{ day: number; label: string; type: string; detail: string }> = [];
    if (journey) {
      journey.milestones.filter((m) => m.reached).forEach((m) => {
        items.push({ day: m.day, label: m.label, type: "milestone", detail: m.completed ? "Completed" : "Reached" });
      });
    }
    if (level >= 2) items.push({ day: stats.dayNumber, label: `Level ${level}`, type: "level", detail: `${xp} XP earned` });
    if (streakInfo.streak >= 7) items.push({ day: stats.dayNumber, label: `${streakInfo.streak}-day streak`, type: "streak", detail: "Consistency champion" });
    achievements.filter((b) => b.earned).slice(0, 3).forEach((b) => {
      items.push({ day: stats.dayNumber, label: b.name, type: "badge", detail: `+${b.xp} XP` });
    });
    return items.sort((x, y) => x.day - y.day).slice(-8);
  }, [journey, level, stats.dayNumber, streakInfo.streak, xp, achievements]);

  const recentActivity = useMemo(() => {
    const acts: Array<{ icon: string; title: string; time: string }> = [];
    if (streakInfo.practicedToday) acts.push({ icon: "🎯", title: "Daily practice completed", time: "Today" });
    if (a && a.totals.corrections > 0) acts.push({ icon: "📝", title: `${a.totals.corrections} grammar corrections`, time: "This week" });
    if (a && a.totals.recordings > 0) acts.push({ icon: "🎤", title: `${a.totals.recordings} voice recordings`, time: "Recent" });
    achievements.filter((b) => b.earned).slice(-2).forEach((b) => acts.push({ icon: b.icon, title: `Unlocked: ${b.name}`, time: "Achievement" }));
    acts.push({ icon: "✨", title: "AI coaching session", time: "Available" });
    return acts.slice(0, 6);
  }, [streakInfo.practicedToday, a, achievements]);

  const useFreeze = async () => {
    await api.useStreakFreeze();
    setStreakInfo(await api.getStreak());
  };

  const shareProfile = async () => {
    const text = `${displayName} · Level ${level} · ${streakInfo.streak}-day streak · ${fluency}% fluency on Speak Coach`;
    if (navigator.share) {
      await navigator.share({ title: "My Speak Coach Profile", text });
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <div className="relative min-h-dvh w-full min-w-0 overflow-x-hidden pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8 lg:pt-0">
      <ProfileAurora />

      {/* TOP BAR — mobile only */}
      <div className="sticky top-0 z-50 px-2 pb-3 pt-[max(0.25rem,env(safe-area-inset-top))] sm:px-4 lg:hidden">
        <PfGlass className="pf-topbar mx-auto flex w-full min-w-0 max-w-content items-center justify-between gap-2 rounded-[24px] px-3 py-2.5" glow="purple">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex h-10 w-10 items-center justify-center rounded-xl text-muted sm:hidden">
              ←
            </Link>
            <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-xl text-muted sm:flex" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
            <button type="button" className="hidden h-10 w-10 items-center justify-center rounded-xl text-muted sm:flex" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm font-bold sm:hidden">Profile</p>
          <div className="flex items-center gap-2">
            <span className="pf-online-badge hidden items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold text-emerald-700 sm:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Online
            </span>
            <button type="button" onClick={toggle} className="flex h-10 w-10 items-center justify-center rounded-xl text-muted hover:bg-white/40" aria-label="Theme">
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-xl text-muted" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </PfGlass>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-content space-y-6 px-2 sm:space-y-8 sm:px-4 md:px-6">
        {/* HERO */}
        <PfGradientBorder animated>
          <div className="relative overflow-hidden p-6 sm:p-8">
            <div className="pf-hero-sweep pointer-events-none absolute inset-0" />
            <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <PfAvatar initials={initials} level={level} size="xl" />
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2.5 py-0.5 text-[10px] font-black text-white">Premium Learner</span>
                  <span className="rounded-full bg-white/50 px-2.5 py-0.5 text-[10px] font-bold dark:bg-white/10">{completion}% complete</span>
                </div>
                <h1 className="mt-2 bg-gradient-to-br from-slate-900 to-violet-900 bg-clip-text text-3xl font-black leading-none text-transparent dark:from-slate-100 dark:to-violet-200 md:text-4xl xl:text-5xl">
                  {displayName}
                </h1>
                <p className="mt-2 text-[16px] italic text-muted">&ldquo;{quote}&rdquo;</p>
                <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
                  <div className="text-center"><p className="text-[10px] font-bold uppercase text-muted">Level</p><p className="text-xl font-black"><AnimatedNumber value={level} /></p></div>
                  <div className="text-center"><p className="text-[10px] font-bold uppercase text-muted">XP</p><p className="text-xl font-black"><AnimatedNumber value={xp} /></p></div>
                  <div className="text-center"><p className="text-[10px] font-bold uppercase text-muted">Rank</p><p className="text-xl font-black">{rank === null ? "—" : `#${rank}`}</p></div>
                  <div className="text-center"><p className="text-[10px] font-bold uppercase text-muted">Streak</p><p className="text-xl font-black text-orange-500"><AnimatedNumber value={streakInfo.streak} suffix="d" /></p></div>
                </div>
                {profile.startDate && (
                  <p className="mt-3 flex items-center justify-center gap-1.5 text-[13px] text-muted sm:justify-start">
                    <Calendar className="h-4 w-4" /> Member since {profile.startDate.slice(0, 10)}
                  </p>
                )}
                <p className="mt-1 text-[13px] text-muted">Goal: {dailyGoal} min/day · Day {stats.dayNumber}/{profile.targetDays}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <PfButton onClick={() => setEditorOpen(true)}>Edit Profile</PfButton>
                  <PfButton variant="ghost" onClick={() => void shareProfile()}><Share2 className="h-4 w-4" /> Share</PfButton>
                </div>
              </div>
            </div>
          </div>
        </PfGradientBorder>

        {/* STATS GRID */}
        <section>
          <PfSectionTitle title="Your Stats" subtitle="Live learning metrics" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <GlassMetricCard icon={Crown} label="Level" value={level} gradient="from-amber-500 to-orange-600" sparkline={xpSpark} />
            <GlassMetricCard icon={Zap} label="XP" value={xp} gradient="from-violet-500 to-purple-600" trend={12} sparkline={xpSpark} />
            <GlassMetricCard icon={Flame} label="Streak" value={streakInfo.streak} suffix="d" gradient="from-orange-500 to-rose-600" />
            <GlassMetricCard icon={Calendar} label="Practice Days" value={streakInfo.totalPracticeDays} gradient="from-blue-500 to-indigo-600" />
            <GlassMetricCard icon={Mic} label="Sessions" value={stats.totalSessions} gradient="from-cyan-500 to-blue-600" />
            <GlassMetricCard icon={Volume2} label="Speaking Min" value={speakingMin} gradient="from-emerald-500 to-teal-600" sparkline={weeklySpark} />
            <GlassMetricCard icon={Gauge} label="Fluency" value={fluency} suffix="%" gradient="from-pink-500 to-rose-600" trend={5} />
            <GlassMetricCard icon={BookOpen} label="Grammar" value={grammar} suffix="%" gradient="from-indigo-500 to-violet-600" />
            <GlassMetricCard icon={Sparkles} label="Vocabulary" value={vocabulary} suffix="%" gradient="from-fuchsia-500 to-pink-600" />
            <GlassMetricCard icon={Brain} label="Confidence" value={confidence} suffix="%" gradient="from-sky-500 to-cyan-600" />
            <GlassMetricCard icon={Target} label="Pronunciation" value={pronunciation} suffix="%" gradient="from-lime-500 to-emerald-600" />
            <GlassMetricCard icon={Award} label="Badges" value={badgeCount} gradient="from-yellow-500 to-amber-600" />
          </div>
        </section>

        {/* AI INSIGHTS + RADAR */}
        <div className="grid gap-4 lg:grid-cols-2">
          <PfGlass className="p-6" glow="purple">
            <div className="flex items-center gap-3">
              <div className="pf-ai-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#EC4899] text-2xl">✨</div>
              <div>
                <p className="text-[10px] font-bold uppercase text-muted">AI Profile Insights</p>
                <h3 className="text-[22px] font-black">Learning Personality</h3>
              </div>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{aiSummary}</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Strength", value: aiStrength, color: "text-emerald-600" },
                { label: "Needs Attention", value: aiWeakness, color: "text-rose-500" },
                { label: "Most Improved", value: "Clarity & pace", color: "text-blue-600" },
                { label: "Predicted Level", value: `Lv ${predictedLevel}`, color: "text-violet-600" },
                { label: "Next Achievement", value: nextAchievement, color: "text-amber-600" },
                { label: "Suggested Practice", value: `${dailyGoal} min speaking`, color: "text-cyan-600" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/40 bg-white/30 p-3 dark:bg-white/5">
                  <p className="text-[9px] font-bold uppercase text-muted">{item.label}</p>
                  <p className={cn("mt-1 text-[13px] font-bold", item.color)}>{item.value}</p>
                </div>
              ))}
            </div>
          </PfGlass>
          <PfGlass className="p-6" glow="blue">
            <PfSectionTitle title="Skill Radar" subtitle="Your speaking profile" />
            <PfRadar scores={radarScores} />
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {radarScores.map((s) => (
                <span key={s.label} className="rounded-full bg-white/40 px-2 py-0.5 text-[10px] font-bold dark:bg-white/5">{s.label} {s.value}%</span>
              ))}
            </div>
          </PfGlass>
        </div>

        {/* GOALS */}
        <section>
          <PfSectionTitle title="Goals" subtitle="Track your momentum" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <PfGlass className="flex flex-col items-center p-4"><PfRing value={goalPct} size={88} label="Today" /></PfGlass>
            <PfGlass className="flex flex-col items-center p-4"><PfRing value={weeklyGoalPct} size={88} label="Weekly" /></PfGlass>
            <PfGlass className="flex flex-col items-center p-4"><PfRing value={monthlyGoalPct} size={88} label="Monthly" /></PfGlass>
            <PfGlass className="flex flex-col items-center p-4"><PfRing value={Math.min(100, Math.round(xp % 500 / 5))} size={88} label="XP" /></PfGlass>
            <PfGlass className="flex flex-col items-center p-4"><PfRing value={Math.min(100, Math.round(speakingMin / 2))} size={88} label="Speaking" /></PfGlass>
            <PfGlass className="flex flex-col items-center p-4"><PfRing value={Math.min(100, streakInfo.streak * 7)} size={88} label="Consistency" /></PfGlass>
          </div>
        </section>

        {/* STREAK */}
        <section>
          <PfSectionTitle title="Streak" subtitle="Keep the fire alive" />
          <PfGradientBorder>
            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="pf-fire text-5xl">🔥</span>
                  <div>
                    <p className="text-[40px] font-black leading-none text-orange-500"><AnimatedNumber value={streakInfo.streak} /></p>
                    <p className="text-[13px] font-bold text-muted">Current streak · Best {streakInfo.longestStreak}d</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="rounded-2xl bg-white/40 px-4 py-2 text-center dark:bg-white/5">
                    <p className="text-[10px] font-bold text-muted">Freezes</p>
                    <p className="text-lg font-black">{streakInfo.freezesAvailable}</p>
                  </div>
                  {streakInfo.freezesAvailable > 0 && (
                    <PfButton variant="ghost" onClick={() => void useFreeze()} className="!py-2 text-xs">Use Freeze</PfButton>
                  )}
                </div>
              </div>
              {practice && (
                <div className="mt-6">
                  <p className="mb-3 text-[12px] font-bold text-muted">Consistency calendar</p>
                  <PfHeatmap days={practice.heatmap} />
                </div>
              )}
            </div>
          </PfGradientBorder>
        </section>

        {/* ACHIEVEMENTS */}
        <section>
          <PfSectionTitle title="Achievements" subtitle="Your badge cabinet" action={<PfButton href="/rewards" variant="ghost" className="!px-3 !py-2 text-xs">View all</PfButton>} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {achievements.map((b) => (
              <PfBadge3D key={b.id} icon={b.icon} name={b.name} tier={b.tier} earned={b.earned} xp={b.xp} />
            ))}
          </div>
        </section>

        {/* LEARNING JOURNEY */}
        <section>
          <PfSectionTitle title="Learning Journey" subtitle={`Day ${stats.dayNumber} of ${profile.targetDays}`} />
          <PfGlass className="p-6">
            <div className="space-y-0">
              {timelineItems.length === 0 ? (
                <p className="text-muted">Start practicing to build your journey timeline.</p>
              ) : timelineItems.map((item, i) => (
                <motion.div key={`${item.label}-${i}`} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="pf-timeline-item relative flex gap-4 pb-8 pl-2">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] text-lg text-white shadow-lg">
                    {item.type === "milestone" ? "🎯" : item.type === "streak" ? "🔥" : item.type === "badge" ? "🏆" : "⬆"}
                  </div>
                  <div>
                    <p className="font-bold">Day {item.day} — {item.label}</p>
                    <p className="text-[13px] text-muted">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </PfGlass>
        </section>

        {/* RECENT ACTIVITY */}
        <section>
          <PfSectionTitle title="Recent Activity" />
          <div className="space-y-2">
            {recentActivity.map((act, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <PfGlass className="flex items-center gap-4 p-4">
                  <span className="text-2xl">{act.icon}</span>
                  <div className="flex-1"><p className="font-bold">{act.title}</p><p className="text-[12px] text-muted">{act.time}</p></div>
                </PfGlass>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MEMBERSHIP */}
        <section>
          <PfSectionTitle title="Membership" />
          <MembershipCard />
        </section>

        {/* ACCOUNT */}
        <section>
          <PfSectionTitle title="Account" subtitle="Settings & preferences" />
          <div className="grid gap-3 sm:grid-cols-2">
            <SettingsCard icon={Bell} title="Notifications" subtitle="Reminders & alerts" href="/settings" />
            <SettingsCard icon={Globe} title="Language" subtitle="Accent & preferences" onClick={() => setEditorOpen(true)} />
            <SettingsCard icon={Shield} title="Privacy & Security" subtitle="Data & account safety" href="/settings" />
            <SettingsCard icon={Download} title="Export Data" subtitle="Download your progress" href="/settings" />
            <SettingsCard icon={Smartphone} title="Connected Devices" subtitle="Sync across devices" href="/settings" />
            <SettingsCard icon={Settings} title="App Settings" subtitle="Goals, theme, exports" href="/settings" />
          </div>
        </section>

        {/* SIGN OUT */}
        <PfGlass className="border-rose-200/50 p-5 dark:border-rose-900/30">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold text-foreground">Sign out</p>
              <p className="text-[13px] text-muted">You&apos;ll need to sign in again on this device</p>
            </div>
            <PfButton variant="danger" onClick={signOut}><LogOut className="h-4 w-4" /> Sign out</PfButton>
          </div>
        </PfGlass>
      </div>

      <ProfileEditorModal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        profile={profile}
        settings={settings}
        initials={initials}
        onSaved={(p) => { setProfile(p); updateUser({ name: p.name, email: p.email }); onRefresh(); }}
      />
    </div>
  );
}

export function PremiumProfileExperience() {
  const { data, loading, error, refresh } = useProfileData();

  if (loading) {
    return (
      <div className="relative min-h-dvh w-full p-4 sm:p-6">
        <ProfileAurora />
        <div className="mx-auto max-w-5xl space-y-4">
          <Skeleton className="h-14 rounded-[24px]" />
          <Skeleton className="h-56 rounded-[28px]" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-[24px]" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center p-4 sm:p-6">
        <ProfileAurora />
        <PfGlass className="max-w-md p-8 text-center">
          <p className="text-lg font-bold">Could not load profile</p>
          <PfButton onClick={() => void refresh()} className="mt-4">Retry</PfButton>
        </PfGlass>
      </div>
    );
  }

  return <ProfileContent data={data} onRefresh={refresh} />;
}
