"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FEATURE_GROUPS } from "@/lib/navigation";
import { Card } from "@/components/ui/primitives";

export function ExploreAllFeatures({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <section id="explore-all" className="scroll-mt-24">
      {showHeader && (
        <div className="mb-8 text-center">
          <h2 className="text-section text-foreground">Everything in one place</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted">
            All {FEATURE_GROUPS.reduce((n, g) => n + g.items.length, 0)} features organized by what you want to do
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {FEATURE_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          return (
            <Card key={group.id} className="!p-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GroupIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{group.label}</h3>
                  <p className="text-sm text-muted">{group.description}</p>
                </div>
              </div>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href + item.label}>
                      <Link
                        href={item.href}
                        className="group flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-surface-muted"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-muted" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          {item.description && (
                            <p className="truncate text-xs text-muted">{item.description}</p>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
