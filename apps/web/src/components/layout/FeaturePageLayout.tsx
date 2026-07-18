import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Standard layout for legacy feature pages (settings, correct, vocabulary, etc.)
 */
export function FeaturePageLayout({
  children,
  className,
  width = "narrow",
}: {
  children: ReactNode;
  className?: string;
  width?: "narrow" | "default" | "wide";
}) {
  const maxW =
    width === "narrow" ? "max-w-narrow" : width === "wide" ? "max-w-wide" : "max-w-content";
  return (
    <div className={cn("mx-auto w-full min-w-0 space-y-6 md:space-y-8", maxW, className)}>
      {children}
    </div>
  );
}
