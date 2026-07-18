import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  badge,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div>
        {badge && (
          <span className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {badge}
          </span>
        )}
        <h1 className="text-section text-foreground md:text-section-md xl:text-section-xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted md:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageBack({ href, label }: { href: string; label?: string }) {
  return (
    <Link href={href} className="mb-4 inline-flex text-sm font-medium text-muted hover:text-primary">
      ← {label ?? "Back"}
    </Link>
  );
}
