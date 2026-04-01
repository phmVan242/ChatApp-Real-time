package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.UserResponse;
import com.example.ChatApp.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * Entity → Response DTO
     */
    public UserResponse toResponse(User user) {
        if (user == null) return null;

        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setDisplayName(user.getDisplayName());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setLastSeen(user.getLastSeen());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());

        return dto;
    }

    /**
     * Response DTO → Entity
     */
    public User toEntity(UserResponse dto) {
        if (dto == null) return null;

        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setDisplayName(dto.getDisplayName());
        user.setAvatarUrl(dto.getAvatarUrl());
        user.setLastSeen(dto.getLastSeen());
        user.setStatus(dto.getStatus());
        user.setCreatedAt(dto.getCreatedAt());

        return user;
    }
}