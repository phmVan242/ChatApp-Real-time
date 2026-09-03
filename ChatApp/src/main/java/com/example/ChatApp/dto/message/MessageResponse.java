package com.example.ChatApp.dto.message;

import com.example.ChatApp.entity.enums.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private Long id;
    private Long roomId;

    private Long senderId;
    private String senderName;
    private String senderAvatar;

    private String content;
    private MessageType type;
    private String attachmentUrl;
    private boolean isDeleted;

    private Long replyToId;
    private String replyToContent;

    private LocalDateTime createdAt;
}