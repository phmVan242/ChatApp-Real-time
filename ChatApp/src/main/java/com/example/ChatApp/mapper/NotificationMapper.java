package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.notification.CreateNotificationRequest;
import com.example.ChatApp.dto.notification.NotificationResponse;
import com.example.ChatApp.dto.user.UserBasicInfo;
import com.example.ChatApp.entity.Notification;
import com.example.ChatApp.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationMapper {

    public NotificationResponse toResponse(Notification notification) {
        if (notification == null) return null;

        UserBasicInfo userInfo = null;
        if (notification.getUser() != null) {
            userInfo = UserBasicInfo.builder()
                    .id(notification.getUser().getId())
                    .username(notification.getUser().getUsername())
                    .displayName(notification.getUser().getDisplayName())
                    .avatarUrl(notification.getUser().getAvatarUrl())
                    .build();
        }

        UserBasicInfo actorInfo = null;
        if (notification.getActor() != null) {
            actorInfo = UserBasicInfo.builder()
                    .id(notification.getActor().getId())
                    .username(notification.getActor().getUsername())
                    .displayName(notification.getActor().getDisplayName())
                    .avatarUrl(notification.getActor().getAvatarUrl())
                    .build();
        }

        return NotificationResponse.builder()
                .id(notification.getId())
                .user(userInfo)
                .actor(actorInfo)
                .type(notification.getType())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

    public Notification toEntity(CreateNotificationRequest request, User user, User actor) {
        if (request == null) return null;

        return Notification.builder()
                .user(user)
                .actor(actor)
                .type(request.getType())
                .message(request.getMessage())
                .isRead(false)
                .build();
    }
}