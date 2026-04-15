package com.example.ChatApp.controller;

import com.example.ChatApp.dto.room.RoomResponse;
import com.example.ChatApp.dto.room.UpdateRoomRequest;
import com.example.ChatApp.entity.Room;
import com.example.ChatApp.entity.enums.MemberRole;
import com.example.ChatApp.mapper.RoomMapper;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.security.CustomUserDetails;
import com.example.ChatApp.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final RoomMapper roomMapper;

    /**
     * Tạo phòng private (chat 1-1) giữa current user và user khác.
     * POST /api/rooms/private?otherUserId=2
     */
    @PostMapping("/private")
    public ResponseEntity<RoomResponse> createPrivateRoom(
            @RequestParam Long otherUserId,
            @AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = extractUserId(currentUser);
        Room room = roomService.createPrivateRoom(currentUserId, otherUserId);
        return ResponseEntity.ok(roomMapper.toResponse(room));
    }

    /**
     * Lấy thông tin phòng theo ID.
     * GET /api/rooms/{roomId}
     */
    @GetMapping("/{roomId}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long roomId) {
        RoomResponse room = roomService.getRoomById(roomId);
        return ResponseEntity.ok(room);
    }

    /**
     * Lấy danh sách tất cả phòng của current user (phân trang).
     * GET /api/rooms?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<RoomResponse>> getUserRooms(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = extractUserId(currentUser);
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<RoomResponse> rooms = roomService.getUserRooms(currentUserId, pageable);
        return ResponseEntity.ok(rooms);
    }

    /**
     * Cập nhật thông tin phòng (tên, mô tả, avatar).
     * PUT /api/rooms/{roomId}
     */
    @PutMapping("/{roomId}")
    public ResponseEntity<RoomResponse> updateRoomInfo(
            @PathVariable Long roomId,
            @RequestBody UpdateRoomRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = extractUserId(currentUser);
        RoomResponse updated = roomService.updateRoomInfo(
                roomId,
                request.getName(),
                request.getDescription(),
                request.getAvatarUrl(),
                currentUserId
        );
        return ResponseEntity.ok(updated);
    }

    /**
     * Xóa thành viên khỏi phòng (chỉ admin/creator).
     * DELETE /api/rooms/{roomId}/members/{memberId}
     */
    @DeleteMapping("/{roomId}/members/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long roomId,
            @PathVariable Long memberId,
            @AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = extractUserId(currentUser);
        roomService.removeMember(roomId, memberId, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Thay đổi role của thành viên (MEMBER <-> ADMIN).
     * PATCH /api/rooms/{roomId}/members/{memberId}/role?role=ADMIN
     */
    @PatchMapping("/{roomId}/members/{memberId}/role")
    public ResponseEntity<Void> changeMemberRole(
            @PathVariable Long roomId,
            @PathVariable Long memberId,
            @RequestParam MemberRole role,
            @AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = extractUserId(currentUser);
        roomService.changeMemberRole(roomId, memberId, role, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Rời khỏi phòng.
     * POST /api/rooms/{roomId}/leave
     */
    @PostMapping("/{roomId}/leave")
    public ResponseEntity<Void> leaveRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = extractUserId(currentUser);
        roomService.leaveRoom(roomId, currentUserId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Xóa phòng (chỉ creator).
     * DELETE /api/rooms/{roomId}
     */
    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = extractUserId(currentUser);
        roomService.deleteRoom(roomId, currentUserId);
        return ResponseEntity.noContent().build();
    }

    // Helper method lấy userId từ UserDetails
    private Long extractUserId(UserDetails userDetails) {
//        if (userDetails instanceof CustomUserDetails) {
//            return ((CustomUserDetails) userDetails).getId();
//        }
//        throw new RuntimeException("Invalid user details");
        return 9L;
    }
}