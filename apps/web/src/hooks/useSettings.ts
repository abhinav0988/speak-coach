"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useSettings() {
  const [devanagariPreferred, setDevanagariPreferred] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api
      .getSettings()
      .then((res) => {
        setDevanagariPreferred(!!res.settings.devanagari_preferred);
        setReminderEnabled(!!res.settings.reminder_enabled);
        setReminderTime(res.settings.reminder_time ?? "09:00");
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const toggleDevanagari = async (value: boolean) => {
    setDevanagariPreferred(value);
    await api.updateSettings({ devanagariPreferred: value });
  };

  return {
    loaded,
    devanagariPreferred,
    reminderEnabled,
    reminderTime,
    toggleDevanagari,
    setReminderEnabled,
    setReminderTime,
  };
}
