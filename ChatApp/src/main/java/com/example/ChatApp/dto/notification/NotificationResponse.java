package com.example.ChatApp.dto.notification;

import com.example.ChatApp.dto.user.UserBasicInfo;
import com.example.ChatApp.entity.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private UserBasicInfo user;      // người nhận
    private UserBasicInfo actor;     // người thực hiện hành động (có thể null)
    private NotificationType type;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}