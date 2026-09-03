import React from "react";

interface AvatarProps {
  src?: string | null;
  text?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-lg",
};

const Avatar: React.FC<AvatarProps> = ({ src, text, size = "md", isOnline = false }) => {
  const sizeClass = sizeClasses[size];
  return (
    <div className="relative inline-block">
      {src ? (
        <img src={src} alt="avatar" className={`${sizeClass} rounded-full object-cover`} />
      ) : (
        <div className={`${sizeClass} rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-md`}>
          {text ? text.charAt(0).toUpperCase() : "?"}
        </div>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
      )}
    </div>
  );
};

export default Avatar;