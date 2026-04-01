package com.example.ChatApp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EditMessageRequest {

    @NotBlank(message = "Nội dung không được để trống")
    @Size(max = 2000, message = "Tin nhắn tối đa 2000 ký tự")
    private String content;
}