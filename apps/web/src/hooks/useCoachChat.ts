"use client";

import { useCallback, useState } from "react";
import { api, getCsrf } from "@/lib/api";
import type { CoachMessage } from "@speak-coach/shared";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

function csrfHeaders(): Record<string, string> {
  const csrf = getCsrf();
  return csrf ? { "X-CSRF-Token": csrf } : {};
}

type StreamPayload = {
  type?: string;
  token?: string;
  done?: boolean;
  sessionId?: string;
  messages?: CoachMessage[];
  message?: string;
};

export function useCoachChat() {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [streamMode, setStreamMode] = useState(true);
  const [wsMode, setWsMode] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const applyCoachPayload = useCallback((data: StreamPayload, full: string) => {
    if (data.sessionId) setSessionId(data.sessionId);
    if (data.messages) setMessages(data.messages);
    else if (data.done || data.type === "done") {
      const reply = full.trim();
      if (reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: reply, timestamp: new Date().toISOString() },
        ]);
      }
    }
  }, []);

  const sendStream = useCallback(
    async (msg: string, priorMessages: CoachMessage[]) => {
      setStreamingText("");
      const res = await fetch(`${API_URL}/api/coach/stream`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        body: JSON.stringify({ message: msg, messages: priorMessages, sessionId }),
      });
      if (!res.ok) throw new Error("Stream failed");
      if (!res.body) {
        const data = (await res.json()) as StreamPayload & { full?: string };
        if (data.messages) setMessages(data.messages);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6)) as StreamPayload & { full?: string };
            if (data.token) {
              full += data.token;
              setStreamingText(full);
            }
            if (data.done) {
              if (data.full) full = data.full;
              applyCoachPayload(data, full);
            }
          } catch {
            /* skip */
          }
        }
      }
      setStreamingText("");
    },
    [sessionId, applyCoachPayload]
  );

  const sendWebSocket = useCallback(
    async (msg: string, priorMessages: CoachMessage[]) => {
      const params = new URLSearchParams();
      if (sessionId) params.set("sessionId", sessionId);
      const { token } = await api.wsToken();
      params.set("ws_token", token);
      const qs = params.toString();
      // When API_URL is empty the API is same-origin (proxied via Pages Functions),
      // so build the WebSocket URL from the current page origin.
      const wsBase = API_URL
        ? API_URL.replace(/^http/, "ws")
        : `${window.location.origin.replace(/^http/, "ws")}`;
      const wsUrl = `${wsBase}/api/coach/ws${qs ? `?${qs}` : ""}`;

      return new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        let full = "";
        let settled = false;
        const finish = (fn: () => void) => {
          if (settled) return;
          settled = true;
          fn();
        };
        const timeout = window.setTimeout(() => {
          ws.close();
          finish(() => reject(new Error("WebSocket timed out")));
        }, 60_000);
        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "user_message", message: msg, messages: priorMessages, sessionId }));
        };
        ws.onmessage = (ev) => {
          try {
            const data = JSON.parse(ev.data as string) as StreamPayload;
            if (data.type === "error") {
              clearTimeout(timeout);
              ws.close();
              finish(() => reject(new Error(data.message ?? "Coach error")));
              return;
            }
            if (data.type === "ready") return;
            if (data.type === "token" && data.token) {
              full += data.token;
              setStreamingText(full);
            }
            if (data.type === "done" || data.done) {
              clearTimeout(timeout);
              applyCoachPayload(data, full);
              ws.close();
              finish(() => resolve());
            }
          } catch {
            clearTimeout(timeout);
            ws.close();
            finish(() => reject(new Error("WS parse error")));
          }
        };
        ws.onerror = () => {
          clearTimeout(timeout);
          finish(() => reject(new Error("WebSocket connection failed")));
        };
        ws.onclose = (ev) => {
          clearTimeout(timeout);
          if (!settled) {
            finish(() => reject(new Error(ev.code === 1006 ? "WebSocket rejected" : `Closed (${ev.code})`)));
          }
        };
      });
    },
    [sessionId, applyCoachPayload]
  );

  const send = useCallback(
    async (text: string) => {
      const msg = text.trim();
      if (!msg || loading) return;
      setLoading(true);
      const userMsg: CoachMessage = { role: "user", content: msg, timestamp: new Date().toISOString() };
      const priorMessages = [...messages, userMsg];
      setMessages(priorMessages);
      try {
        if (wsMode) await sendWebSocket(msg, messages);
        else if (streamMode) await sendStream(msg, messages);
        else {
          const res = await api.coachChat(msg, sessionId ?? undefined);
          setSessionId(res.sessionId);
          setMessages(res.messages);
        }
      } catch (err) {
        const detail = err instanceof Error ? err.message : "Connection failed";
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Sorry, I could not connect (${detail}). Try Stream mode, or ensure the API is on port 8787.`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
        setStreamingText("");
      }
    },
    [loading, messages, wsMode, streamMode, sessionId, sendWebSocket, sendStream]
  );

  const newChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setStreamingText("");
  }, []);

  const regenerate = useCallback(async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setMessages((prev) => {
      const idx = prev.findLastIndex((m) => m.role === "assistant");
      return idx >= 0 ? prev.slice(0, idx) : prev.slice(0, -1);
    });
    await send(lastUser.content);
  }, [messages, send]);

  return {
    messages,
    sessionId,
    loading,
    streamingText,
    streamMode,
    setStreamMode,
    wsMode,
    setWsMode,
    send,
    newChat,
    regenerate,
  };
}
