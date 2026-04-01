package com.example.ChatApp.entity.enums;

public enum NotificationType {
    FRIEND_REQUEST,   // X gửi lời mời kết bạn
    FRIEND_ACCEPTED,  // X chấp nhận lời mời kết bạn
    ROOM_INVITE,      // X mời bạn vào phòng chat
    MENTION,          // X nhắc đến bạn (@username) trong tin nhắn
    SYSTEM            // thông báo hệ thống
}
