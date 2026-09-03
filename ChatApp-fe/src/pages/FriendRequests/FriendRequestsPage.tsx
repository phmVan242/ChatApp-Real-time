import { FiUserPlus } from "react-icons/fi";

export default function FriendRequestsPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-gray-50">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-6 py-8">
        <div className="border-b border-gray-200 pb-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <FiUserPlus size={22} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lời mời kết bạn
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Các lời mời kết bạn sẽ hiển thị tại đây khi có dữ liệu từ API.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-400">
          Chưa có lời mời kết bạn nào.
        </div>
      </div>
    </main>
  );
}
