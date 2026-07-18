"use client";

import { ExploreAllFeatures } from "@/components/dashboard/ExploreAllFeatures";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ExplorePage() {
  return (
    <div>
      <PageHeader
        title="All Features"
        subtitle="Every practice mode and tool in Speak Coach"
        badge="Explore"
      />
      <ExploreAllFeatures showHeader={false} />
    </div>
  );
}
