package com.example.ChatApp.service.impl;

import com.example.ChatApp.dto.UserResponse;
import com.example.ChatApp.exception.ResourceNotFoundException;
import com.example.ChatApp.mapper.UserMapper;
import com.example.ChatApp.entity.User;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse createUser(UserResponse dto) {
        User user = userMapper.toEntity(dto);
        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateUser(Long id, UserResponse dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        // update field
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setDisplayName(dto.getDisplayName());
        user.setAvatarUrl(dto.getAvatarUrl());
        user.setLastSeen(dto.getLastSeen());
        user.setStatus(dto.getStatus());

        user = userRepository.save(user);
        return userMapper.toResponse(user);
    }
}