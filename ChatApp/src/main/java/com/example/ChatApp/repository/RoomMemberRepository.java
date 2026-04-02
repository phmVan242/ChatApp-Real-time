package com.example.ChatApp.repository;

import com.example.ChatApp.entity.RoomMember;
import com.example.ChatApp.entity.enums.MemberRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {

    // Tìm membership theo room + user (dùng trong requireMembership)
    Optional<RoomMember> findByRoomIdAndUserId(Long roomId, Long userId);

    // Lấy tất cả room mà user tham gia
    @Query("""
        SELECT rm FROM RoomMember rm
        JOIN FETCH rm.room
        WHERE rm.user.id = :userId
        ORDER BY rm.joinedAt DESC
    """)
    List<RoomMember> findRoomsByUserId(@Param("userId") Long userId);

    // Lấy tất cả member trong room
    @Query("""
        SELECT rm FROM RoomMember rm
        JOIN FETCH rm.user
        WHERE rm.room.id = :roomId
    """)
    List<RoomMember> findMembersByRoomId(@Param("roomId") Long roomId);

    // Kiểm tra user có trong room không
    boolean existsByRoomIdAndUserId(Long roomId, Long userId);

    // Đếm số thành viên trong room
    int countByRoomId(Long roomId);

    // Tìm role của user trong room (ADMIN, MEMBER)
    @Query("""
        SELECT rm.role FROM RoomMember rm
        WHERE rm.room.id = :roomId AND rm.user.id = :userId
    """)
    Optional<MemberRole> findRoleByRoomIdAndUserId(@Param("roomId") Long roomId,
                                                       @Param("userId") Long userId);

    // Lấy lastReadMessageId để tính unread
    @Query("""
        SELECT rm.lastReadMessage.id FROM RoomMember rm
        WHERE rm.room.id = :roomId AND rm.user.id = :userId
    """)
    Optional<Long> findLastReadMessageId(@Param("roomId") Long roomId,
                                         @Param("userId") Long userId);

    @Modifying
    @Query("DELETE FROM RoomMember m WHERE m.room.id = :roomId AND m.user.id = :userId")
    void deleteByRoomIdAndUserId(@Param("roomId") Long roomId, @Param("userId") Long userId);

}