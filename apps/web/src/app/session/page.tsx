import { Suspense } from "react";
import { PremiumLearnExperience } from "@/components/learn/PremiumLearnExperience";
import { Skeleton } from "@/components/ui/primitives";

export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-56 rounded-[28px]" />
          <Skeleton className="h-40 rounded-[24px]" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-[24px]" />
          ))}
        </div>
      }
    >
      <PremiumLearnExperience />
    </Suspense>
  );
}
