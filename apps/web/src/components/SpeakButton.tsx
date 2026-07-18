"use client";

import { useTTS } from "@/hooks/useTTS";

interface SpeakButtonProps {
  text: string;
  lang?: "hi-IN" | "en-US" | "en-IN";
  label?: string;
  className?: string;
}

export function SpeakButton({ text, lang = "hi-IN", label = "Listen", className = "" }: SpeakButtonProps) {
  const { supported, speaking, speak } = useTTS();

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => speak(text, lang)}
      disabled={speaking}
      className={`inline-flex items-center gap-1 rounded-lg bg-orange-50 px-2 py-1 text-xs font-medium text-orange-800 hover:bg-orange-100 disabled:opacity-50 ${className}`}
      title="Listen with text-to-speech"
    >
      {speaking ? "🔊 ..." : `🔊 ${label}`}
    </button>
  );
}
