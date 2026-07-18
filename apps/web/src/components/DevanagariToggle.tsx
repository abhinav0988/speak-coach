"use client";

interface DevanagariToggleProps {
  enabled: boolean;
  onChange: (value: boolean) => void;
}

export function DevanagariToggle({ enabled, onChange }: DevanagariToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
        enabled ? "bg-orange-100 text-orange-800" : "bg-slate-100 text-slate-600"
      }`}
    >
      {enabled ? "🇮🇳 Devanagari" : "🔤 Roman"}
    </button>
  );
}

interface HindiTextProps {
  roman: string;
  devanagari?: string;
  showDevanagari: boolean;
  className?: string;
}

export function HindiText({ roman, devanagari, showDevanagari, className }: HindiTextProps) {
  const text = showDevanagari && devanagari ? devanagari : roman;
  return <span className={className}>{text}</span>;
}
