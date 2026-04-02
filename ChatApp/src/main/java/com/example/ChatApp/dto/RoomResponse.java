package com.example.ChatApp.dto;

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
    private Long createdBy;
    private LocalDateTime createdAt;

}