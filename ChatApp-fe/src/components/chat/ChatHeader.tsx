import React, { useState } from "react";
import { FiPhone, FiVideo, FiSearch, FiInfo, FiX } from "react-icons/fi";
import Avatar from "../avatar/Avatar";
import ActionBtn from "../btn/ActionBtn";

interface ChatHeaderProps {
  roomName: string;
  avatarUrl?: string | null;
  isGroup: boolean;
  memberCount?: number;
  showInfoPanel: boolean;
  onToggleInfoPanel: () => void;
  onSearch: (keyword: string) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  roomName,
  avatarUrl,
  isGroup,
  memberCount,
  showInfoPanel,
  onToggleInfoPanel,
  onSearch,
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearchClick = () => setIsSearching(true);
  const handleSearchClose = () => {
    setIsSearching(false);
    setSearchKeyword("");
    onSearch("");
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchKeyword(val);
    onSearch(val);
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm z-10">
      <div className="flex items-center gap-3">
        <Avatar src={avatarUrl} text={roomName} size="sm" />
        <div>
          <h2 className="font-bold text-gray-900 text-sm">{roomName}</h2>
          <p className="text-xs text-gray-500">
            {isGroup ? `${memberCount} thành viên` : "Hoạt động"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        {isSearching ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              type="text"
              className="text-sm border border-gray-200 rounded-full px-3 py-1 outline-none focus:ring-2 focus:ring-blue-300"
              placeholder="Tìm trong hội thoại..."
              value={searchKeyword}
              onChange={handleSearchChange}
            />
            <button
              onClick={handleSearchClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
            >
              <FiX size={15} />
            </button>
          </div>
        ) : (
          <>
            <ActionBtn icon={<FiPhone size={17} />} label="Gọi thoại" />
            <ActionBtn icon={<FiVideo size={17} />} label="Gọi video" />
            <ActionBtn icon={<FiSearch size={17} />} label="Tìm kiếm" onClick={handleSearchClick} />
            <ActionBtn
              icon={<FiInfo size={17} />}
              label="Thông tin"
              active={showInfoPanel}
              onClick={onToggleInfoPanel}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;