"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Download,
  FileText,
  Globe,
  LogOut,
  Mail,
  Moon,
  Smartphone,
  Target,
  User,
} from "lucide-react";
import { api } from "@/lib/api";
import { registerWebPush } from "@/lib/webPush";
import { DevanagariToggle } from "@/components/DevanagariToggle";
import { FeaturePageLayout } from "@/components/layout/FeaturePageLayout";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Skeleton } from "@/components/ui/primitives";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/components/AuthProvider";

export default function SettingsPage() {
  const { theme, toggle } = useTheme();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [devanagariPreferred, setDevanagariPreferred] = useState(false);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(15);
  const [weeklyReportEmail, setWeeklyReportEmail] = useState(false);
  const [notifStatus, setNotifStatus] = useState("");
  const [goalSaved, setGoalSaved] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then((res) => {
        setReminderEnabled(!!res.settings.reminder_enabled);
        setReminderTime(res.settings.reminder_time ?? "09:00");
        setDevanagariPreferred(!!res.settings.devanagari_preferred);
        setDailyGoalMinutes(res.settings.daily_goal_minutes ?? 15);
        setWeeklyReportEmail(!!res.settings.weekly_report_email);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveReminder = async (enabled: boolean, time: string) => {
    await api.updateSettings({ reminderEnabled: enabled, reminderTime: time });
  };

  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      setNotifStatus("Notifications not supported in this browser");
      return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setReminderEnabled(true);
      await saveReminder(true, reminderTime);
      await registerWebPush();
      setNotifStatus("Notifications enabled!");
    } else {
      setNotifStatus("Permission denied");
    }
  };

  const downloadBackup = async () => {
    setExporting(true);
    try {
      const data = await api.exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `speak-coach-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const downloadSummary = async () => {
    const data = (await api.exportSummary()) as {
      generatedAt: string;
      totalSessions: number;
      fluencyScore: number;
      topMistakes: Array<{ wrong_form: string; correct_form: string; repeat_count: number }>;
    };
    const text = [
      "SPEAK COACH — PROGRESS SUMMARY",
      `Generated: ${data.generatedAt}`,
      "",
      `Total Sessions: ${data.totalSessions}`,
      `Fluency Score: ${data.fluencyScore}/100`,
      "",
      "TOP MISTAKES:",
      ...data.topMistakes.map((m) => `  ${m.wrong_form} → ${m.correct_form} (${m.repeat_count}x)`),
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `speak-coach-summary-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <FeaturePageLayout>
      <PageBack href="/dashboard" label="Dashboard" />
      <PageHeader title="Settings" subtitle="Personalize your learning experience" badge="Preferences" />

      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.name ?? "Your account"}</p>
            <p className="text-sm text-muted">{user?.email || "Manage profile & sign out"}</p>
          </div>
        </div>
        <Link href="/profile">
          <Button variant="secondary">View profile</Button>
        </Link>
      </Card>

      <SettingsSection icon={Bell} title="Daily Reminder" description="Browser notification to practice each day">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reminderEnabled}
              className="accent-primary"
              onChange={async (e) => {
                const on = e.target.checked;
                if (on && Notification.permission !== "granted") {
                  await enableNotifications();
                  return;
                }
                setReminderEnabled(on);
                await saveReminder(on, reminderTime);
              }}
            />
            Enable reminder
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={async (e) => {
              setReminderTime(e.target.value);
              if (reminderEnabled) await saveReminder(true, e.target.value);
            }}
            className="input w-auto"
          />
          <Button variant="secondary" onClick={enableNotifications} className="text-sm">
            Allow Notifications
          </Button>
        </div>
        {notifStatus && <p className="text-sm text-primary">{notifStatus}</p>}
      </SettingsSection>

      <SettingsSection icon={Target} title="Daily Practice Goal" description="Target speaking minutes per day">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={5}
            max={120}
            value={dailyGoalMinutes}
            onChange={(e) => setDailyGoalMinutes(Number(e.target.value))}
            className="input w-24"
          />
          <span className="text-sm text-muted">minutes / day</span>
          <Button
            variant="secondary"
            className="text-sm"
            onClick={async () => {
              await api.updateSettings({ dailyGoalMinutes });
              setGoalSaved(true);
              setTimeout(() => setGoalSaved(false), 2000);
            }}
          >
            {goalSaved ? "Saved ✓" : "Save Goal"}
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection icon={Mail} title="Weekly Email Report" description="Get your progress summary every Sunday morning">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={weeklyReportEmail}
              className="accent-primary"
              onChange={async (e) => {
                const on = e.target.checked;
                if (on && !user?.email) {
                  setNotifStatus("Add your email in Profile first");
                  return;
                }
                setWeeklyReportEmail(on);
                await api.updateSettings({ weeklyReportEmail: on });
                setNotifStatus(on ? "Weekly email reports enabled" : "Weekly email reports disabled");
              }}
            />
            Email me my weekly report
          </label>
          <p className="text-xs text-muted">
            Requires an email on your profile. You can also send a report anytime from Reports.
          </p>
        </div>
      </SettingsSection>

      <SettingsSection icon={Globe} title="Hindi Display" description="Devanagari script vs Roman Hindi on vocabulary pages">
        <DevanagariToggle
          enabled={devanagariPreferred}
          onChange={async (v) => {
            setDevanagariPreferred(v);
            await api.updateSettings({ devanagariPreferred: v });
          }}
        />
      </SettingsSection>

      <SettingsSection icon={Moon} title="Appearance" description="Switch between light and dark mode">
        <Button variant="secondary" onClick={toggle}>
          {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </Button>
      </SettingsSection>

      <SettingsSection icon={Download} title="Export Data" description="Backup your progress and mistakes">
        <div className="space-y-3">
          <Button onClick={downloadBackup} disabled={exporting} className="w-full">
            <Download className="h-4 w-4" />
            {exporting ? "Exporting..." : "Download Full Backup (JSON)"}
          </Button>
          <Button variant="secondary" onClick={downloadSummary} className="w-full">
            <FileText className="h-4 w-4" />
            Download Progress Summary (TXT)
          </Button>
        </div>
      </SettingsSection>

      <SettingsSection icon={Smartphone} title="Install as App" description="Add Speak Coach to your home screen">
        <ul className="space-y-2 text-sm text-muted">
          <li>Mobile: browser menu → &quot;Add to Home Screen&quot;</li>
          <li>Desktop Chrome: install icon in the address bar</li>
        </ul>
        <Link href="/launch" className="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
          Launch checklist →
        </Link>
      </SettingsSection>

      <Card className="border-danger/20 bg-danger/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground">Sign out</p>
            <p className="text-sm text-muted">End your session on this device</p>
          </div>
          <Button variant="secondary" onClick={signOut} className="border-danger/30 text-danger hover:bg-danger/10">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </Card>
    </FeaturePageLayout>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2.5">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}
