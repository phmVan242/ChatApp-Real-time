import React, { useState, useRef, useEffect } from "react";
import { FiSmile, FiPaperclip, FiMic, FiSend, FiX } from "react-icons/fi";

const EMOJIS_QUICK = ["😊", "😂", "❤️", "👍", "🔥", "🎉", "😅", "🙏"];

interface InputAreaProps {
  onSend: (text: string) => void;
  onTyping: () => void;
  replyTo: { senderName: string; content: string } | null;
  onCancelReply: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({ onSend, onTyping, replyTo, onCancelReply }) => {
  const [text, setText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    onTyping();
    typingTimeoutRef.current = setTimeout(() => {}, 1500);
    // Auto resize
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-gray-100 bg-white">
      {replyTo && (
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border-b border-blue-100">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-blue-600">
              Đang trả lời {replyTo.senderName}
            </p>
            <p className="text-xs text-gray-500 truncate">{replyTo.content}</p>
          </div>
          <button onClick={onCancelReply} className="text-gray-400 hover:text-gray-600">
            <FiX size={15} />
          </button>
        </div>
      )}

      <div className="px-3 py-3">
        <div className="flex items-end gap-2 bg-gray-100 rounded-2xl px-3 py-2">
          <div className="relative self-end pb-0.5">
            <button
              onClick={() => setShowEmojiPicker((p) => !p)}
              className="text-gray-500 hover:text-yellow-500 transition p-1"
            >
              <FiSmile size={20} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-10 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex flex-wrap gap-2 w-52 z-30">
                <p className="w-full text-xs text-gray-400 font-semibold">Biểu tượng cảm xúc</p>
                {EMOJIS_QUICK.map((e) => (
                  <button
                    key={e}
                    onClick={() => handleEmojiClick(e)}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {e}
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea
            ref={inputRef}
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm text-gray-800 placeholder-gray-400 max-h-32 py-1 leading-relaxed"
            placeholder="Aa"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          />

          <button className="text-gray-500 hover:text-blue-500 transition p-1 self-end pb-1">
            <FiPaperclip size={18} />
          </button>

          {text.trim() ? (
            <button
              onClick={handleSend}
              className="w-8 h-8 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center text-white transition shadow-sm self-end"
            >
              <FiSend size={14} />
            </button>
          ) : (
            <button className="text-gray-500 hover:text-blue-500 transition p-1 self-end pb-1">
              <FiMic size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default InputArea;