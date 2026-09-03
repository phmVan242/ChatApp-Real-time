import { Link } from "react-router";
import {
  FiArrowRight,
  FiBell,
  FiMessageCircle,
  FiShield,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";
import { BsMessenger } from "react-icons/bs";
import { useAuth } from "../../context/AuthContext";
import { useRoomList } from "../../context/RoomListContext";

const quickActions = [
  {
    title: "Tin nhắn",
    description: "Mở danh sách trò chuyện và tiếp tục nhắn tin.",
    to: "/chat",
    icon: FiMessageCircle,
    accent: "bg-blue-50 text-blue-600",
  },
  {
    title: "Lời mời kết bạn",
    description: "Xem và phản hồi các yêu cầu kết bạn mới.",
    to: "/friend-requests",
    icon: FiUserPlus,
    accent: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Thông báo",
    description: "Theo dõi tin nhắn, lời mời và cập nhật gần đây.",
    to: "/notifications",
    icon: FiBell,
    accent: "bg-amber-50 text-amber-600",
  },
  {
    title: "Nhóm",
    description: "Lọc nhanh các cuộc trò chuyện nhóm trong sidebar.",
    to: "/chat",
    icon: FiUsers,
    accent: "bg-indigo-50 text-indigo-600",
  },
];

export default function Home() {
  const { user } = useAuth();
  const { roomMetas } = useRoomList();

  const unreadTotal = roomMetas.reduce(
    (total, meta) => total + meta.unreadCount,
    0
  );
  const groupTotal = roomMetas.filter((meta) => meta.room.type === "GROUP")
    .length;

  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col px-6 py-8">
        <section className="flex flex-col gap-5 border-b border-gray-200 pb-7 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 shadow">
              <BsMessenger className="text-2xl text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Xin chào, {user?.displayName || user?.username || "bạn"}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Chọn một mục bên dưới để vào nhanh tin nhắn, lời mời kết bạn hoặc
              thông báo của bạn.
            </p>
          </div>

          <Link
            to="/chat"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Vào tin nhắn
            <FiArrowRight size={16} />
          </Link>
        </section>

        <section className="grid gap-3 py-6 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
            <p className="text-xs font-medium text-gray-400">Cuộc trò chuyện</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {roomMetas.length}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
            <p className="text-xs font-medium text-gray-400">Chưa đọc</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {unreadTotal}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
            <p className="text-xs font-medium text-gray-400">Nhóm</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {groupTotal}
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.to}
                className="group rounded-lg border border-gray-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${action.accent}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-semibold text-gray-900">
                        {action.title}
                      </h2>
                      <FiArrowRight
                        size={16}
                        className="text-gray-300 transition group-hover:text-blue-500"
                      />
                    </div>
                    <p className="mt-1 text-sm leading-5 text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </section>

        <section className="mt-6 flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
          <FiShield className="flex-shrink-0 text-gray-400" size={18} />
          Tin nhắn và hoạt động tài khoản của bạn được bảo vệ trong phiên đăng
          nhập hiện tại.
        </section>
      </div>
    </main>
  );
}
