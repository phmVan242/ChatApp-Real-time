import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import ApiService, { RoomResponse, MessageResponse, UserResponse } from "../../api/ApiService";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
import EmptyState from "./EmptyState";

export default function ChatPage() {
  const { user, logout } = useAuth();
  const token = localStorage.getItem("token");

  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [allUsers, setAllUsers] = useState<UserResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  const loadingRef = useRef(false);
  const { connect, subscribe, unsubscribe, sendMessage, connected } = useWebSocket(token);

  // Connect WebSocket on mount
  useEffect(() => {
    if (token) {
      connect();
    }
  }, [token, connect]);

  // Subscribe to room topic when connected or room changes
  useEffect(() => {
    if (!connected || !selectedRoom) return;

    const destination = `/topic/room/${selectedRoom.id}`;

    subscribe(destination, (msg) => {
      try {
        const incoming: MessageResponse = JSON.parse(msg.body);

        // ✅ FIX: Nếu message cùng ID đã tồn tại → UPDATE (edit/delete)
        //         Nếu chưa có → ADD (tin nhắn mới)
        setMessages((prev) => {
          const existingIdx = prev.findIndex((m) => m.id === incoming.id);
          if (existingIdx !== -1) {
            // Update tin nhắn hiện có (cho trường hợp edit hoặc delete)
            const updated = [...prev];
            updated[existingIdx] = incoming;
            return updated;
          }
          // Tin nhắn mới → thêm vào cuối
          return [...prev, incoming];
        });

        // Move room lên đầu sidebar
        setRooms((prev) => {
          const exists = prev.find((r) => r.id === selectedRoom.id);
          if (!exists) return prev;
          return [selectedRoom, ...prev.filter((r) => r.id !== selectedRoom.id)];
        });
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    });

    // Cleanup: unsubscribe khi unmount hoặc đổi room
    return () => {
      unsubscribe(destination);
    };
  }, [connected, selectedRoom, subscribe, unsubscribe]);

  // Load rooms
  const loadRooms = useCallback(async () => {
    try {
      const data = await ApiService.getRooms(0, 50);
      setRooms(data.content || []);
    } catch (err) {
      console.error("Failed to load rooms:", err);
    }
  }, []);

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  // Load messages for selected room
  const loadMessages = useCallback(async (roomId: number, pageNum: number = 0, append: boolean = false) => {
    // ✅ FIX: Dùng ref thay vì state để tránh stale closure
    if (loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const data = await ApiService.getMessages(roomId, pageNum, 30);
      const msgs = data.messages || [];
      if (append) {
        setMessages((prev) => [...msgs.reverse(), ...prev]);
      } else {
        setMessages(msgs.reverse());
      }
      setHasMore(data.hasNext);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  const handleSelectRoom = (room: RoomResponse) => {
    setSelectedRoom(room);
    setMessages([]);
    setPage(0);
    setHasMore(false);
    loadMessages(room.id, 0, false);
  };

  const handleSendMessage = (content: string) => {
    if (!selectedRoom || !content.trim()) return;
    sendMessage(`/app/chat.send/${selectedRoom.id}`, {
      content: content.trim(),
      type: "TEXT",
    });
  };

  const handleLoadMore = () => {
    if (selectedRoom && hasMore) {
      loadMessages(selectedRoom.id, page + 1, true);
    }
  };

  const handleStartChat = async (otherUser: UserResponse) => {
    try {
      const room = await ApiService.createPrivateRoom(otherUser.id);
      await loadRooms();
      const freshRooms = await ApiService.getRooms(0, 50);
      setRooms(freshRooms.content || []);
      const targetRoom = (freshRooms.content || []).find((r: RoomResponse) => r.id === room.id) || room;
      handleSelectRoom(targetRoom);
    } catch (err) {
      console.error("Failed to start chat:", err);
    }
  };

  // Load all users for new conversation
  useEffect(() => {
    ApiService.getAllUsers().then(setAllUsers).catch(console.error);
  }, []);

  const filteredRooms = rooms.filter((room) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    if (room.type === "GROUP" && room.name?.toLowerCase().includes(q)) return true;
    const otherUser = room.members?.find((m) => m.id !== user?.id);
    if (otherUser?.displayName?.toLowerCase().includes(q)) return true;
    if (otherUser?.username?.toLowerCase().includes(q)) return true;
    return false;
  });

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        user={user}
        rooms={filteredRooms}
        selectedRoom={selectedRoom}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectRoom={handleSelectRoom}
        onStartChat={handleStartChat}
        allUsers={allUsers}
        onLogout={logout}
        currentUserId={user?.id}
      />

      {/* Main Chat Area */}
      {selectedRoom ? (
        <ChatWindow
          room={selectedRoom}
          messages={messages}
          onSendMessage={handleSendMessage}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={loading}
          currentUserId={user?.id}
        />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
