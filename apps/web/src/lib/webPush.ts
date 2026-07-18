"use client";

import { api } from "./api";

export async function registerWebPush() {
  try {
    const { publicKey } = await api.getVapidPublicKey();
    if (!publicKey || !("serviceWorker" in navigator)) return;

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      const key = Uint8Array.from(atob(publicKey.replace(/-/g, "+").replace(/_/g, "/")), (c) =>
        c.charCodeAt(0)
      );
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key,
      });
    }
    await api.registerWebPush(sub.toJSON());
  } catch {
    // VAPID not configured or push unsupported
  }
}
