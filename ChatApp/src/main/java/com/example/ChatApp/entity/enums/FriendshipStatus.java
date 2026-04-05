package com.example.ChatApp.entity.enums;

public enum FriendshipStatus {
    PENDING,   // chờ addressee chấp nhận
    DECLINED,
    ACCEPTED,  // đã là bạn bè, room đã được tạo
    BLOCKED,    // addressee đã chặn requester
}
