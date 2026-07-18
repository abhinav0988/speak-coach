"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import type { CurriculumOverview } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";

export default function CurriculumPage() {
  const [data, setData] = useState<CurriculumOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getCurriculumOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageBack href="/" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-24" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageBack href="/" />
        <Card className="text-center text-danger">Could not load curriculum.</Card>
      </div>
    );
  }

  const currentWeek = Math.floor((data.dayNumber - 1) / 7) + 1;

  return (
    <div className="space-y-8">
      <PageBack href="/" />
      <PageHeader
        title="90-Day Curriculum"
        subtitle={`Day ${data.dayNumber} of ${data.targetDays} — Week ${currentWeek} theme active`}
        badge="Journey"
      />

      <Card>
        <p className="text-sm text-muted">
          Each week has 10 Hindi sentences, 10 vocabulary words, and 1 paragraph. Content auto-loads for all 90 days.
        </p>
        <Link href="/vocabulary" className="mt-4 inline-block">
          <Button>
            Today&apos;s Words & Sentences
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </Card>

      <div className="space-y-3">
        {data.weeks.map((w) => {
          const active = w.week === currentWeek;
          return (
            <Card
              key={w.week}
              className={active ? "border-primary/40 bg-primary/5" : ""}
              hover={!active}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-muted">
                    Week {w.week} · Days {w.days}
                  </p>
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {w.theme}
                  </h2>
                  <p className="text-sm text-muted">{w.focus}</p>
                </div>
                {active && <Badge>Current</Badge>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
