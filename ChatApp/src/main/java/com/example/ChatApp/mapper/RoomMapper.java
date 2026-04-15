package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.room.RoomRequest;
import com.example.ChatApp.dto.room.RoomResponse;
import com.example.ChatApp.dto.user.UserBasicInfo;
import com.example.ChatApp.entity.Room;
import com.example.ChatApp.entity.RoomMember;
import com.example.ChatApp.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RoomMapper {

    private final UserMapper userMapper;

    public RoomResponse toResponse(Room room) {
        if (room == null) return null;

        UserBasicInfo createdByInfo = null;
        if (room.getCreatedBy() != null) {
            createdByInfo = UserBasicInfo.builder()
                    .id(room.getCreatedBy().getId())
                    .username(room.getCreatedBy().getUsername())
                    .displayName(room.getCreatedBy().getDisplayName())
                    .avatarUrl(room.getCreatedBy().getAvatarUrl())
                    .build();
        }

        // Map members từ RoomMember entities
        List<UserBasicInfo> memberInfos = null;
        if (room.getMembers() != null) {
            memberInfos = room.getMembers().stream()
                    .map(RoomMember::getUser)
                    .map(user -> UserBasicInfo.builder()
                            .id(user.getId())
                            .username(user.getUsername())
                            .displayName(user.getDisplayName())
                            .avatarUrl(user.getAvatarUrl())
                            .build())
                    .collect(Collectors.toList());
        }

        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .description(room.getDescription())
                .avatarUrl(room.getAvatarUrl())
                .type(room.getType())
                .createdBy(createdByInfo)
                .createdAt(room.getCreatedAt())
                .members(memberInfos)
                .build();
    }

    public Room toEntity(RoomRequest request, User createdByUser) {
        if (request == null) return null;

        return Room.builder()
                .name(request.getName())
                .description(request.getDescription())
                .avatarUrl(request.getAvatarUrl())
                .type(request.getType())
                .createdBy(createdByUser)
                .build();
    }

    public void updateEntity(Room room, RoomRequest request) {
        if (room == null || request == null) return;
        // Chỉ cho phép cập nhật name, description, avatarUrl
        room.setName(request.getName());
        room.setDescription(request.getDescription());
        room.setAvatarUrl(request.getAvatarUrl());
        // Không cho phép thay đổi type, createdBy
    }
}