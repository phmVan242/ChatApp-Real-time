package com.example.ChatApp.entity;

import com.example.ChatApp.entity.enums.MemberRole;
import com.example.ChatApp.entity.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "rooms")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // null với PRIVATE room (dùng tên người kia ở frontend)
    @Column(length = 100)
    private String name;

    @Column(length = 500)
    private String description;

    // null với PRIVATE room (dùng avatar người kia ở frontend)
    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoomType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // ── Relationships ─────────────────────────────────────────
    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RoomMember> members = new ArrayList<>();

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    // ── Helper methods ────────────────────────────────────────
    public void addMember(User user, MemberRole role) {
        RoomMember member = RoomMember.builder()
                .room(this)
                .user(user)
                .role(role)
                .build();
        members.add(member);
    }

}
