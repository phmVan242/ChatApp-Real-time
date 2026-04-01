package com.example.ChatApp.entity.enums;

public enum MessageType {
    TEXT,    // tin nhắn văn bản thường
    IMAGE,   // ảnh — attachmentUrl chứa URL ảnh
    FILE,    // file đính kèm — attachmentUrl chứa URL file
    JOIN,    // system: "X đã vào phòng"
    LEAVE    // system: "X đã rời phòng"
}
