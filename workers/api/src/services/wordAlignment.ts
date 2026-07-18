import type { WordAlignment } from "@speak-coach/shared";

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(text: string): string[] {
  return normalizeText(text).split(" ").filter(Boolean);
}

export function alignWords(source: string, spoken: string): WordAlignment[] {
  const src = tokenize(source);
  const spk = tokenize(spoken);
  const alignment: WordAlignment[] = [];

  const m = src.length;
  const n = spk.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) dp[i][0] = i;
  for (let j = 1; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = src[i - 1] === spk[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }

  let i = m;
  let j = n;
  const ops: Array<{ type: string; srcWord?: string; spkWord?: string }> = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && (src[i - 1] === spk[j - 1] || dp[i][j] === dp[i - 1][j - 1] + 1)) {
      if (src[i - 1] === spk[j - 1]) {
        ops.push({ type: "match", srcWord: src[i - 1], spkWord: spk[j - 1] });
      } else {
        ops.push({ type: "substitute", srcWord: src[i - 1], spkWord: spk[j - 1] });
      }
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] <= dp[i - 1][j])) {
      ops.push({ type: "insert", spkWord: spk[j - 1] });
      j--;
    } else {
      ops.push({ type: "delete", srcWord: src[i - 1] });
      i--;
    }
  }

  ops.reverse();

  for (const op of ops) {
    if (op.type === "match") {
      alignment.push({ word: op.srcWord!, status: "correct", spoken: op.spkWord });
    } else if (op.type === "substitute") {
      alignment.push({ word: op.srcWord!, status: "wrong", spoken: op.spkWord });
    } else if (op.type === "delete") {
      alignment.push({ word: op.srcWord!, status: "skipped" });
    } else if (op.type === "insert") {
      alignment.push({ word: op.spkWord!, status: "extra", spoken: op.spkWord });
    }
  }

  return alignment;
}

export function countFillerWords(text: string): number {
  const fillers = /\b(um|uh|uhh|erm|like|actually|matlab|toh|bas|yaani)\b/gi;
  return (text.match(fillers) ?? []).length;
}

export function computeReadingStats(alignment: WordAlignment[]) {
  const correct = alignment.filter((a) => a.status === "correct").length;
  const wrong = alignment.filter((a) => a.status === "wrong").length;
  const skipped = alignment.filter((a) => a.status === "skipped").length;
  const extra = alignment.filter((a) => a.status === "extra").length;
  const total = alignment.filter((a) => a.status !== "extra").length;
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  return { correct, wrong, skipped, extra, total, accuracy };
}
