import React, { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { SectionProps } from "./types";

const Section: React.FC<SectionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
      >
        <span className="text-sm font-semibold text-gray-800">
          {title}
        </span>

        {open ? (
          <FiChevronUp size={15} className="text-gray-400" />
        ) : (
          <FiChevronDown size={15} className="text-gray-400" />
        )}
      </button>

      {open && (
        <div className="px-4 pb-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default Section;