package com.example.ChatApp.service.impl;

import com.example.ChatApp.dto.CreateNotificationRequest;
import com.example.ChatApp.dto.NotificationResponse;
import com.example.ChatApp.entity.Notification;
import com.example.ChatApp.entity.User;
import com.example.ChatApp.exception.ResourceNotFoundException;
import com.example.ChatApp.mapper.NotificationMapper;
import com.example.ChatApp.repository.NotificationRepository;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.service.NotificationService;
import com.example.ChatApp.websocket.NotificationWebSocketSender;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;
    private final NotificationWebSocketSender webSocketSender; // có thể null nếu không dùng WebSocket

    @Override
    @Transactional
    public NotificationResponse createNotification(CreateNotificationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User actor = null;
        if (request.getActorId() != null) {
            actor = userRepository.findById(request.getActorId())
                    .orElse(null); // actor có thể null
        }

        Notification notification = notificationMapper.toEntity(request, user, actor);
        notification = notificationRepository.save(notification);
        NotificationResponse response = notificationMapper.toResponse(notification);

        // Gửi real-time qua WebSocket
        if (webSocketSender != null) {
            webSocketSender.sendToUser(request.getUserId(), response);
        }

        return response;
    }

    @Override
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable)
                .map(notificationMapper::toResponse);
    }

    @Override
    @Transactional
    public void markAsRead(Long userId, Long notificationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        int updated = notificationRepository.markAsRead(user, notificationId);
        if (updated == 0) {
            throw new RuntimeException("Notification not found or not owned by user");
        }
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        notificationRepository.markAllAsRead(user);
    }

    @Override
    public long getUnreadCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }
}