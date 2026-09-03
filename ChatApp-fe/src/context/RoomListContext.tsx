// src/context/RoomListContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import ApiService, { RoomResponse } from "../api/ApiService";
import { MessageResponse } from "../types/message";
import { useAuth } from "./AuthContext";
import websocketService from "../services/websocket";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RoomMeta {
  room: RoomResponse;
  lastMessage: MessageResponse | null;
  unreadCount: number;
}

interface RoomListContextType {
  roomMetas: RoomMeta[];
  loading: boolean;
  markRoomAsRead: (roomId: number) => void;
  refresh: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const RoomListContext = createContext<RoomListContextType | undefined>(undefined);

export const useRoomList = (): RoomListContextType => {
  const ctx = useContext(RoomListContext);
  if (!ctx) throw new Error("useRoomList must be used within RoomListProvider");
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const RoomListProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [roomMetas, setRoomMetas] = useState<RoomMeta[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch rooms + lastMessage ─────────────────────────────────────────────
  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const data = await ApiService.getRooms(0, 50);
      const rooms = data.content || [];

      const metas = await Promise.all(
        rooms.map(async (room): Promise<RoomMeta> => {
          try {
            const msgData = await ApiService.getMessages(room.id, 0, 1);
            const lastMsg = msgData.messages?.[0] ?? null;
            return { room, lastMessage: lastMsg, unreadCount: 0 };
          } catch {
            return { room, lastMessage: null, unreadCount: 0 };
          }
        })
      );

      metas.sort((a, b) => {
        const ta = a.lastMessage
          ? new Date(a.lastMessage.createdAt).getTime()
          : new Date(a.room.createdAt).getTime();
        const tb = b.lastMessage
          ? new Date(b.lastMessage.createdAt).getTime()
          : new Date(b.room.createdAt).getTime();
        return tb - ta;
      });

      setRoomMetas(metas);
      return metas; // trả về để subscribe sau
    } catch (err) {
      console.error("RoomListContext: fetchRooms failed", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ── Subscribe tất cả rooms sau khi fetch xong ────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Init STOMP connection 1 lần
    websocketService.init();

    let callbacks: Array<{ roomId: number; cb: (msg: MessageResponse) => void }> = [];

    fetchRooms().then((metas) => {
      if (!metas || metas.length === 0) return;

      metas.forEach(({ room }) => {
        const cb = (msg: MessageResponse) => {
          // ✅ Chỉ tăng unread + cập nhật lastMessage nếu KHÔNG phải tin của mình
          const isFromMe = msg.senderId === user.id;

          setRoomMetas((prev) => {
            const idx = prev.findIndex((m) => m.room.id === room.id);
            if (idx === -1) return prev;

            const updated = [...prev];
            const old = updated[idx];
            updated[idx] = {
              ...old,
              lastMessage: msg,
              unreadCount: isFromMe ? old.unreadCount : old.unreadCount + 1,
            };

            // Đưa phòng vừa có tin lên đầu
            const [moved] = updated.splice(idx, 1);
            return [moved, ...updated];
          });
        };

        websocketService.subscribe(room.id, cb);
        callbacks.push({ roomId: room.id, cb });
      });
    });

    return () => {
      // Cleanup: hủy tất cả subscription khi unmount hoặc logout
      callbacks.forEach(({ roomId, cb }) => {
        websocketService.unsubscribe(roomId, cb);
      });
    };
  }, [isAuthenticated, user]); // chỉ chạy lại khi auth thay đổi

  // ── Khi user click vào phòng → reset unread ──────────────────────────────
  const markRoomAsRead = useCallback((roomId: number) => {
    setRoomMetas((prev) =>
      prev.map((m) =>
        m.room.id === roomId ? { ...m, unreadCount: 0 } : m
      )
    );
  }, []);

  return (
    <RoomListContext.Provider
      value={{ roomMetas, loading, markRoomAsRead, refresh: fetchRooms }}
    >
      {children}
    </RoomListContext.Provider>
  );
};