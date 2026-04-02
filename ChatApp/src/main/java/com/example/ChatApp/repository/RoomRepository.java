package com.example.ChatApp.repository;

import com.example.ChatApp.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    @Query("SELECT r FROM Room r JOIN r.members m WHERE m.user.id = :userId ORDER BY r.createdAt DESC")
    List<Room> findAllByUserId(@Param("userId") Long userId);

    // Thêm method phân trang (để dùng trong getUserRooms)
    @Query("SELECT r FROM Room r JOIN r.members m WHERE m.user.id = :userId")
    Page<Room> findByMembersUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("""
        SELECT r FROM Room r
        JOIN r.members m1
        JOIN r.members m2
        WHERE r.type = 'PRIVATE'
          AND m1.user.id = :user1Id
          AND m2.user.id = :user2Id
          AND (SELECT COUNT(m) FROM RoomMember m WHERE m.room = r) = 2
    """)
    Optional<Room> findPrivateRoomBetweenUsers(@Param("user1Id") Long user1Id,
                                               @Param("user2Id") Long user2Id);

    @Query("""
        SELECT r FROM Room r
        WHERE r.type = 'GROUP'
          AND LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    """)
    Page<Room> searchGroupRooms(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT COUNT(m) > 0 FROM RoomMember m WHERE m.room.id = :roomId AND m.user.id = :userId")
    boolean isUserInRoom(@Param("roomId") Long roomId, @Param("userId") Long userId);
}