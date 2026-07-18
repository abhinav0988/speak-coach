export function isLocalDev(): boolean {
  if (typeof window === "undefined") return process.env.NODE_ENV === "development";
  return (
    process.env.NODE_ENV === "development" ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

export const AUTH_QUOTES = [
  "Every conversation is a step toward fluency.",
  "Confidence grows one sentence at a time.",
  "Your voice is your superpower — practice it daily.",
  "Small sessions, big breakthroughs.",
] as const;

export function getAuthQuote(): string {
  const day = new Date().getDate();
  return AUTH_QUOTES[day % AUTH_QUOTES.length];
}
