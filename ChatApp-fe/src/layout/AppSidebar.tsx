import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { HorizontaLDots } from "../icons";
import ApiService, { RoomResponse } from "../api/ApiService"; 
import axios from "axios";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.getRooms();
        setRooms(data.content || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else {
          setError("Failed to load conversations");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Helper functions giữ nguyên
  const getRoomDisplayName = (room: RoomResponse): string => {
    if (room.type === "GROUP") {
      return room.name || "Unnamed Group";
    }
    return room.createdBy.displayName;
  };

  const getRoomAvatar = (room: RoomResponse): string | undefined => {
    if (room.type === "GROUP") {
      return room.avatarUrl || undefined;
    }
    return room.createdBy.avatarUrl || undefined;
  };

  const isRoomActive = (roomId: number) => {
    return location.pathname === `/chat/${roomId}`;
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Render phần sidebar giữ nguyên như trước, chỉ thay đổi phần fetch
  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* Danh sách hội thoại */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
        <div className="mb-6">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                "Conversations"
              ) : (
                <HorizontaLDots className="size-6" />
              )}
            </h2>

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                {error}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && sortedRooms.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400 text-sm p-4 text-center">
                No conversations yet
              </div>
            )}

            {/* Room list */}
            {!loading && !error && sortedRooms.length > 0 && (
              <ul className="flex flex-col gap-1">
                {sortedRooms.map((room) => {
                  const displayName = getRoomDisplayName(room);
                  const avatarUrl = getRoomAvatar(room);
                  const isActive = isRoomActive(room.id);

                  return (
                    <li key={room.id}>
                      <Link
                        to={`/chat/${room.id}`}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        } ${!isExpanded && !isHovered ? "justify-center" : ""}`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={displayName}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-medium">
                              {displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Nội dung */}
                        {(isExpanded || isHovered || isMobileOpen) && (
                          <div className="flex-1 min-w-0">
                            <span className="font-medium truncate text-gray-900 dark:text-gray-100">
                              {displayName}
                            </span>
                          </div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default AppSidebar;