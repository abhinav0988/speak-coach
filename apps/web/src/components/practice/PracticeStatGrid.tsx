import { Card } from "@/components/ui/primitives";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";

export function PracticeStatGrid({
  stats,
}: {
  stats: { label: string; value: number; suffix?: string; warn?: boolean }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="!p-4 text-center">
          <p className="text-xs text-muted">{s.label}</p>
          <p className={`mt-1 text-2xl font-bold ${s.warn ? "text-danger" : "text-foreground"}`}>
            <AnimatedNumber value={s.value} suffix={s.suffix} />
          </p>
        </Card>
      ))}
    </div>
  );
}
