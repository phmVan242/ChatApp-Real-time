import React from "react";

const TypingIndicator: React.FC = () => (
  <div className="flex items-end gap-2 mt-2">
    <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs" />
    <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  </div>
);

export default TypingIndicator;