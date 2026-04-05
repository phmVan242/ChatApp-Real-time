package com.example.ChatApp.service;

import com.example.ChatApp.dto.CreateNotificationRequest;
import com.example.ChatApp.dto.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {
    NotificationResponse createNotification(CreateNotificationRequest request);
    Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);
    void markAsRead(Long userId, Long notificationId);
    void markAllAsRead(Long userId);
    long getUnreadCount(Long userId);
}