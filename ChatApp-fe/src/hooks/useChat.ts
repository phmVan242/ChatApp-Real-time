// hooks/useChat.ts
import { useState } from 'react';

export interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  timestamp: Date;
}

// Tin nhắn mẫu ban đầu
const initialMessages: Message[] = [
  {
    id: 1,
    text: 'Chào bạn!',
    sender: 'other',
    timestamp: new Date(),
  },
  {
    id: 2,
    text: 'Chào, có khoẻ không?',
    sender: 'me',
    timestamp: new Date(),
  },
  {
    id: 3,
    text: 'Mình khoẻ, cảm ơn. Bạn thì sao?',
    sender: 'other',
    timestamp: new Date(),
  },
];

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: 'me',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Giả lập phản hồi từ người khác sau 1 giây (tuỳ chọn)
    // setTimeout(() => {
    //   const reply: Message = {
    //     id: Date.now() + 1,
    //     text: 'Cảm ơn bạn đã nhắn!',
    //     sender: 'other',
    //     timestamp: new Date(),
    //   };
    //   setMessages((prev) => [...prev, reply]);
    // }, 1000);
  };

  return { messages, sendMessage };
};