package com.example.ChatApp.service;

import com.example.ChatApp.dto.user.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse createUser(UserResponse dto);

    UserResponse updateUser(Long id, UserResponse dto);

    UserResponse getMyInfor();


}
