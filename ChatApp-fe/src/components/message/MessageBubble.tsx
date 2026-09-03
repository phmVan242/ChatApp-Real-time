import React, { useState } from "react";
import {
  FiCornerUpLeft,
  FiTrash2,
  FiEdit2,
  FiMoreHorizontal,
} from "react-icons/fi";
import { MessageResponse } from "../../api/ApiService";

interface MessageBubbleProps {
  message: MessageResponse;
  isMe: boolean;
  onDelete?: (id: number) => void;
  onEdit?: (id: number, newContent: string) => void;
  onReply?: (message: MessageResponse) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  onDelete,
  onEdit,
  onReply,
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);

  const handleSave = () => {
    if (!editText.trim()) return;

    onEdit?.(message.id, editText.trim());
    setIsEditing(false);
  };

  if (message.isDeleted) {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
          Tin nhắn đã bị thu hồi
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-end gap-2 ${
        isMe ? "justify-end" : "justify-start"
      } mb-3 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Actions bên trái */}
      {showActions && isMe && !isEditing && (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <FiEdit2 size={13} />
          </button>

          <button
            onClick={() => onDelete?.(message.id)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center"
          >
            <FiTrash2 size={13} />
          </button>
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[70%] flex flex-col ${
          isMe ? "items-end" : "items-start"
        }`}
      >
        {!isMe && (
          <span className="text-xs font-medium text-blue-600 mb-1 ml-1">
            {message.senderName}
          </span>
        )}

        <div
          onClick={() => setShowTime(!showTime)}
          className={`relative px-4 py-2 rounded-2xl shadow-sm break-words cursor-pointer ${
            isMe
              ? "bg-blue-500 text-white rounded-br-md"
              : "bg-gray-100 text-gray-800 rounded-bl-md"
          }`}
        >
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="border rounded px-2 py-1 text-black text-sm"
                autoFocus
              />

              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleSave}
                  className="text-xs text-green-600"
                >
                  Lưu
                </button>

                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-red-500"
                >
                  Huỷ
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
        </div>

        {showTime && (
          <span
            className={`text-[10px] text-gray-400 mt-1 ${
              isMe ? "mr-1" : "ml-1"
            }`}
          >
            {new Date(message.createdAt).toLocaleString()}
          </span>
        )}
      </div>

      {/* Actions bên phải */}
      {showActions && !isEditing && (
        <div
          className={`flex items-center gap-1 ${
            isMe ? "order-first" : ""
          }`}
        >
          <button
            onClick={() => onReply?.(message)}
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <FiCornerUpLeft size={13} />
          </button>

          <button
            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
          >
            <FiMoreHorizontal size={13} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;