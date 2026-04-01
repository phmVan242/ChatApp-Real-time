package com.example.ChatApp.dto;

import com.example.ChatApp.entity.enums.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponse {

    private Long          id;
    private Long          roomId;
    private UserResponse  sender;
    private String        content;         // null nếu isDeleted = true
    private MessageType   type;
    private String        attachmentUrl;   // null nếu isDeleted = true
    private boolean       isDeleted;
    private Long          replyToId;
    private String        replyToContent;  // null nếu replyTo đã bị xóa
    private LocalDateTime createdAt;
}