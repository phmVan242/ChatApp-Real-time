// components/MessageItem.tsx
import { MessageResponse } from '../../api/ApiService';

interface MessageItemProps {
  message: MessageResponse;
  currentUserId: number;
}

export const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const senderId = Number(message.senderId ?? 0);
  const isMe = senderId === Number(currentUserId);
  const isSystem = message.type === 'JOIN' || message.type === 'LEAVE';

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center mb-3">
        <div className="px-3 py-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className="max-w-[70%] flex flex-col">
        {!isMe && (
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-2 mb-1">
            {message.senderName}
          </span>
        )}
        <div
          className={`relative px-4 py-2 rounded-2xl shadow-sm ${
            isMe
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
          <span
            className={`text-[10px] mt-1 block text-right ${
              isMe ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {formatTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};