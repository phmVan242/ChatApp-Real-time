package com.example.ChatApp.controller;

import com.example.ChatApp.dto.LoginRequest;
import com.example.ChatApp.dto.RegisterRequest;
import com.example.ChatApp.dto.UserResponse;
import com.example.ChatApp.model.User;
import com.example.ChatApp.repository.UserRepository;
import com.example.ChatApp.service.AuthService;
import com.example.ChatApp.util.JwtUtil;
import jakarta.persistence.EntityExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> signupUser(@RequestBody RegisterRequest registerRequest){
        try{
            UserResponse createdUser = authService.createUser(registerRequest);
            return new ResponseEntity<>(createdUser, HttpStatus.OK);
        } catch (EntityExistsException entityExistsException){
            return new ResponseEntity<>("User already exist", HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e){
            return new ResponseEntity<>("User are not created, come again later", HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest){
        try{
            User user = userRepository.findUserByUsername(loginRequest.getUsername())
                    .orElseThrow(() -> new RuntimeException("Invalid username or password"));

            if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
                throw new RuntimeException("Invalid username or password");
            }
            String token = JwtUtil.generateToken(loginRequest.getUsername(), user.getRole().toString());

            return ResponseEntity.ok(
                    Map.of(
                            "token", token,
                            "username", user.getUsername(),
                            "role", user.getRole()
                    )
            );
        } catch (EntityExistsException entityExistsException){
            return new ResponseEntity<>("User already exist", HttpStatus.NOT_ACCEPTABLE);
        } catch (Exception e){
            return new ResponseEntity<>("User are not created, come again later", HttpStatus.BAD_REQUEST);
        }
    }

}
