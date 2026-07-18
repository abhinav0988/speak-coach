"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Flame, Mail, Printer, Target, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import type { WeeklyReport } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";
import { StreakCard } from "@/components/dashboard/StreakCard";

export default function ReportsPage() {
  const [report, setReport] = useState<WeeklyReport | null>(null);
  const [streak, setStreak] = useState({ streak: 0, practicedToday: false, freezesAvailable: 0, totalPracticeDays: 0 });
  const [loading, setLoading] = useState(true);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailing, setEmailing] = useState(false);

  useEffect(() => {
    Promise.all([api.getWeeklyReport(), api.getStreak()])
      .then(([r, s]) => {
        setReport(r);
        setStreak(s);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const sendEmail = async () => {
    setEmailing(true);
    setEmailMsg("");
    try {
      const res = await api.sendWeeklyReportEmail();
      setEmailMsg(res.message);
    } catch (e) {
      setEmailMsg(e instanceof Error ? e.message : "Could not send email");
    } finally {
      setEmailing(false);
    }
  };

  const useFreeze = async () => {
    const res = await api.useStreakFreeze();
    const s = await api.getStreak();
    setStreak(s);
    return res;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBack href="/analytics" label="Analytics" />
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div>
        <PageBack href="/analytics" label="Analytics" />
        <Card className="text-center">
          <p className="font-semibold text-danger">Could not load weekly report.</p>
        </Card>
      </div>
    );
  }

  const maxMinutes = Math.max(
    ...report.dailyActivity.map((d) => d.minutes),
    report.dailyGoalMinutes,
    1
  );

  return (
    <div className="space-y-8">
      <PageBack href="/analytics" label="Analytics" />
      <PageHeader
        title="Weekly Report Card"
        subtitle={`${report.weekStart} → ${report.weekEnd}`}
        badge="Progress"
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={sendEmail} disabled={emailing}>
              <Mail className="h-4 w-4" />
              {emailing ? "Sending…" : "Email report"}
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                const html = await api.exportWeeklyReportHtml();
                const win = window.open("", "_blank");
                if (win) {
                  win.document.write(html);
                  win.document.close();
                  win.print();
                }
              }}
            >
              <Printer className="h-4 w-4" />
              Print / Save PDF
            </Button>
          </div>
        }
      />

      {emailMsg && (
        <Card className="border-primary/20 bg-primary/5 text-sm text-foreground">{emailMsg}</Card>
      )}

      <StreakCard
        streak={streak.streak}
        practicedToday={streak.practicedToday}
        freezesAvailable={streak.freezesAvailable}
        totalPracticeDays={streak.totalPracticeDays}
        onUseFreeze={useFreeze}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Sessions" value={report.sessionsCompleted} />
        <Stat label="Speaking" value={`${report.speakingMinutes} min`} />
        <Stat label="Recordings" value={report.recordingsMade} />
        <Stat label="Fluency" value={`${report.fluencyScore}/100`} highlight />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Current Streak" value={`${report.streakDays} days`} icon={Flame} />
        <Stat label="Goal Days" value={`${report.daysGoalMet}/7`} icon={Target} />
        <Stat label="Daily Goal" value={`${report.dailyGoalMinutes} min`} />
      </div>

      <Card>
        <h2 className="mb-1 font-semibold text-foreground">Daily Speaking Minutes</h2>
        <p className="mb-4 text-xs text-muted">
          Orange line = {report.dailyGoalMinutes} min goal ·{" "}
          <Link href="/heatmap" className="text-primary hover:underline">
            Full practice calendar →
          </Link>
        </p>
        <div className="flex items-end gap-2 sm:gap-3" style={{ height: 140 }}>
          {report.dailyActivity.map((d) => {
            const barPct = (d.minutes / maxMinutes) * 100;
            const goalPct = (report.dailyGoalMinutes / maxMinutes) * 100;
            const dayLabel = new Date(d.date + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "short",
            });
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex w-full flex-1 items-end" style={{ minHeight: 100 }}>
                  <div
                    className="absolute left-0 right-0 border-t border-dashed border-warning/70"
                    style={{ bottom: `${goalPct}%` }}
                  />
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      d.goalMet ? "bg-success" : d.minutes > 0 ? "bg-primary/70" : "bg-surface-muted"
                    }`}
                    style={{ height: `${Math.max(barPct, d.minutes > 0 ? 4 : 2)}%` }}
                    title={`${d.minutes} min`}
                  />
                </div>
                <span className="text-[10px] font-medium text-muted">{dayLabel}</span>
                <span className="text-[10px] text-muted">{d.minutes}m</span>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            <h2 className="font-semibold text-foreground">What Improved</h2>
          </div>
          <ul className="space-y-2">
            {report.improvements.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <Badge variant="success">+</Badge>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-foreground">Focus Next Week</h2>
          </div>
          <ul className="space-y-2">
            {report.focusAreas.map((item, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted">
                <Badge variant="default">{i + 1}</Badge>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Avg Loudness</p>
          <p className="text-3xl font-bold text-foreground">{report.avgLoudness}/100</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Avg Clarity</p>
          <p className="text-3xl font-bold text-foreground">{report.avgClarity}/100</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Pronunciation Accuracy</p>
          <p className="text-3xl font-bold text-foreground">{report.avgAccuracy}%</p>
        </Card>
      </div>

      {report.topMistakes.length > 0 && (
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-5 w-5 text-danger" />
            <h2 className="font-semibold text-foreground">Repeated Mistakes This Week</h2>
          </div>
          {report.topMistakes.map((m) => (
            <div
              key={m.wrong}
              className="flex justify-between border-b border-surface-border py-2 last:border-0 dark:border-gray-800"
            >
              <span className="text-sm">
                <span className="text-danger line-through">{m.wrong}</span>
                {" → "}
                <span className="text-success">{m.correct}</span>
              </span>
              <Badge variant="warning">{m.count}x</Badge>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
  icon?: typeof Flame;
}) {
  return (
    <Card className={highlight ? "border-primary/30 bg-primary/5 text-center" : "text-center"}>
      {Icon && (
        <Icon className={`mx-auto mb-1 h-4 w-4 ${highlight ? "text-primary" : "text-muted"}`} />
      )}
      <p className="text-sm text-muted">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </Card>
  );
}
