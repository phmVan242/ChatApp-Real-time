package com.example.ChatApp.repository;

import com.example.ChatApp.entity.Friendship;
import com.example.ChatApp.entity.User;
import com.example.ChatApp.entity.enums.FriendshipStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    // Kiểm tra tồn tại lời mời (cả 2 chiều) với status PENDING hoặc ACCEPTED
    boolean existsByRequesterAndAddresseeAndStatusIn(User requester, User addressee, java.util.Collection<FriendshipStatus> statuses);

    Optional<Friendship> findByRequesterAndAddressee(User requester, User addressee);

    // Lấy danh sách bạn bè đã chấp nhận (userId là 1 trong 2 bên)
    @Query("SELECT f FROM Friendship f WHERE " +
            "(f.requester = :user OR f.addressee = :user) AND f.status = 'ACCEPTED'")
    Page<Friendship> findAcceptedFriends(@Param("user") User user, Pageable pageable);

    // Lời mời đang chờ dành cho user (addressee = user, status = PENDING)
    Page<Friendship> findByAddresseeAndStatus(User user, FriendshipStatus status, Pageable pageable);

    // Lời mời đã gửi bởi user (requester = user, status = PENDING)
    Page<Friendship> findByRequesterAndStatus(User user, FriendshipStatus status, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Friendship f SET f.status = :status WHERE f.id = :friendshipId")
    int updateStatus(@Param("friendshipId") Long friendshipId, @Param("status") FriendshipStatus status);
}