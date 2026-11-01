"use client";

import type { VoiceLibrarySource, VoiceRecordingCategory } from "@speak-coach/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export const VOICE_CATEGORY_META: Record<
  VoiceRecordingCategory,
  { label: string; description: string; color: string }
> = {
  general: { label: "General", description: "Other recordings", color: "bg-slate-500/15 text-slate-600" },
  live_speak: { label: "Live Speaking", description: "Real-time practice", color: "bg-rose-500/15 text-rose-600" },
  challenge: { label: "60s Challenge", description: "Quick fluency bursts", color: "bg-orange-500/15 text-orange-600" },
  practice: { label: "Voice Practice", description: "Standalone voice drills", color: "bg-blue-500/15 text-blue-600" },
  session: { label: "Daily Session", description: "From your 10-step session", color: "bg-primary/15 text-primary" },
  shadowing: { label: "Shadowing", description: "Listen & repeat attempts", color: "bg-violet-500/15 text-violet-600" },
  paragraph_read: { label: "Read Aloud", description: "Paragraph reading lab", color: "bg-emerald-500/15 text-emerald-600" },
  roleplay: { label: "Roleplay", description: "Scenario conversations", color: "bg-fuchsia-500/15 text-fuchsia-600" },
};

export const VOICE_CATEGORY_FILTERS: { id: VoiceRecordingCategory | "all"; label: string }[] = [
  { id: "all", label: "All recordings" },
  { id: "live_speak", label: "Live Speaking" },
  { id: "challenge", label: "Challenge" },
  { id: "practice", label: "Practice" },
  { id: "shadowing", label: "Shadowing" },
  { id: "paragraph_read", label: "Read Aloud" },
  { id: "session", label: "Session" },
  { id: "roleplay", label: "Roleplay" },
  { id: "general", label: "General" },
];

export async function downloadVoiceAudio(
  id: string,
  source: VoiceLibrarySource,
  category: VoiceRecordingCategory,
  createdAt: string
): Promise<void> {
  const res = await fetch(`${API_URL}/api/voice/${id}/audio?source=${source}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Download failed");

  const blob = await res.blob();
  const ext = res.headers.get("content-type")?.includes("wav") ? "wav" : "webm";
  const date = createdAt.slice(0, 10);
  const filename = `speak-coach-${category}-${date}-${id.slice(0, 8)}.${ext}`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function downloadCategoryRecordings(
  recordings: Array<{
    id: string;
    source: VoiceLibrarySource;
    category: VoiceRecordingCategory;
    createdAt: string;
    canDownload: boolean;
  }>
): Promise<number> {
  const downloadable = recordings.filter((r) => r.canDownload);
  for (const rec of downloadable) {
    await downloadVoiceAudio(rec.id, rec.source, rec.category, rec.createdAt);
    await new Promise((r) => setTimeout(r, 400));
  }
  return downloadable.length;
}
