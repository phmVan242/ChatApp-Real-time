package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.FriendRequestResponse;
import com.example.ChatApp.dto.UserBasicInfo;
import com.example.ChatApp.entity.Friendship;
import org.springframework.stereotype.Component;

@Component
public class FriendRequestResponseMapper {

    public FriendRequestResponse toResponse(Friendship friendship) {
        if (friendship == null) return null;

        UserBasicInfo requesterInfo = UserBasicInfo.builder()
                .id(friendship.getRequester().getId())
                .username(friendship.getRequester().getUsername())
                .displayName(friendship.getRequester().getDisplayName())
                .avatarUrl(friendship.getRequester().getAvatarUrl())
                .build();

        UserBasicInfo addresseeInfo = UserBasicInfo.builder()
                .id(friendship.getAddressee().getId())
                .username(friendship.getAddressee().getUsername())
                .displayName(friendship.getAddressee().getDisplayName())
                .avatarUrl(friendship.getAddressee().getAvatarUrl())
                .build();

        return FriendRequestResponse.builder()
                .id(friendship.getId())
                .requester(requesterInfo)
                .addressee(addresseeInfo)
                .roomId(friendship.getRoom() != null ? friendship.getRoom().getId() : null)
                .status(friendship.getStatus())
                .createdAt(friendship.getCreatedAt())
                .build();
    }
}