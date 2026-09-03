// src/services/websocket.ts
import { Client, IMessage, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";

type MessageCallback = (msg: any) => void;

class WebSocketService {
  private client: Client | null = null;
  // roomId → { subscription, callbacks[] }
  private subscriptions = new Map<
    number,
    { sub: StompSubscription; callbacks: Set<MessageCallback> }
  >();
  // callbacks chờ connect xong
  private pendingSubscriptions = new Map<number, Set<MessageCallback>>();

  // ── Khởi tạo 1 STOMP connection duy nhất ─────────────────────────────────
  init() {
    if (this.client) return; // đã init

    const token = localStorage.getItem("token");
    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      debug: () => {}, // tắt log spam

      onConnect: () => {
        console.log("[WS] Connected");
        // Thực hiện các subscription đang pending
        this.pendingSubscriptions.forEach((callbacks, roomId) => {
          this._doSubscribe(roomId, callbacks);
        });
        this.pendingSubscriptions.clear();
      },

      onDisconnect: () => {
        console.log("[WS] Disconnected");
        this.subscriptions.clear();
      },

      onStompError: (frame) => {
        console.error("[WS] STOMP error", frame);
      },
    });

    this.client.activate();
  }

  // ── Subscribe một room, gắn callback ─────────────────────────────────────
  subscribe(roomId: number, callback: MessageCallback) {
    // Nếu đã subscribe room này, chỉ thêm callback mới
    const existing = this.subscriptions.get(roomId);
    if (existing) {
      existing.callbacks.add(callback);
      return;
    }

    const callbacks = new Set<MessageCallback>([callback]);

    if (this.client?.connected) {
      this._doSubscribe(roomId, callbacks);
    } else {
      // STOMP chưa connect xong → đưa vào hàng chờ
      const pending = this.pendingSubscriptions.get(roomId) ?? new Set();
      pending.add(callback);
      this.pendingSubscriptions.set(roomId, pending);
    }
  }

  private _doSubscribe(roomId: number, callbacks: Set<MessageCallback>) {
    const sub = this.client!.subscribe(
      `/topic/room/${roomId}`,
      (frame: IMessage) => {
        const data = JSON.parse(frame.body);
        callbacks.forEach((cb) => cb(data));
      }
    );
    this.subscriptions.set(roomId, { sub, callbacks });
  }

  // ── Unsubscribe callback cụ thể khỏi một room ────────────────────────────
  unsubscribe(roomId: number, callback: MessageCallback) {
    const entry = this.subscriptions.get(roomId);
    if (!entry) return;

    entry.callbacks.delete(callback);

    // Nếu không còn ai lắng nghe → hủy subscription hẳn
    if (entry.callbacks.size === 0) {
      entry.sub.unsubscribe();
      this.subscriptions.delete(roomId);
    }
  }

  // ── Gửi tin nhắn ─────────────────────────────────────────────────────────
  sendMessage(roomId: number, content: string, type = "TEXT") {
    if (this.client?.connected) {
      this.client.publish({
        destination: `/app/chat.send/${roomId}`,
        body: JSON.stringify({ content, type }),
      });
    } else {
      console.warn("[WS] Not connected — cannot send");
    }
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  // ── Đóng hoàn toàn (ví dụ khi logout) ────────────────────────────────────
  destroy() {
    this.client?.deactivate();
    this.client = null;
    this.subscriptions.clear();
    this.pendingSubscriptions.clear();
  }
}

export default new WebSocketService();