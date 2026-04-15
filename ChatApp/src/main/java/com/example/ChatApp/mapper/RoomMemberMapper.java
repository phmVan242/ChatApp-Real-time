package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.room.RoomMemberResponse;
import com.example.ChatApp.entity.RoomMember;
import org.springframework.stereotype.Component;

@Component
public class RoomMemberMapper {

    /**
     * Entity → Response DTO
     */
    public RoomMemberResponse toResponse(RoomMember member) {
        if (member == null) return null;

        Long lastReadMsgId = null;
        if (member.getLastReadMessage() != null) {
            lastReadMsgId = member.getLastReadMessage().getId();
        }

        return RoomMemberResponse.builder()
                .id(member.getId())
                .roomId(member.getRoom() != null ? member.getRoom().getId() : null)
                .userId(member.getUser() != null ? member.getUser().getId() : null)
                .role(member.getRole() != null ? member.getRole().name() : null)
                .lastReadMsgId(lastReadMsgId)
                .joinedAt(member.getJoinedAt())
                .build();
    }
}