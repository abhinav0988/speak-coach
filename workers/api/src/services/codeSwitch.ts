const ENGLISH_WORD = /^[a-zA-Z]+$/;
const HINDI_ROMAN = /^(main|mujhe|tum|aap|hai|hoon|hain|nahi|kya|kaise|kahan|kyun|aur|lekin|bahut|accha|theek|subah|shaam|ghar|kaam|madad|pahunch|gaya|gaye|raha|rahe|rahi|kar|karo|karna|bolo|bolna|seekh|practice|roz|aaj|kal|din|raat|paani|khana|dost|parivaar)$/i;

export interface CodeSwitchAnalysis {
  englishRatio: number;
  hindiRatio: number;
  mixedScore: number;
  wordCount: number;
  englishWords: string[];
  hindiWords: string[];
  mixedWords: string[];
  tip: string;
}

export function analyzeCodeSwitch(text: string): CodeSwitchAnalysis {
  const words = text
    .trim()
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z\u0900-\u097F]/g, ""))
    .filter(Boolean);

  if (words.length === 0) {
    return {
      englishRatio: 0,
      hindiRatio: 0,
      mixedScore: 0,
      wordCount: 0,
      englishWords: [],
      hindiWords: [],
      mixedWords: [],
      tip: "Type or speak something to analyze.",
    };
  }

  const englishWords: string[] = [];
  const hindiWords: string[] = [];
  const mixedWords: string[] = [];

  for (const word of words) {
    if (/[\u0900-\u097F]/.test(word)) {
      hindiWords.push(word);
    } else if (ENGLISH_WORD.test(word)) {
      if (HINDI_ROMAN.test(word)) hindiWords.push(word);
      else englishWords.push(word);
    } else {
      mixedWords.push(word);
    }
  }

  const englishRatio = englishWords.length / words.length;
  const hindiRatio = hindiWords.length / words.length;
  const mixedScore = Math.min(1, englishRatio * hindiRatio * 4 + mixedWords.length / words.length);

  let tip = "Good balance — keep practicing both languages.";
  if (mixedScore > 0.45) {
    tip = "High code-switching detected. Try full English or full Hindi sentences for clarity.";
  } else if (englishRatio > 0.85) {
    tip = "Mostly English. Try adding Hindi sentences to build bilingual fluency.";
  } else if (hindiRatio > 0.85) {
    tip = "Mostly Hindi. Try English sentences to balance your practice.";
  }

  return {
    englishRatio: Math.round(englishRatio * 100) / 100,
    hindiRatio: Math.round(hindiRatio * 100) / 100,
    mixedScore: Math.round(mixedScore * 100) / 100,
    wordCount: words.length,
    englishWords: englishWords.slice(0, 10),
    hindiWords: hindiWords.slice(0, 10),
    mixedWords: mixedWords.slice(0, 5),
    tip,
  };
}
