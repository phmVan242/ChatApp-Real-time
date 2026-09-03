import { useState, useRef, useEffect } from "react";
import { RoomResponse, MessageResponse } from "../../api/ApiService";
import ApiService from "../../api/ApiService";

interface ChatWindowProps {
  room: RoomResponse;
  messages: MessageResponse[];
  onSendMessage: (content: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  currentUserId?: number;
}

export default function ChatWindow({
  room,
  messages,
  onSendMessage,
  onLoadMore,
  hasMore,
  loading,
  currentUserId,
}: ChatWindowProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hoveredMsgId, setHoveredMsgId] = useState<number | null>(null);
  const [contextMenu, setContextMenu] = useState<{ msgId: number; x: number; y: number } | null>(null);

  // Get other user info
  const otherUser = room.members?.find((m) => m.id !== currentUserId);
  const chatName = room.type === "GROUP" && room.name
    ? room.name
    : otherUser?.displayName || otherUser?.username || "Chat";

  const getInitials = (name: string) => {
    return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500",
      "bg-indigo-500", "bg-teal-500", "bg-orange-500", "bg-red-500",
      "bg-cyan-500", "bg-yellow-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Close context menu on click outside
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
  }, [contextMenu]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    setContextMenu(null);
    try {
      await ApiService.deleteMessage(room.id, messageId);
      // Backend sẽ broadcast qua WebSocket → frontend tự cập nhật
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isConsecutive = (msg: MessageResponse, prevMsg: MessageResponse | null) => {
    if (!prevMsg) return false;
    if (msg.sender.id !== prevMsg.sender.id) return false;
    const diff = new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime();
    return diff < 60000;
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          {otherUser?.avatarUrl ? (
            <img src={otherUser.avatarUrl} alt={chatName} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className={`w-10 h-10 rounded-full ${getAvatarColor(chatName)} flex items-center justify-center text-white font-semibold text-sm`}>
              {getInitials(chatName)}
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{chatName}</h2>
            <p className="text-xs text-gray-500">
              {room.type === "GROUP"
                ? `${room.members?.length || 0} members`
                : "Active now"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {hasMore && (
          <div className="text-center mb-4">
            <button
              onClick={onLoadMore}
              disabled={loading}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load earlier messages"}
            </button>
          </div>
        )}

        <div className="space-y-0.5">
          {messages.map((msg, index) => {
            const isMine = msg.sender.id === currentUserId;
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const consecutive = isConsecutive(msg, prevMsg);

            // System messages (JOIN/LEAVE)
            if (msg.type === "JOIN" || msg.type === "LEAVE") {
              return (
                <div key={msg.id} className="text-center py-2">
                  <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {msg.content}
                  </span>
                </div>
              );
            }

            // Deleted messages
            if (msg.isDeleted) {
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMine ? "justify-end" : "justify-start"} ${
                    consecutive ? "mt-0.5" : "mt-2"
                  }`}
                >
                  {!isMine && (
                    <div className={`w-7 h-7 rounded-full ${getAvatarColor(msg.sender.displayName)} flex items-center justify-center text-white text-xs font-medium flex-shrink-0 mr-2 ${consecutive ? "invisible" : ""}`}>
                      {getInitials(msg.sender.displayName)}
                    </div>
                  )}
                  <div className={`px-3 py-1.5 rounded-2xl bg-gray-50 ${isMine ? "" : ""}`}>
                    <p className="text-xs text-gray-400 italic flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Tin nhắn đã bị xóa
                    </p>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} ${
                  consecutive ? "mt-0.5" : "mt-3"
                } group relative`}
                onMouseEnter={() => setHoveredMsgId(msg.id)}
                onMouseLeave={() => setHoveredMsgId(null)}
              >
                {/* Other user avatar */}
                {!isMine && (
                  <div className={`w-7 h-7 rounded-full ${getAvatarColor(msg.sender.displayName)} flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${consecutive ? "invisible" : ""}`}>
                    {getInitials(msg.sender.displayName)}
                  </div>
                )}

                {/* Message bubble */}
                <div className={`flex flex-col max-w-[65%] ${isMine ? "items-end" : "items-start"}`}>
                  {room.type === "GROUP" && !isMine && !consecutive && (
                    <span className="text-xs text-gray-500 mb-0.5 ml-3">
                      {msg.sender.displayName}
                    </span>
                  )}
                  <div
                    className={`px-3 py-2 rounded-2xl ${
                      isMine
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    } ${
                      consecutive
                        ? isMine
                          ? "rounded-tr-lg rounded-br-sm"
                          : "rounded-tl-lg rounded-bl-sm"
                        : ""
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  {!consecutive && (
                    <span className={`text-[10px] text-gray-400 mt-0.5 ${isMine ? "mr-1" : "ml-3"}`}>
                      {formatTime(msg.createdAt)}
                    </span>
                  )}
                </div>

                {/* Context menu button (3 dots) - only for own messages */}
                {isMine && hoveredMsgId === msg.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextMenu({ msgId: msg.id, x: e.clientX, y: e.clientY });
                    }}
                    className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0 transition-opacity"
                  >
                    <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Context Menu for delete */}
      {contextMenu && (
        <div
          className="fixed bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          style={{ top: contextMenu.y, left: contextMenu.x - 120 }}
        >
          <button
            onClick={() => handleDeleteMessage(contextMenu.msgId)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Xóa tin nhắn
          </button>
        </div>
      )}

      {/* Message Input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Aa"
              className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-gray-200 transition-colors"
            />
          </div>

          {inputValue.trim() ? (
            <button
              type="submit"
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            >
              <svg className="w-7 h-7 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              className="w-9 h-9 flex items-center justify-center flex-shrink-0"
            >
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 12h.01M18.364 5.636a9 9 0 010 12.728" />
              </svg>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
