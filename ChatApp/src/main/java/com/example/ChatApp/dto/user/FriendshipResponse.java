package com.example.ChatApp.dto.user;

import com.example.ChatApp.entity.enums.FriendshipStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendshipResponse {
    private Long id;
    private UserBasicInfo requester;
    private UserBasicInfo addressee;
    private Long roomId;
    private FriendshipStatus status;
    private LocalDateTime createdAt;
}