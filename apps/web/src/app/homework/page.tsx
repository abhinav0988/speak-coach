"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Button, Card, Badge, Skeleton } from "@/components/ui/primitives";

export default function HomeworkPage() {
  const [items, setItems] = useState<
    Array<{
      id: string;
      dayNumber: number;
      tasks: string[];
      dueDate: string;
      completed: boolean;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .getHomework()
      .then((d) => setItems(d.homework as typeof items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const complete = async (id: string) => {
    await api.completeHomework(id);
    load();
  };

  return (
    <div className="space-y-6">
      <PageBack href="/" />
      <PageHeader title="Homework" subtitle="Tasks assigned after each session" badge="Daily" />

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center text-muted">
          No homework yet. Complete a session to get tasks!
        </Card>
      ) : (
        items.map((hw) => (
          <Card key={hw.id} className={hw.completed ? "opacity-60" : ""}>
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="font-semibold text-foreground">
                Day {hw.dayNumber} — Due {hw.dueDate}
              </span>
              {hw.completed ? (
                <Badge variant="success">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Done
                </Badge>
              ) : (
                <Button variant="primary" className="text-sm" onClick={() => complete(hw.id)}>
                  Mark Complete
                </Button>
              )}
            </div>
            <ul className="space-y-2">
              {hw.tasks.map((t, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted">
                  <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {t}
                </li>
              ))}
            </ul>
          </Card>
        ))
      )}
    </div>
  );
}
