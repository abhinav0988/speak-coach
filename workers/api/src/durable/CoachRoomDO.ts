import type { Env } from "../env";
import { chatWithCoach, loadCoachSession, saveCoachSession, type CoachMessage } from "../services/coach";
import { nowIso } from "../utils";

interface ClientSession {
  id: string;
}

interface UserMessagePayload {
  type: "user_message";
  message: string;
  sessionId?: string;
  messages?: CoachMessage[];
}

export class CoachRoomDO {
  private readonly state: DurableObjectState;
  private readonly env: Env;
  private readonly sockets = new Map<WebSocket, ClientSession>();

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const upgrade = request.headers.get("Upgrade");
    if (upgrade?.toLowerCase() !== "websocket") {
      return new Response("Expected WebSocket upgrade", { status: 426 });
    }

    const pair = new WebSocketPair();
    const client = pair[0];
    const server = pair[1];
    server.accept();

    const session: ClientSession = { id: crypto.randomUUID() };
    this.sockets.set(server, session);

    server.send(
      JSON.stringify({
        type: "ready",
        clientId: session.id,
      })
    );

    server.addEventListener("message", (event) => {
      void this.handleMessage(server, String(event.data));
    });

    server.addEventListener("close", () => {
      this.sockets.delete(server);
    });

    server.addEventListener("error", () => {
      this.sockets.delete(server);
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  private async handleMessage(ws: WebSocket, raw: string): Promise<void> {
    let payload: UserMessagePayload | null = null;
    try {
      payload = JSON.parse(raw) as UserMessagePayload;
    } catch {
      ws.send(JSON.stringify({ type: "error", message: "Invalid JSON payload" }));
      return;
    }

    if (!payload || payload.type !== "user_message" || !payload.message?.trim()) {
      ws.send(JSON.stringify({ type: "error", message: "Message is required" }));
      return;
    }

    try {
      const sessionId = payload.sessionId ?? "ws-coach-default";
      const prior = payload.messages ?? (await loadCoachSession(this.env.DB, sessionId));

      const now = nowIso();
      const userMsg: CoachMessage = { role: "user", content: payload.message.trim(), timestamp: now };
      const reply = await chatWithCoach(this.env.AI, prior, payload.message.trim());
      const assistantMsg: CoachMessage = { role: "assistant", content: reply, timestamp: nowIso() };
      const allMessages = [...prior, userMsg, assistantMsg];
      const savedSessionId = await saveCoachSession(this.env.DB, sessionId, allMessages);

      const words = reply.split(" ");
      for (const word of words) {
        ws.send(JSON.stringify({ type: "token", token: `${word} ` }));
      }

      ws.send(
        JSON.stringify({
          type: "done",
          full: reply,
          sessionId: savedSessionId,
          messages: allMessages,
        })
      );
    } catch (err) {
      ws.send(
        JSON.stringify({
          type: "error",
          message: err instanceof Error ? err.message : "Coach request failed",
        })
      );
    }
  }
}
