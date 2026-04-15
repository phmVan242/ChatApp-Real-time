import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { HorizontaLDots } from "../icons";
import ApiService, { RoomResponse, UserBasicInfo } from "../api/ApiService";
import axios from "axios";

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user: currentUser } = useAuth();
  const location = useLocation();

  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!currentUser) return;
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
  }, [currentUser]);

  // Lấy thông tin hiển thị cho một room (tên và avatar)
  const getRoomDisplayInfo = (room: RoomResponse): { displayName: string; avatarUrl?: string } => {
    if (room.type === "GROUP") {
      return {
        displayName: room.name || "Unnamed Group",
        avatarUrl: room.avatarUrl || undefined,
      };
    }

    // PRIVATE room: tìm người dùng còn lại trong members
    if (room.members && room.members.length > 0) {
      const other = room.members.find((member: UserBasicInfo) => member.id !== currentUser?.id);
      if (other) {
        return {
          displayName: other.displayName,
          avatarUrl: other.avatarUrl || undefined,
        };
      }
      // Nếu chỉ có một member (dữ liệu lỗi), hiển thị member đó
      if (room.members[0]) {
        return {
          displayName: room.members[0].displayName,
          avatarUrl: room.members[0].avatarUrl || undefined,
        };
      }
    }

    // Fallback: dùng createdBy (không chính xác tuyệt đối nhưng tránh lỗi)
    return {
      displayName: room.createdBy?.displayName || "Unknown",
      avatarUrl: room.createdBy?.avatarUrl || undefined,
    };
  };

  const isRoomActive = (roomId: number) => {
    return location.pathname === `/chat/${roomId}`;
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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

            {loading && (
              <div className="flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                {error}
              </div>
            )}

            {!loading && !error && sortedRooms.length === 0 && (
              <div className="text-gray-500 dark:text-gray-400 text-sm p-4 text-center">
                No conversations yet
              </div>
            )}

            {!loading && !error && sortedRooms.length > 0 && (
              <ul className="flex flex-col gap-1">
                {sortedRooms.map((room) => {
                  const { displayName, avatarUrl } = getRoomDisplayInfo(room);
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