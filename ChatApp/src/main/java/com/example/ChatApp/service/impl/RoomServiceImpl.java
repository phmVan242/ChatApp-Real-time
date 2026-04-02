package com.example.ChatApp.service.impl;

import com.example.ChatApp.dto.RoomResponse;
import com.example.ChatApp.entity.Room;
import com.example.ChatApp.entity.RoomMember;
import com.example.ChatApp.entity.User;
import com.example.ChatApp.entity.enums.MemberRole;
import com.example.ChatApp.entity.enums.RoomType;
import com.example.ChatApp.mapper.RoomMapper;
import com.example.ChatApp.repository.RoomMemberRepository;
import com.example.ChatApp.repository.RoomRepository;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomMapper roomMapper;

    @Override
    public RoomResponse createPrivateRoom(Long user1Id, Long user2Id) {
        return roomRepository.findPrivateRoomBetweenUsers(user1Id, user2Id)
                .map(roomMapper::toResponse)
                .orElseGet(() -> {
                    User user1 = userRepository.findById(user1Id)
                            .orElseThrow(() -> new RuntimeException("User not found: " + user1Id));
                    User user2 = userRepository.findById(user2Id)
                            .orElseThrow(() -> new RuntimeException("User not found: " + user2Id));

                    Room room = Room.builder()
                            .type(RoomType.PRIVATE)
                            .createdBy(user1)
                            .build();
                    Room savedRoom = roomRepository.save(room);

                    RoomMember member1 = RoomMember.builder()
                            .room(savedRoom)
                            .user(user1)
                            .role(MemberRole.MEMBER)
                            .build();
                    RoomMember member2 = RoomMember.builder()
                            .room(savedRoom)
                            .user(user2)
                            .role(MemberRole.MEMBER)
                            .build();
                    roomMemberRepository.saveAll(List.of(member1, member2));

                    return roomMapper.toResponse(savedRoom);
                });
    }

    @Override
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
        return roomMapper.toResponse(room);
    }

    @Override
    public Page<RoomResponse> getUserRooms(Long userId, Pageable pageable) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found: " + userId);
        }
        Page<Room> roomPage = roomRepository.findByMembersUserId(userId, pageable);
        return roomPage.map(roomMapper::toResponse);
    }

    @Override
    public RoomResponse updateRoomInfo(Long roomId, String name, String description, String avatarUrl, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        if (!room.getCreatedBy().getId().equals(userId) && !isAdminInRoom(roomId, userId)) {
            throw new RuntimeException("Only creator or admin can update room info");
        }

        if (name != null) room.setName(name);
        if (description != null) room.setDescription(description);
        if (avatarUrl != null) room.setAvatarUrl(avatarUrl);

        Room updated = roomRepository.save(room);
        return roomMapper.toResponse(updated);
    }

    @Override
    public void removeMember(Long roomId, Long memberId, Long requesterId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        if (room.getCreatedBy().getId().equals(memberId)) {
            throw new RuntimeException("Cannot remove room creator");
        }
        if (!room.getCreatedBy().getId().equals(requesterId) && !isAdminInRoom(roomId, requesterId)) {
            throw new RuntimeException("Only admin or creator can remove members");
        }

        roomMemberRepository.deleteByRoomIdAndUserId(roomId, memberId);
    }

    @Override
    public void changeMemberRole(Long roomId, Long memberId, MemberRole newRole, Long requesterId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        if (!room.getCreatedBy().getId().equals(requesterId) && !isAdminInRoom(roomId, requesterId)) {
            throw new RuntimeException("Only creator or admin can change member roles");
        }

        RoomMember member = roomMemberRepository.findByRoomIdAndUserId(roomId, memberId)
                .orElseThrow(() -> new RuntimeException("Member not found in room"));
        member.setRole(newRole);
        roomMemberRepository.save(member);
    }

    @Override
    public void leaveRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));

        if (!roomRepository.isUserInRoom(roomId, userId)) {
            throw new RuntimeException("User is not a member of this room");
        }
        if (room.getCreatedBy().getId().equals(userId) && roomMemberRepository.countByRoomId(roomId) > 1) {
            throw new RuntimeException("Creator cannot leave room with other members. Transfer ownership or delete room.");
        }

        roomMemberRepository.deleteByRoomIdAndUserId(roomId, userId);
        if (roomMemberRepository.countByRoomId(roomId) == 0) {
            roomRepository.delete(room);
        }
    }

    @Override
    public void deleteRoom(Long roomId, Long userId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found: " + roomId));
        if (!room.getCreatedBy().getId().equals(userId)) {
            throw new RuntimeException("Only creator can delete the room");
        }
        roomRepository.delete(room);
    }

    @Override
    public Page<RoomResponse> searchPublicRooms(String keyword, Pageable pageable) {
        Page<Room> roomPage = roomRepository.searchGroupRooms(keyword, pageable);
        return roomPage.map(roomMapper::toResponse);
    }

    private boolean isAdminInRoom(Long roomId, Long userId) {
        return roomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .map(member -> member.getRole() == MemberRole.ADMIN)
                .orElse(false);
    }
}