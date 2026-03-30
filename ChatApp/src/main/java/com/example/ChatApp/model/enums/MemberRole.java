package com.example.ChatApp.model.enums;

public enum MemberRole {
    OWNER,   // tạo phòng, full quyền, không thể bị kick
    ADMIN,   // kick member, đổi tên / avatar phòng
    MEMBER   // chỉ chat
}
