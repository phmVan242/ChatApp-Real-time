package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.RoomResponse;
import com.example.ChatApp.entity.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public RoomResponse toResponse(Room room) {
        if (room == null) return null;

        RoomResponse dto = new RoomResponse();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setDescription(room.getDescription());
        dto.setAvatarUrl(room.getAvatarUrl());
        dto.setType(room.getType());
        dto.setCreatedBy(room.getCreatedBy() != null ? room.getCreatedBy().getId() : null);
        dto.setCreatedAt(room.getCreatedAt());

        return dto;
    }

    public Room toEntity(RoomResponse dto) {
        if (dto == null) return null;

        Room room = new Room();
        room.setId(dto.getId());
        room.setName(dto.getName());
        room.setDescription(dto.getDescription());
        room.setAvatarUrl(dto.getAvatarUrl());
        room.setType(dto.getType());
        room.setCreatedAt(dto.getCreatedAt());

        return room;
    }
}