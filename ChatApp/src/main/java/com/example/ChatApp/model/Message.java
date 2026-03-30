package com.example.ChatApp.model;

import com.example.ChatApp.model.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "messages",
        indexes = {
                // Query lịch sử chat của 1 room theo thứ tự thời gian (dùng nhiều nhất)
                @Index(name = "idx_messages_room_created", columnList = "room_id, created_at"),
                // Query tin nhắn của 1 user
                @Index(name = "idx_messages_sender",       columnList = "sender_id")
        }
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    /**
     * Self-reference để reply tin nhắn.
     * null → tin nhắn thường (không phải reply)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    private Message replyTo;

    @OneToMany(mappedBy = "replyTo")
    @Builder.Default
    private List<Message> replies = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MessageType type = MessageType.TEXT;

    /**
     * URL file/ảnh khi type = IMAGE hoặc FILE.
     * Lưu URL từ Cloudinary / S3 sau khi upload.
     * null khi type = TEXT
     */
    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;

    /**
     * Soft delete — không xóa khỏi DB.
     * UI hiển thị "Tin nhắn đã bị xóa".
     * Content vẫn còn trong DB (có thể dùng cho audit log).
     */
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Validation ────────────────────────────────────────────
    @PrePersist
    public void validate() {
        if (type == MessageType.TEXT && (content == null || content.isBlank())) {
            throw new IllegalStateException("TEXT message phải có content");
        }
        if ((type == MessageType.IMAGE || type == MessageType.FILE)
                && (attachmentUrl == null || attachmentUrl.isBlank())) {
            throw new IllegalStateException("IMAGE/FILE message phải có attachmentUrl");
        }
    }

    // ── Helper ────────────────────────────────────────────────
    /** Đánh dấu xóa mềm */
    public void softDelete() {
        this.isDeleted = true;
        this.content   = null;       // xóa nội dung thực
        this.attachmentUrl = null;
    }

}
