package com.example.ChatApp.entity;

import com.example.ChatApp.entity.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications",
        indexes = {
                // Lấy thông báo của 1 user, chưa đọc lên trước
                @Index(name = "idx_notifications_user_read",
                        columnList = "user_id, is_read, created_at")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Người nhận thông báo */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /**
     * Người thực hiện hành động gây ra thông báo.
     * null với system notification (ví dụ: bảo trì hệ thống)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actor_id")
    private User actor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationType type;

    /** Nội dung hiển thị: "Nguyễn A đã gửi lời mời kết bạn" */
    @Column(nullable = false, length = 255)
    private String message;

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private boolean isRead = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Helper ────────────────────────────────────────────────
    public void markAsRead() {
        this.isRead = true;
    }

}
