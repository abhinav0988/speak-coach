const FILLER_PATTERN = /\b(um|uh|uhh|erm|like|actually|matlab|toh|bas|yaani)\b/gi;

export function countFillerWords(text: string): number {
  return (text.match(FILLER_PATTERN) ?? []).length;
}
