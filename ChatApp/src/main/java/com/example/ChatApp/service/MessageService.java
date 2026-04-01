package com.example.ChatApp.service;

import com.example.ChatApp.dto.*;

public interface MessageService {

    MessageResponse sendMessage(Long roomId, SendMessageRequest req, String senderUsername);

    MessagePageResponse getMessages(Long roomId, int page, int size);

    void deleteMessage(Long messageId);

    MessageResponse editMessage(Long messageId, EditMessageRequest req);

    void markAsRead(Long roomId, Long messageId);
}