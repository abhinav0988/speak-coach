"use client";

import { Bot, MessageSquare, Trophy } from "lucide-react";
import { MotionSection } from "@/components/ui/motion";
import { Card, SectionHeader } from "@/components/ui/primitives";

interface ActivityItem {
  id: string;
  type: "session" | "feedback" | "ai";
  title: string;
  subtitle: string;
  time: string;
}

export function RecentActivity({
  recentScores,
  insights = [],
}: {
  recentScores: { date: string; pronunciation: number; spokenEn: number }[];
  insights?: string[];
}) {
  const activities: ActivityItem[] = [];

  recentScores.slice(0, 4).forEach((score, i) => {
    activities.push({
      id: `score-${i}`,
      type: "session",
      title: "Practice session completed",
      subtitle: `Pronunciation ${score.pronunciation}% · English ${score.spokenEn}%`,
      time: formatRelative(score.date),
    });
  });

  insights.slice(0, 2).forEach((insight, i) => {
    activities.push({
      id: `insight-${i}`,
      type: "ai",
      title: "AI insight",
      subtitle: insight,
      time: "Recent",
    });
  });

  const icons = {
    session: Trophy,
    feedback: MessageSquare,
    ai: Bot,
  };

  const colors = {
    session: "bg-primary/10 text-primary",
    feedback: "bg-success/10 text-success",
    ai: "bg-secondary/10 text-secondary",
  };

  return (
    <MotionSection>
      <SectionHeader title="Recent Activity" subtitle="Your learning timeline" />
      <Card className="!p-0">
        {activities.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-muted">
            Complete a session to see your activity here.
          </p>
        ) : (
          <ol className="divide-y divide-surface-border dark:divide-gray-800" role="list">
            {activities.map((item) => {
              const Icon = icons[item.type];
              return (
                <li key={item.id} className="flex items-start gap-4 px-6 py-4">
                  <div className={`rounded-xl p-2.5 ${colors[item.type]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted">{item.subtitle}</p>
                  </div>
                  <time className="shrink-0 text-xs text-muted">{item.time}</time>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </MotionSection>
  );
}

function formatRelative(dateStr: string) {
  try {
    const d = new Date(dateStr);
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  } catch {
    return dateStr;
  }
}
