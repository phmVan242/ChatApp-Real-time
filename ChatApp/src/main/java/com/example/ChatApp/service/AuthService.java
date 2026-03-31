package com.example.ChatApp.service;

import com.example.ChatApp.dto.RegisterRequest;
import com.example.ChatApp.dto.UserResponse;

public interface AuthService {
    UserResponse createUser(RegisterRequest registerRequest);
}
