package com.example.ChatApp.service;

import com.example.ChatApp.dto.RoomResponse;
//import com.example.ChatApp.dto.CreateRoomRequest;
//import com.example.ChatApp.dto.AddMemberRequest;
import com.example.ChatApp.entity.enums.MemberRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomService {

    // Tạo phòng mới
//    RoomResponse createRoom(CreateRoomRequest request, Long creatorId);

    // Tạo phòng private (chat 1-1)
    RoomResponse createPrivateRoom(Long user1Id, Long user2Id);

    // Lấy phòng theo ID
    RoomResponse getRoomById(Long roomId);

    // Lấy tất cả phòng của user
    Page<RoomResponse> getUserRooms(Long userId, Pageable pageable);

    // Cập nhật thông tin phòng (tên, avatar, mô tả)
    RoomResponse updateRoomInfo(Long roomId, String name, String description, String avatarUrl, Long userId);

    // Thêm thành viên vào phòng
//    void addMembers(Long roomId, List<AddMemberRequest> members, Long requesterId);

    // Xóa thành viên khỏi phòng
    void removeMember(Long roomId, Long memberId, Long requesterId);

    // Thay đổi role thành viên (MEMBER -> ADMIN)
    void changeMemberRole(Long roomId, Long memberId, MemberRole newRole, Long requesterId);

    // Rời khỏi phòng
    void leaveRoom(Long roomId, Long userId);

    // Xóa phòng (chỉ admin/creator)
    void deleteRoom(Long roomId, Long userId);

    // Tìm kiếm phòng công khai
    Page<RoomResponse> searchPublicRooms(String keyword, Pageable pageable);

    // Lấy danh sách thành viên trong phòng
//    Page<RoomResponse.MemberInfo> getRoomMembers(Long roomId, Pageable pageable);
}