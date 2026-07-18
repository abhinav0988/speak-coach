"use client";

import { useEffect } from "react";

const CHECK_MS = 60_000;

export function DailyReminder() {
  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    let timer: ReturnType<typeof setInterval>;
    let cancelled = false;

    const check = async () => {
      if (cancelled) return;
      try {
        const { api } = await import("@/lib/api");
        const { settings } = await api.getSettings();
        if (!settings.reminder_enabled) return;

        const [h, m] = (settings.reminder_time ?? "09:00").split(":").map(Number);
        const now = new Date();
        if (now.getHours() !== h || now.getMinutes() !== m) return;

        const key = `reminder-sent-${now.toISOString().slice(0, 10)}`;
        if (localStorage.getItem(key)) return;

        if (Notification.permission === "granted") {
          new Notification("Speak Coach — Time to practice!", {
            body: "Your daily speaking session is waiting. Even 10 minutes helps!",
            icon: "/manifest.json",
          });
          localStorage.setItem(key, "1");
        }
      } catch {
        // API offline
      }
    };

    timer = setInterval(check, CHECK_MS);
    void check();

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return null;
}
