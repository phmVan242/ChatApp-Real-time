package com.example.ChatApp.controller;

import com.example.ChatApp.dto.UserResponse;
import com.example.ChatApp.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/api/users")
@Slf4j
public class UserController {

    private UserService userService;

//    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Tạo User mới
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserResponse userDto) {
        UserResponse savedUser = userService.createUser(userDto);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // Cập nhật User
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable long id, @RequestBody UserResponse updatedUser) {
        UserResponse userDto = userService.updateUser(id,updatedUser);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable long id) {
        UserResponse savedUser = userService.getUserById(id);
        return ResponseEntity.ok(savedUser);
    }

}
