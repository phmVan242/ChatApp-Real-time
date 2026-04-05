package com.example.ChatApp.entity.enums;

public enum NotificationType {
    FRIEND_REQUEST,   // có người gửi lời mời kết bạn
    FRIEND_ACCEPTED,  // lời mời được chấp nhận
    MESSAGE,          // tin nhắn mới (trong room)
    ROOM_INVITE,      // được mời vào phòng nhóm
    SYSTEM            // thông báo hệ thống
}