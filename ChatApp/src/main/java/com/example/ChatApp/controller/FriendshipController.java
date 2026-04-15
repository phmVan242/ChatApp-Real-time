package com.example.ChatApp.controller;

import com.example.ChatApp.dto.user.FriendRequest;
import com.example.ChatApp.dto.user.FriendRequestResponse;
import com.example.ChatApp.dto.user.FriendshipResponse;
import com.example.ChatApp.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    @PostMapping("/requests")
    public ResponseEntity<Void> sendFriendRequest(
            @AuthenticationPrincipal Long currentUserId,
            @RequestBody FriendRequest request) {
        friendshipService.sendFriendRequest(currentUserId, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/requests/{friendshipId}/accept")
    public ResponseEntity<FriendshipResponse> acceptRequest(
            @AuthenticationPrincipal Long currentUserId,
            @PathVariable Long friendshipId) {
        return ResponseEntity.ok(friendshipService.acceptFriendRequest(currentUserId, friendshipId));
    }

    @PutMapping("/requests/{friendshipId}/decline")
    public ResponseEntity<Void> declineRequest(
            @AuthenticationPrincipal Long currentUserId,
            @PathVariable Long friendshipId) {
        friendshipService.declineFriendRequest(currentUserId, friendshipId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/requests/{friendshipId}")
    public ResponseEntity<Void> cancelRequest(
            @AuthenticationPrincipal Long currentUserId,
            @PathVariable Long friendshipId) {
        friendshipService.cancelFriendRequest(currentUserId, friendshipId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<Page<FriendshipResponse>> getFriends(
            @AuthenticationPrincipal Long currentUserId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(friendshipService.getFriends(currentUserId, pageable));
    }

    @GetMapping("/requests/received")
    public ResponseEntity<Page<FriendRequestResponse>> getReceivedRequests(
            @AuthenticationPrincipal Long currentUserId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(friendshipService.getReceivedRequests(currentUserId, pageable));
    }

    @GetMapping("/requests/sent")
    public ResponseEntity<Page<FriendRequestResponse>> getSentRequests(
            @AuthenticationPrincipal Long currentUserId,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(friendshipService.getSentRequests(currentUserId, pageable));
    }
}