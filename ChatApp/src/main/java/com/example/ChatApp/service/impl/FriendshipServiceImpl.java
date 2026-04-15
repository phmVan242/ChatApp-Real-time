package com.example.ChatApp.service.impl;

import com.example.ChatApp.dto.user.FriendRequest;
import com.example.ChatApp.dto.user.FriendRequestResponse;
import com.example.ChatApp.dto.user.FriendshipResponse;
import com.example.ChatApp.entity.Friendship;
import com.example.ChatApp.entity.Room;
import com.example.ChatApp.entity.User;
import com.example.ChatApp.entity.enums.FriendshipStatus;
import com.example.ChatApp.exception.ResourceNotFoundException;
import com.example.ChatApp.mapper.FriendRequestResponseMapper;
import com.example.ChatApp.mapper.FriendshipMapper;
import com.example.ChatApp.repository.FriendshipRepository;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.service.FriendshipService;
import com.example.ChatApp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final RoomService roomService;
    private final FriendshipMapper friendshipMapper;
    private final FriendRequestResponseMapper friendRequestResponseMapper;

    @Override
    @Transactional
    public void sendFriendRequest(Long currentUserId, FriendRequest request) {
        if (currentUserId.equals(request.getAddresseeId())) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        User requester = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found"));
        User addressee = userRepository.findById(request.getAddresseeId())
                .orElseThrow(() -> new ResourceNotFoundException("Addressee not found"));

        // Kiểm tra nếu đã tồn tại lời mời (bất kỳ chiều nào) với status PENDING hoặc ACCEPTED
        boolean exists = friendshipRepository.existsByRequesterAndAddresseeAndStatusIn(requester, addressee,
                List.of(FriendshipStatus.PENDING, FriendshipStatus.ACCEPTED));
        if (exists) {
            throw new RuntimeException("Friend request already exists or you are already friends");
        }

        Friendship friendship = Friendship.builder()
                .requester(requester)
                .addressee(addressee)
                .status(FriendshipStatus.PENDING)
                .build();
        friendshipRepository.save(friendship);
    }

    @Override
    @Transactional
    public FriendshipResponse acceptFriendRequest(Long currentUserId, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship not found"));

        if (!friendship.getAddressee().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("You are not the addressee of this request");
        }
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new RuntimeException("Friendship request is not pending");
        }

        // Tạo room PRIVATE giữa hai người dùng (sử dụng RoomService)
        Room privateRoom = roomService.createPrivateRoom(
                friendship.getRequester().getId(),
                friendship.getAddressee().getId()
        );

        // Cập nhật friendship
        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendship.setRoom(privateRoom);
        friendship = friendshipRepository.save(friendship);

        return friendshipMapper.toResponse(friendship);
    }

    @Override
    @Transactional
        public void declineFriendRequest(Long currentUserId, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship not found"));

        if (!friendship.getAddressee().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("You are not the addressee");
        }
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new RuntimeException("Friendship request is not pending");
        }

        friendship.setStatus(FriendshipStatus.DECLINED);
        friendshipRepository.save(friendship);
    }

    @Override
    @Transactional
    public void cancelFriendRequest(Long currentUserId, Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Friendship not found"));

        if (!friendship.getRequester().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("You are not the requester");
        }
        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new RuntimeException("Cannot cancel non-pending request");
        }

        friendshipRepository.delete(friendship);
    }

    @Override
    public Page<FriendshipResponse> getFriends(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return friendshipRepository.findAcceptedFriends(user, pageable)
                .map(friendshipMapper::toResponse);
    }

    @Override
    public Page<FriendRequestResponse> getReceivedRequests(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return friendshipRepository.findByAddresseeAndStatus(user, FriendshipStatus.PENDING, pageable)
                .map(friendRequestResponseMapper::toResponse);
    }

    @Override
    public Page<FriendRequestResponse> getSentRequests(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return friendshipRepository.findByRequesterAndStatus(user, FriendshipStatus.PENDING, pageable)
                .map(friendRequestResponseMapper::toResponse);
    }
}