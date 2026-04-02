package com.example.ChatApp.controller;

import com.example.ChatApp.dto.RoomResponse;
import com.example.ChatApp.entity.enums.MemberRole;
import com.example.ChatApp.service.RoomService;
import jakarta.validation.constraints.NotBlank;
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

    /**
     * Tạo phòng private (chat 1-1) giữa current user và user khác.
     * POST /api/rooms/private?otherUserId=2
     */
    @PostMapping("/private")
    public ResponseEntity<RoomResponse> createPrivateRoom(
            @RequestParam Long otherUserId,
            @AuthenticationPrincipal UserDetails currentUser) {
        Long currentUserId = extractUserId(currentUser);
        RoomResponse room = roomService.createPrivateRoom(currentUserId, otherUserId);
        return ResponseEntity.ok(room);
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

    /**
     * Tìm kiếm phòng công khai (GROUP) theo tên.
     * GET /api/rooms/search?keyword=java&page=0&size=10
     */
    @GetMapping("/search")
    public ResponseEntity<Page<RoomResponse>> searchPublicRooms(
            @RequestParam @NotBlank String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<RoomResponse> rooms = roomService.searchPublicRooms(keyword, pageable);
        return ResponseEntity.ok(rooms);
    }

    // Helper method lấy userId từ UserDetails
    // Bạn cần custom UserDetails để chứa id, hoặc tạm thời dùng username để tìm user
    private Long extractUserId(UserDetails userDetails) {
        // Giả định username là email hoặc tên đăng nhập, bạn cần query UserRepository để lấy id
        // Ở đây demo trả về 1L. Thực tế nên có CustomUserDetails chứa id.
        // Ví dụ: ((CustomUserDetails) userDetails).getId();
        return 1L; // TODO: thay bằng logic thật
    }
}

// Request DTO cho cập nhật phòng
class UpdateRoomRequest {
    private String name;
    private String description;
    private String avatarUrl;

    // Getters & setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}