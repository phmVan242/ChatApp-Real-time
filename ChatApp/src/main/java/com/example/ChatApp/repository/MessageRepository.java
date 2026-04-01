package com.example.ChatApp.repository;

import com.example.ChatApp.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MessageRepository extends JpaRepository<Message, Long> {

    /**
     * Load lịch sử chat của 1 room, mới nhất trước.
     * Dùng cho REST API GET /api/rooms/{roomId}/messages
     */
    Page<Message> findByRoomIdOrderByCreatedAtDesc(Long roomId, Pageable pageable);

    /**
     * Đếm tin nhắn chưa đọc trong room.
     * lastReadMessageId = 0 nếu user chưa đọc tin nào.
     */
    @Query("""
        SELECT COUNT(m) FROM Message m
        WHERE m.room.id = :roomId
          AND m.id > :lastReadMessageId
          AND m.isDeleted = false
    """)
    long countUnread(
            @Param("roomId")            Long roomId,
            @Param("lastReadMessageId") Long lastReadMessageId
    );

    /**
     * Tin nhắn cuối cùng của room — dùng cho preview trong danh sách room.
     */
    Optional<Message> findTopByRoomIdOrderByCreatedAtDesc(Long roomId);
}