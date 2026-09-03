import React from "react";

interface ActionBtnProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const ActionBtn: React.FC<ActionBtnProps> = ({ icon, label, onClick, active }) => (
  <button
    onClick={onClick}
    title={label}
    className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
      active
        ? "bg-blue-100 text-blue-600"
        : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-blue-500"
    }`}
  >
    {icon}
  </button>
);

export default ActionBtn;