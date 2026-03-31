package com.example.ChatApp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank
    @Size(min=3, max=50)
    public String username;

    @NotBlank @Email
    public String email;

    @NotBlank
    @Size(min=6, max=100)
    public String password;

    public String displayName;
}
