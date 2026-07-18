"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Flag, Lock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { JourneyData } from "@speak-coach/shared";
import { PageHeader, PageBack } from "@/components/layout/PageHeader";
import { Card, Skeleton } from "@/components/ui/primitives";
import { ConnectionError } from "@/components/ui/ConnectionError";
import { AnimatedProgress } from "@/components/ui/motion";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

const STATUS_STYLES = {
  completed: { bg: "bg-success", label: "Done", ring: "ring-success/30" },
  partial: { bg: "bg-warning", label: "Partial", ring: "ring-warning/30" },
  missed: { bg: "bg-danger/60", label: "Missed", ring: "ring-danger/30" },
  upcoming: { bg: "bg-surface-border dark:bg-gray-700", label: "Upcoming", ring: "" },
};

export default function JourneyPage() {
  const [data, setData] = useState<JourneyData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    return api
      .getJourney()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!data) {
    return <ConnectionError title="Journey couldn't load" onRetry={load} />;
  }

  const currentDay = data.days.find((d) => d.day === data.dayNumber);

  return (
    <div className="space-y-10">
      <PageBack href="/dashboard" label="Dashboard" />

      <div className="rounded-card gradient-hero p-6 text-white shadow-elevated sm:p-8">
        <p className="text-sm font-medium text-white/80">Your path to fluency</p>
        <h1 className="mt-1 text-hero text-white">90-Day Journey</h1>
        <p className="mt-2 text-white/85">
          Day <AnimatedNumber value={data.dayNumber} /> of {data.targetDays} ·{" "}
          <AnimatedNumber value={data.completedDays} suffix=" days completed" />
        </p>
        <div className="mt-6 max-w-lg">
          <div className="mb-2 flex justify-between text-sm text-white/80">
            <span>Overall progress</span>
            <span>{data.progressPct}%</span>
          </div>
          <AnimatedProgress value={data.progressPct} gradient />
        </div>
        {currentDay && (
          <Link
            href="/session"
            className="mt-6 inline-flex items-center gap-2 rounded-btn bg-white px-5 py-2.5 text-sm font-bold text-primary shadow-lg hover:bg-white/95"
          >
            <MapPin className="h-4 w-4" />
            Continue Day {data.dayNumber}
          </Link>
        )}
      </div>

      <section>
        <h2 className="mb-4 text-card-title">Milestones</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.milestones.map((m, i) => (
            <motion.div
              key={m.day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`text-center !p-5 ${m.reached ? "ring-1 ring-primary/30" : "opacity-60 grayscale"}`}
              >
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-2xl dark:bg-gray-800">
                  {m.completed ? (
                    <CheckCircle2 className="h-6 w-6 text-success" />
                  ) : m.reached ? (
                    <Flag className="h-6 w-6 text-primary" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted" />
                  )}
                </div>
                <p className="font-semibold">{m.label}</p>
                <p className="text-sm text-muted">Day {m.day}</p>
                <span
                  className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    m.completed
                      ? "bg-success/10 text-success"
                      : m.reached
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-muted text-muted"
                  }`}
                >
                  {m.completed ? "Complete" : m.reached ? "In progress" : "Locked"}
                </span>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <Card>
        <h2 className="mb-1 text-card-title">Full Roadmap</h2>
        <p className="mb-6 text-sm text-muted">Every day of your 90-day speaking transformation</p>
        <div className="grid grid-cols-7 gap-2 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-[repeat(15,minmax(0,1fr))]">
          {data.days.map((d) => {
            const style = STATUS_STYLES[d.status];
            const isCurrent = d.day === data.dayNumber;
            return (
              <div key={d.day} className="group text-center" title={`Day ${d.day}: ${d.status}`}>
                <div
                  className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-lg transition-transform group-hover:scale-110 sm:h-10 sm:w-10 ${
                    style.bg
                  } ${d.isMilestone ? `ring-2 ${style.ring || "ring-secondary/50"}` : ""} ${
                    isCurrent ? "ring-2 ring-white ring-offset-2 ring-offset-primary shadow-glow" : ""
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                      ★
                    </span>
                  )}
                  {d.status === "completed" ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : d.status === "upcoming" && isCurrent ? (
                    <Circle className="h-3 w-3 text-primary" />
                  ) : null}
                </div>
                <p className={`mt-1 text-[10px] sm:text-xs ${isCurrent ? "font-bold text-primary" : "text-muted"}`}>
                  {d.day}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 text-xs text-muted">
          {Object.entries(STATUS_STYLES).map(([key, val]) => (
            <span key={key} className="flex items-center gap-1.5">
              <span className={`inline-block h-3 w-3 rounded ${val.bg}`} />
              {val.label}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded ring-2 ring-secondary/50" />
            Milestone
          </span>
        </div>
      </Card>
    </div>
  );
}
