package com.example.ChatApp.service;

import com.example.ChatApp.dto.user.RegisterRequest;
import com.example.ChatApp.dto.user.UserResponse;

public interface AuthService {
    UserResponse createUser(RegisterRequest registerRequest);
}
