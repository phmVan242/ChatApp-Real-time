package com.example.ChatApp.dto;

import com.example.ChatApp.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateNotificationRequest {
    private Long userId;        // người nhận
    private Long actorId;       // người hành động (có thể null)
    private NotificationType type;
    private String message;
}