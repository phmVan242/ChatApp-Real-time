package com.example.ChatApp.repository;

import com.example.ChatApp.entity.Room;
import com.example.ChatApp.entity.User;
import com.example.ChatApp.entity.enums.RoomType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    Page<Room> findByType(RoomType type, Pageable pageable);

    // Lấy tất cả room mà user tham gia (thông qua RoomMember)
    @Query("SELECT r FROM Room r JOIN r.members m WHERE m.user.id = :userId")
    Page<Room> findRoomsByUserId(@Param("userId") Long userId, Pageable pageable);

    // Tìm room PRIVATE giữa 2 người dùng (nếu có)
    @Query("""
    SELECT r FROM Room r
    WHERE r.type = 'PRIVATE'
    AND EXISTS (
        SELECT m1 FROM r.members m1 WHERE m1.user.id = :user1Id
    )
    AND EXISTS (
        SELECT m2 FROM r.members m2 WHERE m2.user.id = :user2Id
    )
""")
    Optional<Room> findPrivateRoomBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}