"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { PremiumPracticeHub } from "@/components/practice-hub/PremiumPracticeHub";
import { ConnectionError } from "@/components/ui/ConnectionError";
import { Skeleton } from "@/components/ui/primitives";

function PracticeHubSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-48 rounded-[32px]" />
      <Skeleton className="h-14 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-[24px]" />
        ))}
      </div>
    </div>
  );
}

export function PracticeHubView() {
  const { data, loading, error, refresh } = useDashboardData();

  if (loading) return <PracticeHubSkeleton />;

  if (error || !data) {
    return <ConnectionError title="Practice hub couldn't load" onRetry={refresh} />;
  }

  const { dashboard, analytics, insights, leaderboard } = data;

  return (
    <PremiumPracticeHub
      dashboard={dashboard}
      analytics={analytics}
      insights={insights}
      leaderboard={leaderboard}
    />
  );
}
