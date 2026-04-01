package com.example.ChatApp.repository;

import com.example.ChatApp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.management.relation.Role;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findUserByUsername(String username);
    Optional<User> findUserById(Long id);
    Optional<User> findUserByRole(Role role);
    Optional<User> findUserByDisplayName(String name);

}
