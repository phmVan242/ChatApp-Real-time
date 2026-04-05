package com.example.ChatApp.mapper;

import com.example.ChatApp.dto.FriendshipResponse;
import com.example.ChatApp.dto.UserBasicInfo;
import com.example.ChatApp.entity.Friendship;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class FriendshipMapper {

    private final UserMapper userMapper;

    public FriendshipResponse toResponse(Friendship friendship) {
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

        return FriendshipResponse.builder()
                .id(friendship.getId())
                .requester(requesterInfo)
                .addressee(addresseeInfo)
                .roomId(friendship.getRoom() != null ? friendship.getRoom().getId() : null)
                .status(friendship.getStatus())
                .createdAt(friendship.getCreatedAt())
                .build();
    }
}