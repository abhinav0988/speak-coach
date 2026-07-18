import type { VoiceLibrarySource, VoiceRecordingCategory, VoiceRecordingSummary } from "@speak-coach/shared";

type TimelineRow = VoiceRecordingSummary & { sortKey: string };

function normalizeCategory(raw: string | null | undefined): VoiceRecordingCategory {
  const c = (raw ?? "general") as VoiceRecordingCategory;
  const valid: VoiceRecordingCategory[] = [
    "general", "live_speak", "challenge", "practice", "session",
    "shadowing", "paragraph_read", "roleplay",
  ];
  return valid.includes(c) ? c : "general";
}

function parseWaveform(analyticsJson: string | null | undefined): number[] | undefined {
  if (!analyticsJson) return undefined;
  try {
    const a = JSON.parse(analyticsJson);
    if (Array.isArray(a?.waveformSamples)) {
      return a.waveformSamples.slice(0, 160).map((n: unknown) => Number(n) || 0);
    }
  } catch {
    /* ignore */
  }
  return undefined;
}

export async function buildUnifiedTimeline(db: D1Database) {
  const [voiceRows, shadowRows, paragraphRows] = await Promise.all([
    db.prepare(
      `SELECT id, duration_sec, transcript, language, loudness_score, clarity_score, pace_wpm,
              filler_count, analytics_json, category, created_at
       FROM voice_recordings ORDER BY created_at ASC`
    ).all(),
    db.prepare(
      `SELECT id, reference_text, transcript, overall_score, clarity_score, word_accuracy_pct,
              pace_match_pct, analytics_json, created_at
       FROM shadowing_attempts ORDER BY created_at ASC`
    ).all(),
    db.prepare(
      `SELECT id, source_text, transcript, pronunciation_accuracy_pct, loudness_score, clarity_score,
              words_per_minute, filler_word_count, voice_analytics_json, created_at
       FROM paragraph_reads ORDER BY created_at ASC`
    ).all(),
  ]);

  const items: TimelineRow[] = [];

  for (const r of voiceRows.results ?? []) {
    const analytics = (() => {
      try {
        return r.analytics_json ? JSON.parse(String(r.analytics_json)) : null;
      } catch {
        return null;
      }
    })();
    items.push({
      id: String(r.id),
      source: "voice",
      durationSec: Number(r.duration_sec ?? 0),
      transcript: String(r.transcript ?? ""),
      language: String(r.language ?? "mixed"),
      loudnessScore: Math.round(Number(r.loudness_score ?? 0)),
      clarityScore: Math.round(Number(r.clarity_score ?? 0)),
      paceWpm: Math.round(Number(r.pace_wpm ?? 0)),
      fillerCount: Number(r.filler_count ?? 0),
      category: normalizeCategory(String(r.category ?? "general")),
      waveformSamples: Array.isArray(analytics?.waveformSamples)
        ? analytics.waveformSamples.slice(0, 160).map((n: unknown) => Number(n) || 0)
        : undefined,
      label: undefined,
      createdAt: String(r.created_at),
      sortKey: String(r.created_at),
    });
  }

  for (const r of shadowRows.results ?? []) {
    const score = Math.round(Number(r.overall_score ?? r.clarity_score ?? 0));
    items.push({
      id: String(r.id),
      source: "shadowing",
      durationSec: 0,
      transcript: String(r.transcript ?? r.reference_text ?? ""),
      language: "english",
      loudnessScore: score,
      clarityScore: Math.round(Number(r.clarity_score ?? score)),
      paceWpm: Math.round(Number(r.pace_match_pct ?? 0)),
      fillerCount: 0,
      category: "shadowing",
      waveformSamples: parseWaveform(r.analytics_json ? String(r.analytics_json) : null),
      label: String(r.reference_text ?? "").slice(0, 60),
      createdAt: String(r.created_at),
      sortKey: String(r.created_at),
    });
  }

  for (const r of paragraphRows.results ?? []) {
    items.push({
      id: String(r.id),
      source: "paragraph",
      durationSec: 0,
      transcript: String(r.transcript ?? r.source_text ?? ""),
      language: "roman_hindi",
      loudnessScore: Math.round(Number(r.loudness_score ?? 0)),
      clarityScore: Math.round(Number(r.clarity_score ?? 0)),
      paceWpm: Math.round(Number(r.words_per_minute ?? 0)),
      fillerCount: Number(r.filler_word_count ?? 0),
      category: "paragraph_read",
      waveformSamples: parseWaveform(r.voice_analytics_json ? String(r.voice_analytics_json) : null),
      label: String(r.source_text ?? "").slice(0, 60),
      createdAt: String(r.created_at),
      sortKey: String(r.created_at),
    });
  }

  items.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const scored = items.filter((i) => i.loudnessScore > 0 || i.clarityScore > 0);
  const first = scored[0] ?? items[0] ?? null;
  const latest = scored.length > 0 ? scored[scored.length - 1] : items[items.length - 1] ?? null;

  const strip = (r: TimelineRow | null): VoiceRecordingSummary | null => {
    if (!r) return null;
    const { sortKey: _, ...rest } = r;
    return rest;
  };

  const dayMap = new Map<string, { count: number; loudness: number[]; clarity: number[] }>();
  for (const item of items) {
    const date = item.createdAt.slice(0, 10);
    const entry = dayMap.get(date) ?? { count: 0, loudness: [], clarity: [] };
    entry.count += 1;
    if (item.loudnessScore > 0) entry.loudness.push(item.loudnessScore);
    if (item.clarityScore > 0) entry.clarity.push(item.clarityScore);
    dayMap.set(date, entry);
  }

  const trendByDay = [...dayMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([date, d]) => ({
      date,
      count: d.count,
      avgLoudness: d.loudness.length
        ? Math.round(d.loudness.reduce((a, b) => a + b, 0) / d.loudness.length)
        : 0,
      avgClarity: d.clarity.length
        ? Math.round(d.clarity.reduce((a, b) => a + b, 0) / d.clarity.length)
        : 0,
    }));

  const byCategory = items.reduce<Record<string, number>>((acc, i) => {
    const key = i.category ?? "general";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return {
    total: items.length,
    first: strip(first),
    latest: strip(latest),
    delta:
      first && latest && first.id !== latest.id
        ? {
            loudness: latest.loudnessScore - first.loudnessScore,
            clarity: latest.clarityScore - first.clarityScore,
            pace: latest.paceWpm - first.paceWpm,
            fillers: latest.fillerCount - first.fillerCount,
          }
        : null,
    recordings: items.slice(-20).map((r) => {
      const { sortKey: _, ...rest } = r;
      return rest;
    }),
    trendByDay,
    byCategory,
  };
}
