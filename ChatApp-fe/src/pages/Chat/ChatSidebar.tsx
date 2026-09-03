import { useState } from "react";
import { useNavigate } from "react-router";
import { RoomResponse, UserResponse } from "../../api/ApiService";

interface ChatSidebarProps {
  user: any;
  rooms: RoomResponse[];
  selectedRoom: RoomResponse | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectRoom: (room: RoomResponse) => void;
  onStartChat: (user: UserResponse) => void;
  allUsers: UserResponse[];
  onLogout: () => void;
  currentUserId?: number;
}

export default function ChatSidebar({
  user,
  rooms,
  selectedRoom,
  searchQuery,
  onSearchChange,
  onSelectRoom,
  onStartChat,
  allUsers,
  onLogout,
  currentUserId,
}: ChatSidebarProps) {
  const [showNewChat, setShowNewChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const getOtherUser = (room: RoomResponse) => {
    return room.members?.find((m) => m.id !== currentUserId);
  };

  const getRoomName = (room: RoomResponse) => {
    if (room.type === "GROUP" && room.name) return room.name;
    const other = getOtherUser(room);
    return other?.displayName || other?.username || "Unknown";
  };

  const getAvatarUrl = (room: RoomResponse) => {
    if (room.avatarUrl) return room.avatarUrl;
    if (room.type === "PRIVATE") {
      const other = getOtherUser(room);
      return other?.avatarUrl;
    }
    return null;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-cyan-500",
      "bg-yellow-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const filteredUsers = allUsers
    .filter((u) => u.id !== currentUserId)
    .filter(
      (u) =>
        !searchQuery.trim() ||
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="w-[360px] min-w-[360px] border-r border-gray-200 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="relative cursor-pointer"
            onClick={() => navigate("/profile")}
            title="View profile"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
              {getInitials(user?.displayName || "U")}
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Chats</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowNewChat(!showNewChat)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            title="New message"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
            </svg>
          </button>
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            {/* Overlay to close menu on click outside */}
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute top-14 left-4 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50 w-52">
              <button
                onClick={() => { navigate("/profile"); setShowMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </button>
              <button
                className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <hr className="my-1.5 border-gray-100" />
              <button
                onClick={() => { onLogout(); setShowMenu(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </div>
          </>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-3 pb-2">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search Messenger"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-full text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-gray-200 transition-colors"
          />
        </div>
      </div>

      {/* New Chat / Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {showNewChat && !searchQuery.trim() ? (
          <div className="px-3 py-2">
            <h3 className="text-sm font-semibold text-gray-500 px-2 mb-2">Start a new conversation</h3>
            <div className="space-y-0.5">
              {filteredUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => { onStartChat(u); setShowNewChat(false); onSearchChange(""); }}
                  className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full ${getAvatarColor(u.displayName)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                    {getInitials(u.displayName)}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">{u.displayName}</p>
                    <p className="text-xs text-gray-500">@{u.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : showNewChat ? (
          <div className="px-3 py-2">
            <h3 className="text-sm font-semibold text-gray-500 px-2 mb-2">Search users</h3>
            <div className="space-y-0.5">
              {filteredUsers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No users found</p>
              ) : (
                filteredUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { onStartChat(u); setShowNewChat(false); onSearchChange(""); }}
                    className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full ${getAvatarColor(u.displayName)} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                      {getInitials(u.displayName)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">{u.displayName}</p>
                      <p className="text-xs text-gray-500">@{u.username}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="px-1.5 py-1">
            {rooms.length === 0 ? (
              <div className="text-center py-10">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-gray-400">No conversations yet</p>
                <button
                  onClick={() => setShowNewChat(true)}
                  className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Start a new chat
                </button>
              </div>
            ) : (
              rooms.map((room) => {
                const name = getRoomName(room);
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <button
                    key={room.id}
                    onClick={() => onSelectRoom(room)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-100 hover:bg-blue-150"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      {getAvatarUrl(room) ? (
                        <img
                          src={getAvatarUrl(room)!}
                          alt={name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full ${getAvatarColor(name)} flex items-center justify-center text-white font-semibold text-sm`}>
                          {getInitials(name)}
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className={`text-sm font-semibold truncate ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
                        {name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {new Date(room.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
