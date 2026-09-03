import React, { useRef, useLayoutEffect } from "react";
import Avatar from "../avatar/Avatar";  
import MessageList from "./MessageList";
import TypingIndicator from "../chat/TypingIndicator";
import { MessageResponse } from "../../api/ApiService";

interface MessageAreaProps {
  roomName: string;
  roomAvatar?: string | null;
  isGroup: boolean;
  memberCount?: number;
  messages: MessageResponse[];
  filteredMessages: MessageResponse[];
  searchKeyword: string;
  typingUsers: string[];
  currentUserId: number;
  onDelete: (id: number) => void;
  onEdit: (id: number, newContent: string) => void;
}

const MessageArea: React.FC<MessageAreaProps> = ({
  roomName,
  roomAvatar,
  isGroup,
  memberCount,
  messages,
  filteredMessages,
  searchKeyword,
  typingUsers,
  currentUserId,
  onDelete,
  onEdit,
}) => {
  const messageAreaRef = useRef<HTMLDivElement>(null);
  const displayMessages = searchKeyword ? filteredMessages : messages;

  useLayoutEffect(() => {
    const messageArea = messageAreaRef.current;

    if (!messageArea) return;

    messageArea.scrollTop = messageArea.scrollHeight;
  }, [displayMessages.length, typingUsers.length]);

  return (
    <div
      ref={messageAreaRef}
      className="flex-1 overflow-y-auto custom-scroll px-4 py-4 bg-white"
    >
      {/* Header greeting */}
      <div className="flex flex-col items-center mb-6">
        <Avatar src={roomAvatar} text={roomName} size="lg" />
        <h3 className="mt-2 font-bold text-lg text-gray-900">{roomName}</h3>
        <p className="text-xs text-gray-400 mt-1">
          {isGroup ? `Nhóm · ${memberCount} thành viên` : "Bạn bè trên Messenger"}
        </p>
      </div>

      {searchKeyword && (
        <div className="text-center text-xs text-gray-400 mb-3">
          Tìm thấy {filteredMessages.length} tin nhắn chứa "{searchKeyword}"
        </div>
      )}

      <MessageList
        messages={displayMessages}
        currentUserId={currentUserId}
        onDelete={onDelete}
        onEdit={onEdit}
      />

      {typingUsers.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-400 mb-1 ml-10">
            {typingUsers.join(", ")} đang soạn tin...
          </p>
          <TypingIndicator />
        </div>
      )}
    </div>
  );
};

export default MessageArea;
