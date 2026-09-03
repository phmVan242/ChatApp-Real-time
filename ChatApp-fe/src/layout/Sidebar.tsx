// src/layout/Sidebar.tsx
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  FiSearch,
  FiSettings,
  FiUsers,
  FiEdit,
  FiMoreHorizontal,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import { BsMessenger } from "react-icons/bs";

import { useAuth } from "../context/AuthContext";
import { useRoomList } from "../context/RoomListContext";
import { UserBasicInfo } from "../api/ApiService";
import { formatRelativeTime } from "../utils/formatTime";

type ConversationFilter = "all" | "unread" | "groups";

// ─── Helper: lấy tên + avatar phòng ──────────────────────────────────────────

const getRoomDisplayInfo = (
  room: { type: string; name?: string | null; avatarUrl?: string | null; members: UserBasicInfo[]; createdBy: UserBasicInfo },
  currentUserId?: number
): { displayName: string; avatarUrl?: string } => {
  if (room.type === "GROUP") {
    return {
      displayName: room.name || "Unnamed Group",
      avatarUrl: room.avatarUrl || undefined,
    };
  }
  const other = room.members?.find((m) => m.id !== currentUserId);
  if (other) {
    return {
      displayName: other.displayName,
      avatarUrl: other.avatarUrl || undefined,
    };
  }
  return {
    displayName: room.createdBy?.displayName || "Unknown",
    avatarUrl: room.createdBy?.avatarUrl || undefined,
  };
};

// ─── Avatar component ─────────────────────────────────────────────────────────

const RoomAvatar: React.FC<{ avatarUrl?: string; displayName: string; size?: string }> = ({
  avatarUrl,
  displayName,
  size = "w-12 h-12",
}) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName}
        className={`${size} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-full bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center flex-shrink-0 text-base`}
    >
      {displayName.charAt(0).toUpperCase()}
    </div>
  );
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const Sidebar: React.FC = () => {
  const { user: currentUser, logout } = useAuth();
  const { roomMetas, loading } = useRoomList();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<ConversationFilter>("all");
  const [showFooterMenu, setShowFooterMenu] = useState(false);

  const filters: { label: string; value: ConversationFilter }[] = [
    { label: "Tất cả", value: "all" },
    { label: "Chưa đọc", value: "unread" },
    { label: "Nhóm", value: "groups" },
  ];

  const handleLogout = () => {
    logout();
    setShowFooterMenu(false);
    navigate("/login", { replace: true });
  };

  // ── Filter theo search ────────────────────────────────────────────────────
  const filtered = roomMetas.filter((meta) => {
    const { displayName } = getRoomDisplayInfo(meta.room, currentUser?.id);
    const matchesSearch = displayName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === "unread") return meta.unreadCount > 0;
    if (filterType === "groups") return meta.room.type === "GROUP";

    return true;
  });

  // ── Render preview text tin nhắn cuối ────────────────────────────────────
  const renderLastMessage = (
    meta: typeof roomMetas[0]
  ): { text: string; isMine: boolean } => {
    const msg = meta.lastMessage;
    if (!msg) return { text: "Nhấn để mở cuộc trò chuyện", isMine: false };

    const isMine = msg.senderId === currentUser?.id;
    const prefix = isMine ? "Bạn: " : `${msg.senderName}: `;

    if (msg.isDeleted) {
      return { text: `${prefix}Tin nhắn đã bị xóa`, isMine };
    }
    if (msg.type === "IMAGE") {
      return { text: `${prefix}[Hình ảnh]`, isMine };
    }
    if (msg.type === "FILE") {
      return { text: `${prefix}[Tệp đính kèm]`, isMine };
    }
    return { text: `${prefix}${msg.content}`, isMine };
  };

  return (
    <div className="flex flex-col h-screen bg-white border-r border-gray-200 w-full max-w-sm">
      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow">
            <BsMessenger className="text-white text-lg" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Chat</h1>
        </Link>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <FiEdit />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <FiUsers />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition">
            <FiSettings />
          </button>
        </div>
      </div>

      {/* ── SEARCH ─────────────────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-2 space-y-2">
        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={15}
          />
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-100 rounded-full py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setFilterType(filter.value)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                filterType === filter.value
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── ROOM LIST ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-7 h-7 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <FiSearch size={30} />
            <p className="mt-2 text-sm">Không có cuộc trò chuyện nào</p>
          </div>
        )}

        {/* Items */}
        {!loading &&
          filtered.map((meta) => {
            const { displayName, avatarUrl } = getRoomDisplayInfo(
              meta.room,
              currentUser?.id
            );
            const isActive = location.pathname === `/chat/${meta.room.id}`;
            const { text: lastMsgText } = renderLastMessage(meta);
            const hasUnread = meta.unreadCount > 0 && !isActive;

            // Thời gian: dùng lastMessage nếu có, fallback về createdAt của room
            const timeSource = meta.lastMessage?.createdAt ?? meta.room.createdAt;
            const timeLabel = formatRelativeTime(new Date(timeSource));

            return (
              <Link
                key={meta.room.id}
                to={`/chat/${meta.room.id}`}
                className={`flex items-center gap-3 px-3 py-2 mx-1 rounded-xl transition-all duration-150 group
                  ${isActive ? "bg-blue-50" : "hover:bg-gray-100"}
                `}
              >
                {/* Avatar */}
                <RoomAvatar
                  avatarUrl={avatarUrl}
                  displayName={displayName}
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Row 1: Tên + thời gian */}
                  <div className="flex justify-between items-center">
                    <span
                      className={`truncate text-sm ${
                        hasUnread
                          ? "font-bold text-gray-900"
                          : "font-semibold text-gray-800"
                      }`}
                    >
                      {displayName}
                    </span>
                    <span
                      className={`text-xs flex-shrink-0 ml-1 ${
                        hasUnread ? "text-blue-500 font-semibold" : "text-gray-400"
                      }`}
                    >
                      {timeLabel}
                    </span>
                  </div>

                  {/* Row 2: Preview tin nhắn + unread badge */}
                  <div className="flex items-center justify-between mt-0.5 gap-1">
                    <p
                      className={`text-xs truncate leading-4 ${
                        hasUnread
                          ? "font-semibold text-gray-800"
                          : "text-gray-500"
                      }`}
                    >
                      {lastMsgText}
                    </p>

                    {/* Unread badge */}
                    {hasUnread && (
                      <span className="flex-shrink-0 min-w-[18px] h-[18px] bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {meta.unreadCount > 99 ? "99+" : meta.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* More button (hover) */}
                <button
                  onClick={(e) => e.preventDefault()}
                  className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition flex-shrink-0"
                >
                  <FiMoreHorizontal size={15} />
                </button>
              </Link>
            );
          })}
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <FiLock size={12} />
          Tin nhắn được mã hóa đầu cuối
        </span>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFooterMenu((prev) => !prev)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
            aria-label="Mở menu tài khoản"
          >
            <FiMoreHorizontal size={16} className="text-gray-400" />
          </button>

          {showFooterMenu && (
            <div className="absolute bottom-10 right-0 w-40 rounded-xl border border-gray-200 bg-white py-1 shadow-lg z-20">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition"
              >
                <FiLogOut size={15} />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
