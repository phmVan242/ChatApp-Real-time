package com.example.ChatApp.service;

import com.example.ChatApp.dto.FriendRequest;
import com.example.ChatApp.dto.FriendRequestResponse;
import com.example.ChatApp.dto.FriendshipResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FriendshipService {

    void sendFriendRequest(Long currentUserId, FriendRequest request);
    FriendshipResponse acceptFriendRequest(Long currentUserId, Long friendshipId);
    void declineFriendRequest(Long currentUserId, Long friendshipId);
    void cancelFriendRequest(Long currentUserId, Long friendshipId);
    Page<FriendshipResponse> getFriends(Long userId, Pageable pageable);
    Page<FriendRequestResponse> getReceivedRequests(Long userId, Pageable pageable);
    Page<FriendRequestResponse> getSentRequests(Long userId, Pageable pageable);
}