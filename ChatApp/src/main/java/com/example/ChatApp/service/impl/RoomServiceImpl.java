package com.example.ChatApp.service.impl;

import com.example.ChatApp.dto.room.RoomResponse;
import com.example.ChatApp.entity.Room;
import com.example.ChatApp.entity.RoomMember;
import com.example.ChatApp.entity.User;
import com.example.ChatApp.entity.enums.MemberRole;
import com.example.ChatApp.entity.enums.RoomType;
import com.example.ChatApp.exception.ResourceNotFoundException;
import com.example.ChatApp.mapper.RoomMapper;
import com.example.ChatApp.mapper.RoomMemberMapper;
import com.example.ChatApp.repository.RoomMemberRepository;
import com.example.ChatApp.repository.RoomRepository;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final UserRepository userRepository;
    private final RoomMapper roomMapper;
    private final RoomMemberMapper roomMemberMapper;

    // Helper: kiểm tra user có phải admin của room không
    private void checkUserIsAdmin(Long roomId, Long userId) {
        RoomMember member = roomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("User is not in room"));
        if (member.getRole() != MemberRole.ADMIN) {
            throw new ResourceNotFoundException("Only admin can perform this action");
        }
    }

    // Helper: kiểm tra user có trong room không
    private void checkUserInRoom(Long roomId, Long userId) {
        if (!roomMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new ResourceNotFoundException("User is not in room");
        }
    }

    @Override
    @Transactional
    public Room createPrivateRoom(Long currentUserId, Long otherUserId) {
        // Kiểm tra đã tồn tại room PRIVATE giữa hai người chưa
        Optional<Room> existingRoom = roomRepository.findPrivateRoomBetweenUsers(currentUserId, otherUserId);
        if (existingRoom.isPresent()) {
            System.out.println("!!!");
            return existingRoom.get();
        }

        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
        User otherUser = userRepository.findById(otherUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Other user not found"));

        Room room = Room.builder()
                .name(null)
                .description(null)
                .avatarUrl(null)
                .type(RoomType.PRIVATE)
                .createdBy(currentUser)
                .build();
        room = roomRepository.save(room);

        // Thêm cả hai thành viên
        room.addMember(currentUser, MemberRole.MEMBER);
        room.addMember(otherUser, MemberRole.MEMBER);
        room = roomRepository.save(room);

        return room;
    }

    @Override
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        return roomMapper.toResponse(room);
    }

    @Override
    public Page<RoomResponse> getUserRooms(Long userId, Pageable pageable) {
        // Kiểm tra user tồn tại
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found");
        }
        return roomRepository.findRoomsByUserId(userId, pageable)
                .map(roomMapper::toResponse);
    }

    @Override
    @Transactional
    public RoomResponse updateRoomInfo(Long roomId, String name, String description, String avatarUrl, Long currentUserId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Chỉ cho phép cập nhật GROUP room
        if (room.getType() != RoomType.GROUP) {
            throw new IllegalArgumentException("Only GROUP rooms can be updated");
        }

        // Chỉ creator hoặc admin mới được cập nhật? Ở đây cho creator (có thể mở rộng thêm admin)
        if (!room.getCreatedBy().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("Only room creator can update room info");
        }

        room.setName(name);
        room.setDescription(description);
        room.setAvatarUrl(avatarUrl);
        room = roomRepository.save(room);
        return roomMapper.toResponse(room);
    }

    @Override
    @Transactional
    public void removeMember(Long roomId, Long memberId, Long currentUserId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (room.getType() != RoomType.GROUP) {
            throw new IllegalArgumentException("Only GROUP rooms can have members removed");
        }

        checkUserIsAdmin(roomId, currentUserId);

        // Không thể xoá chính mình (dùng leaveRoom để tự rời)
        if (memberId.equals(currentUserId)) {
            throw new IllegalArgumentException("Use leaveRoom to remove yourself");
        }

        RoomMember member = roomMemberRepository.findByRoomIdAndUserId(roomId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        room.getMembers().remove(member);
        roomRepository.save(room);
    }

    @Override
    @Transactional
    public void changeMemberRole(Long roomId, Long memberId, MemberRole role, Long currentUserId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        if (room.getType() != RoomType.GROUP) {
            throw new IllegalArgumentException("Only GROUP rooms have roles");
        }

        checkUserIsAdmin(roomId, currentUserId);

        // Không thể đổi role của chính mình (hoặc có thể cho phép nhưng cẩn thận)
        if (memberId.equals(currentUserId)) {
            throw new IllegalArgumentException("Cannot change your own role");
        }

        RoomMember member = roomMemberRepository.findByRoomIdAndUserId(roomId, memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));
        member.setRole(role);
        roomMemberRepository.save(member);
    }

    @Override
    @Transactional
    public void leaveRoom(Long roomId, Long currentUserId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Kiểm tra user có trong room không
        RoomMember member = roomMemberRepository.findByRoomIdAndUserId(roomId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this room"));

        // Nếu là PRIVATE room, không cho phép rời? Hoặc cho phép rời nhưng sẽ xoá room? Tuỳ logic.
        // Ở đây, với PRIVATE room, nếu một người rời thì room không còn ý nghĩa, có thể xoá luôn.
        if (room.getType() == RoomType.PRIVATE) {
            // Xoá toàn bộ room (cascade xoá member còn lại)
            roomRepository.delete(room);
            return;
        }

        // Với GROUP room: xoá member khỏi room
        room.getMembers().remove(member);
        roomRepository.save(room);

        // Nếu sau khi xoá mà room không còn thành viên nào, có thể xoá room
        if (room.getMembers().isEmpty()) {
            roomRepository.delete(room);
        }
    }

    @Override
    @Transactional
    public void deleteRoom(Long roomId, Long currentUserId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Chỉ creator mới được xoá room
        if (!room.getCreatedBy().getId().equals(currentUserId)) {
            throw new ResourceNotFoundException("Only room creator can delete the room");
        }

        roomRepository.delete(room);
    }

//    @Override
//    public Page<RoomResponse> searchPublicRooms(String keyword, Pageable pageable) {
//        // Tìm kiếm GROUP room theo tên (không phân biệt hoa thường)
//        // Cần thêm method trong RoomRepository
//        return roomRepository.findByTypeAndNameContainingIgnoreCase(RoomType.GROUP, keyword, pageable)
//                .map(roomMapper::toResponse);
//    }
}