package com.example.ChatApp.service.impl;

import com.example.ChatApp.dto.RegisterRequest;
import com.example.ChatApp.dto.UserResponse;
import com.example.ChatApp.model.User;
import com.example.ChatApp.model.enums.UserRole;
import com.example.ChatApp.model.enums.UserStatus;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public UserResponse createUser(RegisterRequest registerRequest) {
        if(userRepository.findUserByDisplayName(registerRequest.getDisplayName()).isPresent()){
            throw new RuntimeException("User already present with email " + registerRequest.getUsername());
        }
        User user = new User();
        user.setDisplayName(registerRequest.getDisplayName());
        user.setEmail(registerRequest.getEmail());
        user.setPasswordHash(new BCryptPasswordEncoder().encode(registerRequest.getPassword()));
        user.setUsername(registerRequest.getUsername());
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(UserRole.USER);
        user.setAvatarUrl(null);
        user.setLastSeen(null);
        user.setStatus(UserStatus.ONLINE);

        User newUser = userRepository.save(user);
        return null;
    }


}
