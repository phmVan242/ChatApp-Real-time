// src/components/chat/InfoPanel.tsx

import React, { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiBell,
  FiBellOff,
  FiSearch,
  FiImage,
  FiLink,
  FiFile,
  FiUserPlus,
  FiAlertCircle,
  FiEdit3,
  FiStar,
  FiSmile,
} from "react-icons/fi";
import { BsPin } from "react-icons/bs";
import { RoomResponse } from "../../api/ApiService";

interface InfoPanelProps {
  room: RoomResponse;
  currentUserId: number;
}

const THEMES = [
  { color: "bg-blue-500", label: "Xanh dương" },
  { color: "bg-purple-500", label: "Tím" },
  { color: "bg-green-500", label: "Xanh lá" },
  { color: "bg-red-500", label: "Đỏ" },
  { color: "bg-orange-500", label: "Cam" },
  { color: "bg-pink-500", label: "Hồng" },
];

interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

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

      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
};

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition"
  >
    <span className="w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 flex items-center justify-center">
      {icon}
    </span>

    {label}
  </button>
);

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  danger?: boolean;
}

const InfoRow: React.FC<InfoRowProps> = ({
  icon,
  label,
  onClick,
  danger,
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full py-2 px-1 rounded-lg hover:bg-gray-50 transition text-left ${
      danger ? "text-red-500" : "text-gray-700"
    }`}
  >
    <span
      className={`w-5 flex items-center justify-center ${
        danger ? "text-red-400" : "text-gray-500"
      }`}
    >
      {icon}
    </span>

    <span className="text-sm">{label}</span>
  </button>
);

const InfoPanel: React.FC<InfoPanelProps> = ({
  room,
  currentUserId,
}) => {
  const [muted, setMuted] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(0);

  const isGroup = room.type === "GROUP";

  const otherUser =
    room.members.find((m) => m.id !== currentUserId) ||
    room.members[0];

  const displayName = isGroup
    ? room.name || "Nhóm chat"
    : otherUser?.displayName || "Người dùng";

  const avatarUrl = isGroup
    ? room.avatarUrl
    : otherUser?.avatarUrl;

  return (
    <div className="w-80 flex-shrink-0 flex flex-col bg-white border-l border-gray-200 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-gray-100">
        <img
          src={avatarUrl || "/default-avatar.png"}
          alt={displayName}
          className="w-20 h-20 rounded-full object-cover border"
        />

        <h3 className="mt-3 font-bold text-gray-900 text-center">
          {displayName}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {isGroup
            ? `${room.members.length} thành viên`
            : "Đang hoạt động"}
        </p>

        {/* Quick Actions */}
        <div className="flex gap-4 mt-4">
          <QuickAction
            icon={<FiSearch size={16} />}
            label="Tìm kiếm"
          />

          <QuickAction
            icon={
              muted ? (
                <FiBellOff size={16} />
              ) : (
                <FiBell size={16} />
              )
            }
            label={muted ? "Bật âm" : "Tắt âm"}
            onClick={() => setMuted((prev) => !prev)}
          />

          {isGroup && (
            <QuickAction
              icon={<FiUserPlus size={16} />}
              label="Thêm"
            />
          )}
        </div>
      </div>

      <div className="flex-1">
        {/* Customize */}
        <Section
          title="Tùy chỉnh đoạn chat"
          defaultOpen
        >
          <div className="space-y-3">
            <InfoRow
              icon={<FiEdit3 size={15} />}
              label="Đổi tên đoạn chat"
            />

            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <FiSmile size={14} />
                Emoji mặc định
              </p>

              <div className="text-2xl">👍</div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-2">
                Chủ đề màu sắc
              </p>

              <div className="flex gap-2">
                {THEMES.map((theme, index) => (
                  <button
                    key={index}
                    title={theme.label}
                    onClick={() =>
                      setSelectedTheme(index)
                    }
                    className={`w-6 h-6 rounded-full ${
                      theme.color
                    } ${
                      selectedTheme === index
                        ? "ring-2 ring-offset-2 ring-gray-400"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Pinned */}
        <Section title="Tin nhắn đã ghim">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BsPin size={14} />
            <span>Chưa có tin nhắn ghim</span>
          </div>
        </Section>

        {/* Members */}
        {isGroup && (
          <Section
            title={`Thành viên (${room.members.length})`}
            defaultOpen
          >
            <div className="space-y-2">
              {room.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3"
                >
                  <img
                    src={
                      member.avatarUrl ||
                      "/default-avatar.png"
                    }
                    alt={member.displayName}
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {member.displayName}
                    </p>

                    <p className="text-xs text-gray-400">
                      Thành viên
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Media */}
        <Section title="Ảnh & File">
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg bg-gray-100"
              />
            ))}
          </div>

          <button className="text-xs text-blue-500 hover:text-blue-600 mt-2">
            Xem tất cả
          </button>
        </Section>

        {/* Shared */}
        <Section title="Liên kết & Tệp">
          <div className="space-y-1">
            <InfoRow
              icon={<FiLink size={14} />}
              label="Liên kết đã chia sẻ"
            />

            <InfoRow
              icon={<FiFile size={14} />}
              label="Tệp đính kèm"
            />

            <InfoRow
              icon={<FiImage size={14} />}
              label="Ảnh đã chia sẻ"
            />

            <InfoRow
              icon={<FiStar size={14} />}
              label="Tin nhắn đã ghim"
            />
          </div>
        </Section>

        {/* Privacy */}
        <Section title="Quyền riêng tư & Hỗ trợ">
          <div className="space-y-1">
            <InfoRow
              icon={
                muted ? (
                  <FiBellOff size={14} />
                ) : (
                  <FiBell size={14} />
                )
              }
              label={
                muted
                  ? "Bật thông báo"
                  : "Tắt thông báo"
              }
              onClick={() =>
                setMuted((prev) => !prev)
              }
            />

            <InfoRow
              icon={<FiAlertCircle size={14} />}
              label="Chặn người dùng"
              danger
            />

            <InfoRow
              icon={<FiAlertCircle size={14} />}
              label="Báo cáo"
              danger
            />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default InfoPanel;