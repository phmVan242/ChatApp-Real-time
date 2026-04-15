package com.example.ChatApp.service;

import com.example.ChatApp.dto.room.RoomResponse;
import com.example.ChatApp.entity.Room;
import com.example.ChatApp.entity.enums.MemberRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomService {

    // Tạo room PRIVATE (1-1) dùng khi kết bạn
    Room createPrivateRoom(Long currentUserId, Long otherUserId);

    // Lấy thông tin room theo ID
    RoomResponse getRoomById(Long roomId);

    // Lấy danh sách tất cả room của user (phân trang)
    Page<RoomResponse> getUserRooms(Long userId, Pageable pageable);

    // Cập nhật thông tin room (tên, mô tả, avatar) - chỉ cho GROUP room
    RoomResponse updateRoomInfo(Long roomId, String name, String description, String avatarUrl, Long currentUserId);

    // Xóa thành viên khỏi room (chỉ admin)
    void removeMember(Long roomId, Long memberId, Long currentUserId);

    // Thay đổi role của thành viên (MEMBER <-> ADMIN)
    void changeMemberRole(Long roomId, Long memberId, MemberRole role, Long currentUserId);

    // Rời khỏi room (current user tự rời)
    void leaveRoom(Long roomId, Long currentUserId);

    // Xóa room (chỉ creator)
    void deleteRoom(Long roomId, Long currentUserId);

    // Tìm kiếm room công khai (GROUP) theo tên (phân trang)
//    Page<RoomResponse> searchPublicRooms(String keyword, Pageable pageable);
}