import { Suspense } from "react";
import { AICoachExperience } from "@/components/ai-coach/AICoachExperience";
import { Skeleton } from "@/components/ui/primitives";

export default function CoachPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-4 p-4">
          <Skeleton className="h-14 rounded-[24px]" />
          <Skeleton className="h-48 rounded-[28px]" />
          <Skeleton className="h-64 rounded-[24px]" />
        </div>
      }
    >
      <AICoachExperience />
    </Suspense>
  );
}
