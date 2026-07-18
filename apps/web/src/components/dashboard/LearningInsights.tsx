"use client";

import { AlertCircle, ArrowUpRight, TrendingUp, Zap } from "lucide-react";
import { Card, SectionHeader } from "@/components/ui/primitives";
import { MotionSection } from "@/components/ui/motion";

interface LearningInsightsProps {
  fluencyScore: number;
  recentScores: { pronunciation: number; spokenEn: number; loudness: number }[];
  insights?: string[];
}

export function LearningInsights({ fluencyScore, recentScores, insights = [] }: LearningInsightsProps) {
  const avgPronunciation =
    recentScores.length > 0
      ? Math.round(recentScores.reduce((s, r) => s + r.pronunciation, 0) / recentScores.length)
      : 0;
  const avgEnglish =
    recentScores.length > 0
      ? Math.round(recentScores.reduce((s, r) => s + r.spokenEn, 0) / recentScores.length)
      : 0;

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (avgEnglish >= avgPronunciation) strengths.push("English sentence construction");
  else weaknesses.push("English fluency");

  if (avgPronunciation >= 60) strengths.push("Pronunciation clarity");
  else weaknesses.push("Pronunciation accuracy");

  if (fluencyScore >= 50) strengths.push("Overall speaking confidence");
  else weaknesses.push("Speaking confidence");

  const mostImproved = strengths[0] ?? "Keep practicing to unlock insights";
  const needsAttention = weaknesses[0] ?? "All skills balanced — great work!";

  const aiInsights =
    insights.length > 0
      ? insights
      : [
          `Your fluency score is ${fluencyScore}%. ${fluencyScore < 50 ? "Focus on daily sessions." : "You're above average!"}`,
          `Pronunciation averaging ${avgPronunciation}% — ${avgPronunciation < 60 ? "try Sound Gym drills." : "solid progress."}`,
        ];

  return (
    <MotionSection>
      <SectionHeader title="Learning Insights" subtitle="AI-powered analysis of your progress" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InsightCard icon={TrendingUp} title="Most Improved" value={mostImproved} variant="success" />
        <InsightCard icon={AlertCircle} title="Needs Attention" value={needsAttention} variant="warning" />
        <InsightCard icon={Zap} title="Fluency Score" value={`${fluencyScore}%`} variant="primary" />
        <InsightCard icon={ArrowUpRight} title="English Avg" value={`${avgEnglish}%`} variant="secondary" />
      </div>
      <Card className="mt-4">
        <h3 className="mb-3 text-sm font-semibold text-muted">Weekly Summary</h3>
        <ul className="space-y-2">
          {aiInsights.map((insight, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-primary">•</span>
              {insight}
            </li>
          ))}
        </ul>
      </Card>
    </MotionSection>
  );
}

function InsightCard({
  icon: Icon,
  title,
  value,
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string;
  variant: "success" | "warning" | "primary" | "secondary";
}) {
  const styles = {
    success: "border-success/20 bg-success/5 text-success",
    warning: "border-warning/20 bg-warning/5 text-warning",
    primary: "border-primary/20 bg-primary/5 text-primary",
    secondary: "border-secondary/20 bg-secondary/5 text-secondary",
  };

  return (
    <Card className={`!p-4 ${styles[variant]}`}>
      <Icon className="mb-2 h-5 w-5" />
      <p className="text-xs font-medium opacity-80">{title}</p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
    </Card>
  );
}
