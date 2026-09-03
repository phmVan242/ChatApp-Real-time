import React from "react";
import { QuickActionProps } from "./types";

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition"
    >
      <span className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center">
        {icon}
      </span>

      {label}
    </button>
  );
};

export default QuickAction;