"use client";

import { useCallback, useEffect, useState } from "react";
import { ALL_FEATURES, type NavItem } from "@/lib/navigation";
import { DEFAULT_PINNED_HREFS, findFeature, itemKey } from "@/lib/command-palette";

const RECENT_KEY = "speak-cmd-recent";
const FREQ_KEY = "speak-cmd-freq";
const PINNED_KEY = "speak-cmd-pinned";

type FreqMap = Record<string, number>;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function resolveItems(keys: string[]): NavItem[] {
  const seen = new Set<string>();
  const out: NavItem[] = [];
  for (const key of keys) {
    const [href, label] = key.split("::");
    const item = ALL_FEATURES.find((f) => itemKey(f) === key) ?? findFeature(href, label || undefined);
    if (item && !seen.has(itemKey(item))) {
      seen.add(itemKey(item));
      out.push(item);
    }
  }
  return out;
}

export function useCommandPaletteStorage() {
  const [recentKeys, setRecentKeys] = useState<string[]>([]);
  const [freqMap, setFreqMap] = useState<FreqMap>({});
  const [pinnedKeys, setPinnedKeys] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const recent = readJson<string[]>(RECENT_KEY, []);
    const freq = readJson<FreqMap>(FREQ_KEY, {});
    let pinned = readJson<string[]>(PINNED_KEY, []);
    if (pinned.length === 0) {
      pinned = DEFAULT_PINNED_HREFS.map((href) => {
        const f = findFeature(href);
        return f ? itemKey(f) : `${href}::`;
      }).filter(Boolean);
    }
    setRecentKeys(recent);
    setFreqMap(freq);
    setPinnedKeys(pinned);
    setHydrated(true);
  }, []);

  const recordVisit = useCallback((item: NavItem) => {
    const key = itemKey(item);
    setRecentKeys((prev) => {
      const next = [key, ...prev.filter((k) => k !== key)].slice(0, 8);
      writeJson(RECENT_KEY, next);
      return next;
    });
    setFreqMap((prev) => {
      const next = { ...prev, [key]: (prev[key] ?? 0) + 1 };
      writeJson(FREQ_KEY, next);
      return next;
    });
  }, []);

  const togglePin = useCallback((item: NavItem) => {
    const key = itemKey(item);
    setPinnedKeys((prev) => {
      const next = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      writeJson(PINNED_KEY, next);
      return next;
    });
  }, []);

  const recent = hydrated ? resolveItems(recentKeys) : [];
  const pinned = hydrated ? resolveItems(pinnedKeys) : [];
  const frequent = hydrated
    ? resolveItems(
        Object.entries(freqMap)
          .sort((a, b) => b[1] - a[1])
          .map(([k]) => k)
          .slice(0, 6)
      )
    : [];

  return { recent, pinned, frequent, recordVisit, togglePin, pinnedKeys, freqMap, hydrated };
}
