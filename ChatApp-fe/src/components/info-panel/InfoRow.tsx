import React from "react";
import { InfoRowProps } from "./types";

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  onClick,
  danger,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full py-1 rounded-lg hover:bg-gray-50 transition text-left ${
        danger ? "text-red-500" : "text-gray-700"
      }`}
    >
      <span
        className={`w-5 flex items-center justify-center ${
          danger ? "text-red-400" : "text-gray-500"
        }`}
      >
        {icon}
      </span>

      <span className="text-sm">
        {label}
      </span>
    </button>
  );
};

export default InfoRow;