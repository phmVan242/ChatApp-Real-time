// src/hooks/useChatSocket.ts
import { useEffect, useState, useCallback } from "react";
import websocketService from "../services/websocket";
import { MessageResponse } from "../types/message";
import { useRoomList } from "../context/RoomListContext";

export const useChatSocket = (roomId: number | null) => {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const { markRoomAsRead } = useRoomList();

  // Reset live messages khi chuyển phòng
  useEffect(() => {
    setMessages([]);
  }, [roomId]);

  // Đang xem phòng → reset unread badge
  useEffect(() => {
    if (roomId) markRoomAsRead(roomId);
  }, [roomId, markRoomAsRead]);

  useEffect(() => {
    if (!roomId) return;

    // ✅ Chỉ subscribe thêm callback cho ChatWindow
    // RoomListContext đã subscribe room này rồi → 2 callbacks cùng chạy,
    // không tạo thêm connection hay subscription mới
    const cb = (msg: MessageResponse) => {
      setMessages((prev) => [...prev, msg]);
    };

    websocketService.subscribe(roomId, cb);
    setIsConnected(websocketService.isConnected());

    // Poll connected state (vì STOMP connect async)
    const interval = setInterval(() => {
      setIsConnected(websocketService.isConnected());
    }, 500);

    return () => {
      clearInterval(interval);
      websocketService.unsubscribe(roomId, cb);
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (roomId) {
        websocketService.sendMessage(roomId, content);
      }
    },
    [roomId]
  );

  return { messages, sendMessage, isConnected };
};