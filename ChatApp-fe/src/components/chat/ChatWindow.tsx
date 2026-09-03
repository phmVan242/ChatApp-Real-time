import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router";
import ApiService, {
  MessageResponse,
  RoomResponse,
} from "../../api/ApiService";
import { useAuth } from "../../context/AuthContext";
import { useChatSocket } from "../../hooks/useChatSocket";
import ChatHeader from "../../components/chat/ChatHeader";
import MessageArea from "../message/MessageArea";
import InputArea from "../../components/chat/InputArea";

const ChatWindow: React.FC = () => {
  const { roomId: roomIdStr } = useParams<{ roomId: string }>();
  const roomId = Number(roomIdStr);

  const { user } = useAuth();

  const [room, setRoom] = useState<RoomResponse | null>(null);
  const [historyMessages, setHistoryMessages] = useState<MessageResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [replyTo, setReplyTo] = useState<{
    senderName: string;
    content: string;
  } | null>(null);

  const [typingUsers] = useState<string[]>([]);

  // =========================
  // Lấy thông tin phòng
  // =========================
  useEffect(() => {
    if (!roomId) return;

    ApiService.getRoomById(roomId)
      .then(setRoom)
      .catch(console.error);
  }, [roomId]);

  // =========================
  // Lấy lịch sử tin nhắn
  // =========================
  const loadMessages = useCallback(async () => {
    try {
      const data = await ApiService.getMessages(roomId, 0, 30);

      setHistoryMessages(
        [...(data.messages || [])].reverse()
      );
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    loadMessages();
  }, [roomId, loadMessages]);

  // =========================
  // WebSocket
  // =========================
  const {
    messages: liveMessages,
    sendMessage,
  } = useChatSocket(roomId);

  // =========================
  // Gộp lịch sử + realtime
  // =========================
  const allMessages = [...historyMessages, ...liveMessages];

  // =========================
  // Gửi tin nhắn
  // =========================
  const handleSend = (text: string) => {
    if (!text.trim()) return;

    sendMessage(text);

    setReplyTo(null);
  };

  // =========================
  // Xóa tin nhắn
  // =========================
  const handleDelete = async (messageId: number) => {
    try {
      await ApiService.deleteMessage(roomId, messageId);

      setHistoryMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                isDeleted: true,
                content: "",
              }
            : m
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Sửa tin nhắn
  // =========================
  const handleEdit = async (
    messageId: number,
    newContent: string
  ) => {
    try {
      await ApiService.editMessage(
        roomId,
        messageId,
        newContent
      );

      setHistoryMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                content: newContent,
              }
            : m
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // Search
  // =========================
  const filteredMessages = searchKeyword
    ? allMessages.filter((m) =>
        m.content
          ?.toLowerCase()
          .includes(searchKeyword.toLowerCase())
      )
    : [];

  // =========================
  // Header info
  // =========================
  const getDisplayInfo = () => {
    if (!room) {
      return {
        name: "Loading...",
        avatar: null,
        isGroup: false,
        memberCount: 0,
      };
    }

    if (room.type === "GROUP") {
      return {
        name: room.name || "Nhóm",
        avatar: room.avatarUrl,
        isGroup: true,
        memberCount: room.members.length,
      };
    }

    const other = room.members.find(
      (m) => m.id !== user?.id
    );

    return {
      name: other?.displayName || "Người dùng",
      avatar: other?.avatarUrl,
      isGroup: false,
      memberCount: 2,
    };
  };

  const {
    name: roomName,
    avatar: roomAvatar,
    isGroup,
    memberCount,
  } = getDisplayInfo();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white min-w-0 h-full">
      <ChatHeader
        roomName={roomName}
        avatarUrl={roomAvatar}
        isGroup={isGroup}
        memberCount={memberCount}
        showInfoPanel={showInfoPanel}
        onToggleInfoPanel={() =>
          setShowInfoPanel((prev) => !prev)
        }
        onSearch={setSearchKeyword}
      />

      {/* Debug websocket */}
      {/* <div className="px-3 py-1 text-xs border-b text-gray-500">
        WebSocket:
        <span
          className={
            isConnected
              ? "text-green-600 ml-1"
              : "text-red-600 ml-1"
          }
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div> */}

      <MessageArea
        roomName={roomName}
        roomAvatar={roomAvatar}
        isGroup={isGroup}
        memberCount={memberCount}
        messages={allMessages}
        filteredMessages={filteredMessages}
        searchKeyword={searchKeyword}
        typingUsers={typingUsers}
        currentUserId={user?.id || 0}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <InputArea
        onSend={handleSend}
        onTyping={() => {}}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
      />
    </div>
  );
};

export default ChatWindow;
