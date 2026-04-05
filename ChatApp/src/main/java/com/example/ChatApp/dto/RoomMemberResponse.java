package com.example.ChatApp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomMemberResponse {
    private Long id;
    private Long roomId;
    private Long userId;
    private String role;          // "ADMIN" hoặc "MEMBER"
    private Long lastReadMsgId;
    private LocalDateTime joinedAt;
}