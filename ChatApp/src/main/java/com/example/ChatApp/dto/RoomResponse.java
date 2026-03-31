package com.example.ChatApp.dto;

import java.time.LocalDateTime;

class RoomResponse {
    public Long            id;
    public String          name;
    public String          description;
    public String          avatarUrl;
    public String          type;
    public int             memberCount;
    public MessageResponse lastMessage;
    public int             unreadCount;
    public LocalDateTime createdAt;
}
