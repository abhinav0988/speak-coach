import { Suspense } from "react";
import { RewardsHub } from "@/components/luxury-dashboard/RewardsHub";
import { Skeleton } from "@/components/ui/primitives";

export default function RewardsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-14 rounded-2xl" />
          <Skeleton className="h-64 rounded-[28px]" />
        </div>
      }
    >
      <RewardsHub />
    </Suspense>
  );
}
