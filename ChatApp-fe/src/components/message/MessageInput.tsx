import React, { useState, useRef } from "react";
import { FiSend, FiSmile } from "react-icons/fi";

interface MessageInputProps {
  onSend: (text: string) => void;
  onTyping?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, onTyping }) => {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    onTyping?.();
    // Auto resize
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="px-4 py-3 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-2 bg-gray-100 rounded-2xl px-3 py-2">
        <button className="text-gray-500 hover:text-yellow-500">
          <FiSmile size={20} />
        </button>
        <textarea
          ref={textareaRef}
          rows={1}
          className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-800 placeholder-gray-400 max-h-32 py-1 leading-relaxed"
          placeholder="Aa"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition"
        >
          <FiSend size={14} />
        </button>
      </div>
      <div className="text-[10px] text-center text-gray-300 mt-1.5">
        Nhấn Enter để gửi · Shift+Enter xuống dòng
      </div>
    </div>
  );
};

export default MessageInput;