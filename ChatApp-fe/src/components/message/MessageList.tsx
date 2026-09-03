import React from "react";
import MessageBubble from "./MessageBubble";
import { MessageResponse } from "../../api/ApiService";

interface MessageListProps {
  messages: MessageResponse[];
  currentUserId: number;
  onDelete?: (id: number) => void;
  onEdit?: (id: number, newContent: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId, onDelete, onEdit }) => {
  return (
    <>
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isMe={msg.senderId === currentUserId}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </>
  );
};

export default MessageList;