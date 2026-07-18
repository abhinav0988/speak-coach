import { Suspense } from "react";
import { PracticeHubView } from "@/components/dashboard/PracticeHubView";
import { Skeleton } from "@/components/ui/primitives";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-64" />
        </div>
      }
    >
      <PracticeHubView />
    </Suspense>
  );
}
