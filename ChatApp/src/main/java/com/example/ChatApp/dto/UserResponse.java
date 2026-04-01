package com.example.ChatApp.dto;

import com.example.ChatApp.entity.enums.UserRole;
import com.example.ChatApp.entity.enums.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    public Long          id;
    public String        username;
    public String        email;
    public String        displayName;
    public String        avatarUrl;
    public UserStatus    status;
    public UserRole      role;
    public LocalDateTime lastSeen;
    public LocalDateTime createdAt;
}
