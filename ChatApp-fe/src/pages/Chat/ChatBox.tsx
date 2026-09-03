// pages/Chat/ChatBox.tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChatSocket } from '../../hooks/useChatSocket';
import ApiService from '../../api/ApiService';
import { MessageResponse } from '../../api/ApiService';
// import { MessageInput } from '../../components/MessageInput';
// import { MessageItem } from '../../components/MessageItem';
import { MessageInput } from '../../components/message/MessageInput1';
import { MessageItem } from '../../components/message/MessageItem';

export default function ChatBox() {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [historyMessages, setHistoryMessages] = useState<MessageResponse[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const { messages: liveMessages, sendMessage, isConnected } = useChatSocket(
    roomId ? parseInt(roomId) : null
  );
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Lấy lịch sử tin nhắn
  useEffect(() => {
    if (!roomId) return;
    const fetchHistory = async () => {
      try {
        const response = await ApiService.getMessages(parseInt(roomId));
        const messages = response.messages || [];
        setHistoryMessages(messages.reverse());
      } catch (error) {
        console.error('Failed to load message history', error);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchHistory();
  }, [roomId]);

  // Auto scroll
  useLayoutEffect(() => {
    const messagesContainer = messagesContainerRef.current;

    if (!messagesContainer) return;

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, [liveMessages.length, historyMessages.length]);

  const allMessages = [...historyMessages, ...liveMessages];

  if (loadingHistory) {
    return <div className="flex items-center justify-center h-full">Loading messages...</div>;
  }

  // Debug: in ra user.id và senderId của tin nhắn đầu tiên
  console.log('Current user id:', user?.id);
  if (allMessages.length > 0) {
    console.log('First message senderId:', allMessages[0].senderId);
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white border-b dark:bg-gray-800 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Trò chuyện</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {isConnected ? 'Đã kết nối' : 'Đang kết nối...'}
          </span>
        </div>
      </div>

      {/* Danh sách tin nhắn */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar"
      >
        {allMessages.map((msg) => (
          <MessageItem key={msg.id} message={msg} currentUserId={user?.id ?? 0} />
        ))}
      </div>

      {/* Input */}
      <MessageInput onSend={sendMessage} disabled={!isConnected} />
    </div>
  );
}
