"use client";

import { useDashboardData } from "@/hooks/useDashboardData";
import { LuxuryDashboard } from "@/components/luxury-dashboard";
import { ConnectionError } from "@/components/ui/ConnectionError";
import { Skeleton } from "@/components/ui/primitives";

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-56 rounded-[28px]" />
      <Skeleton className="h-40 rounded-[24px]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-[24px]" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-[24px]" />
    </div>
  );
}

export function DashboardView() {
  const { data, loading, error, refresh, useFreeze } = useDashboardData();

  if (loading) return <DashboardSkeleton />;

  if (error || !data) {
    return <ConnectionError title="Dashboard couldn't load" onRetry={refresh} />;
  }

  return <LuxuryDashboard data={data} onUseFreeze={useFreeze} />;
}
