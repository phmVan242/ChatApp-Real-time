package com.example.ChatApp.dto.room;

import com.example.ChatApp.dto.user.UserBasicInfo;
import com.example.ChatApp.entity.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String name;
    private String description;
    private String avatarUrl;
    private RoomType type;
    private UserBasicInfo createdBy;
    private LocalDateTime createdAt;
//    private long memberCount;
}