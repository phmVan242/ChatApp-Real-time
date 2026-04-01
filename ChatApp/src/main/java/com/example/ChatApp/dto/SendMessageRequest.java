package com.example.ChatApp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {

    @NotBlank(message = "Nội dung tin nhắn không được để trống")
    @Size(max = 2000, message = "Tin nhắn tối đa 2000 ký tự")
    private String content;

    private String type = "TEXT";        // TEXT / IMAGE / FILE

    private String attachmentUrl;        // URL ảnh hoặc file (nullable)

    private Long   replyToId;            // ID tin nhắn được reply (nullable)
}