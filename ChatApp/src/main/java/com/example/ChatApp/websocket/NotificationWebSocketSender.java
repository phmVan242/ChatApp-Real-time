package com.example.ChatApp.websocket;

import com.example.ChatApp.dto.notification.NotificationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationWebSocketSender {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendToUser(Long userId, NotificationResponse notification) {
        messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/queue/notifications",
                notification
        );
    }
}