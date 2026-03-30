package com.example.ChatApp.model;

import com.example.ChatApp.model.enums.FriendshipStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "friendships",
        uniqueConstraints = @UniqueConstraint(
                name        = "uk_friendships_requester_addressee",
                columnNames = {"requester_id", "addressee_id"}
        ),
        indexes = {
                @Index(name = "idx_friendships_requester", columnList = "requester_id"),
                @Index(name = "idx_friendships_addressee", columnList = "addressee_id"),
                @Index(name = "idx_friendships_status",    columnList = "status")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Friendship {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Người gửi lời mời kết bạn */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    /** Người nhận lời mời kết bạn */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "addressee_id", nullable = false)
    private User addressee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private FriendshipStatus status = FriendshipStatus.PENDING;

    /**
     * Room chat 1-1 được tạo tự động khi status → ACCEPTED.
     * Giúp tìm room giữa 2 người mà không cần query phức tạp:
     *   SELECT room_id FROM friendships
     *   WHERE (requester_id=? AND addressee_id=?)
     *      OR (requester_id=? AND addressee_id=?)
     *   AND status = 'ACCEPTED'
     */
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Helper ────────────────────────────────────────────────
    public boolean isAccepted() {
        return status == FriendshipStatus.ACCEPTED;
    }

    public boolean isPending() {
        return status == FriendshipStatus.PENDING;
    }

    /** Kiểm tra 1 user có liên quan đến friendship này không */
    public boolean involves(Long userId) {
        return requester.getId().equals(userId)
                || addressee.getId().equals(userId);
    }

    /** Lấy user còn lại (không phải currentUser) */
    public User getOtherUser(Long currentUserId) {
        return requester.getId().equals(currentUserId) ? addressee : requester;
    }

}
