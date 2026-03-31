package com.example.ChatApp.service.impl;

import com.example.ChatApp.dto.UserResponse;
import com.example.ChatApp.exception.ResourceNotFoundException;
import com.example.ChatApp.mapper.UserMapper;
import com.example.ChatApp.model.User;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserMapper::mapToUserDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));
        return UserMapper.mapToUserDTO(user);
    }

    @Override
    public UserResponse createUser(UserResponse dto) {
        User user = UserMapper.mapToUser(dto);
        return UserMapper.mapToUserDTO(
                userRepository.save(user)
        );
    }

    @Override
    public UserResponse updateUser(Long id, UserResponse dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id));

        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setDisplayName(dto.getDisplayName());
        user.setAvatarUrl(dto.getAvatarUrl());
        user.setLastSeen(dto.getLastSeen());
        user.setStatus(dto.getStatus());
        user.setCreatedAt(dto.getCreatedAt());

        return UserMapper.mapToUserDTO(
                userRepository.save(user)
        );
    }

}

