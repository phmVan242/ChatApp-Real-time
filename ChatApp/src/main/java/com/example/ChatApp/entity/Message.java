package com.example.ChatApp.entity;

import com.example.ChatApp.entity.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_messages_room_created", columnList = "room_id, created_at"),
        @Index(name = "idx_messages_sender",       columnList = "sender_id")
})
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_id")
    private Message replyTo;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MessageType type = MessageType.TEXT;

    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;

    // Null nếu chưa từng sửa
    @Column(name = "edited_at")
    private LocalDateTime editedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Business methods ──────────────────────────────────────

    public void softDelete() {
        this.isDeleted     = true;
        this.content       = null;
        this.attachmentUrl = null;
    }

    public void edit(String newContent) {
        if (this.isDeleted) {
            throw new IllegalStateException("Không thể sửa tin nhắn đã bị xóa");
        }
        this.content  = newContent;
        this.editedAt = LocalDateTime.now();
    }
}