"use client";

import { Suspense } from "react";
import { ProgressIntelligence } from "@/components/progress/ProgressIntelligence";
import { useProgressData } from "@/hooks/useProgressData";
import { ConnectionError } from "@/components/ui/ConnectionError";
import { Skeleton } from "@/components/ui/primitives";

function ProgressSkeleton() {
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

function ProgressPageContent() {
  const { data, loading, error, refresh } = useProgressData();

  if (loading) return <ProgressSkeleton />;
  if (error || !data) return <ConnectionError title="Progress couldn't load" onRetry={refresh} />;

  return <ProgressIntelligence data={data} />;
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<ProgressSkeleton />}>
      <ProgressPageContent />
    </Suspense>
  );
}
