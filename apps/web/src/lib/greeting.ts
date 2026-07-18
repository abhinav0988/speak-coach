export type DayPeriod = "morning" | "afternoon" | "evening" | "night";

export function getDayPeriod(date = new Date()): DayPeriod {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

export function getTimeGreeting(period: DayPeriod): string {
  switch (period) {
    case "morning":
      return "Good morning";
    case "afternoon":
      return "Good afternoon";
    case "evening":
      return "Good evening";
    case "night":
      return "Good night";
  }
}

export function getPracticeNudge(period: DayPeriod, practicedToday: boolean): string {
  if (practicedToday) {
    return "You're on a roll today — bonus practice sharpens your edge.";
  }
  switch (period) {
    case "morning":
      return "Fresh start — a quick speaking warm-up sets the tone for your day.";
    case "afternoon":
      return "Perfect time for a focused session. Your brain is wide awake.";
    case "evening":
      return "Wind down with speaking practice — build the habit before bed.";
    case "night":
      return "A short night review keeps yesterday's learning fresh.";
  }
}

export function getRecommendedModuleId(period: DayPeriod): string {
  switch (period) {
    case "morning":
      return "vocabulary";
    case "afternoon":
      return "live";
    case "evening":
      return "shadow";
    case "night":
      return "coach";
  }
}

export function formatLiveClock(date = new Date()): string {
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
