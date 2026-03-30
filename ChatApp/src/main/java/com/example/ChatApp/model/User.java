package com.example.ChatApp.model;

import com.example.ChatApp.model.enums.UserRole;
import com.example.ChatApp.model.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_username", columnList = "username"),
        @Index(name = "idx_users_email",    columnList = "email")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String username;

    @Column(unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "display_name", length = 100)
    private String displayName;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserStatus status = UserStatus.OFFLINE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private UserRole role = UserRole.USER;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RoomMember> roomMemberships = new ArrayList<>();

    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Message> sentMessages = new ArrayList<>();

    @OneToMany(mappedBy = "requester", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Friendship> sentFriendRequests = new ArrayList<>();

    @OneToMany(mappedBy = "addressee", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Friendship> receivedFriendRequests = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Notification> notifications = new ArrayList<>();

}