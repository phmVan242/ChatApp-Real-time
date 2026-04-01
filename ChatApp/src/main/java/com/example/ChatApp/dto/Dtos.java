package com.example.ChatApp.dto;

// ════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;


// Response sau login / register
class AuthResponse {
    public String accessToken;
    public String tokenType = "Bearer";
    public UserResponse user;
}

// Response trả về client — KHÔNG có password


// PUT /api/users/me — chỉ update profile
class UpdateProfileRequest {
    @Size(max=100) public String displayName;
    @Size(max=500) public String avatarUrl;
}

// PUT /api/users/me/password
class ChangePasswordRequest {
    @NotBlank public String currentPassword;
    @NotBlank @Size(min=6) public String newPassword;
}

// ════════════════════════════════════════════════════════════
// ROOM
// ════════════════════════════════════════════════════════════

// POST /api/rooms — tạo group room
class CreateRoomRequest {
    @NotBlank @Size(max=100) public String name;
    @Size(max=500)           public String description;
    public List<Long>        memberIds;   // user IDs được mời vào
}

// Response room (dùng cho list và detail)


// ════════════════════════════════════════════════════════════
// MESSAGE
// ════════════════════════════════════════════════════════════


// ════════════════════════════════════════════════════════════
// FRIENDSHIP
// ════════════════════════════════════════════════════════════

// POST /api/friends/request
class FriendRequest {
    @NotNull
    public Long addresseeId;
}

// Response kết bạn
class FriendResponse {
    public Long         id;
    public UserResponse friend;     // người kia (không phải mình)
    public String       status;     // "PENDING" / "ACCEPTED" / "BLOCKED"
    public Long         roomId;     // room chat 1-1 (null nếu chưa ACCEPTED)
    public LocalDateTime createdAt;
}

// ════════════════════════════════════════════════════════════
// NOTIFICATION
// ════════════════════════════════════════════════════════════

class NotificationResponse {
    public Long          id;
    public UserResponse  actor;      // người thực hiện
    public String        type;
    public String        message;
    public boolean       isRead;
    public LocalDateTime createdAt;
}

// ════════════════════════════════════════════════════════════
// WEBSOCKET — Presence (online/offline)
// ════════════════════════════════════════════════════════════

// Broadcast qua /topic/presence khi user đổi trạng thái
class PresenceEvent {
    public Long   userId;
    public String username;
    public String status;       // "ONLINE" / "OFFLINE"
    public String lastSeen;     // ISO string
}

// Broadcast qua /topic/room/{id} khi join/leave
class RoomEvent {
    public String type;         // "JOIN" / "LEAVE"
    public Long   roomId;
    public Long   userId;
    public String username;
}