package com.example.ChatApp.model;

import com.example.ChatApp.model.enums.MemberRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_members",
        uniqueConstraints = @UniqueConstraint(
                name  = "uk_room_members_room_user",
                columnNames = {"room_id", "user_id"}
        ),
        indexes = {
                @Index(name = "idx_room_members_user", columnList = "user_id"),
                @Index(name = "idx_room_members_room", columnList = "room_id")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RoomMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MemberRole role = MemberRole.MEMBER;

    /**
     * ID của tin nhắn cuối cùng user đã đọc trong room này.
     * Dùng để tính unread count:
     *   SELECT COUNT(*) FROM messages
     *   WHERE room_id = ? AND id > last_read_message_id
     *
     * null → chưa đọc tin nào
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_read_message_id")
    private Message lastReadMessage;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false)
    private LocalDateTime joinedAt;

    // ── Helper ────────────────────────────────────────────────
    /**
     * Trả về số tin chưa đọc trong room.
     * Gọi từ Service sau khi query COUNT từ DB,
     * không tính trực tiếp ở đây để tránh N+1.
     */
//    public boolean hasUnread(Long latestMessageId) {
//        if (lastReadMessage == null) return true;
//        return latestMessageId != null && latestMessageId > lastReadMessage.getId();
//    }

}
