package com.example.ChatApp.dto.room;

import com.example.ChatApp.entity.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomRequest {
    private String name;        // có thể null với PRIVATE
    private String description; // optional
    private RoomType type;      // bắt buộc: PRIVATE hoặc GROUP
    private String avatarUrl;   // có thể null với PRIVATE
}