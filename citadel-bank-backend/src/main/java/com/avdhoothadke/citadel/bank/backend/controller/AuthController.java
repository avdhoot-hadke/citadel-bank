package com.avdhoothadke.citadel.bank.backend.controller;

import com.avdhoothadke.citadel.bank.backend.dto.RegisterRequest;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        User user = userService.registerUser(request);
        return ResponseEntity.ok("User registered successfully: " + user.getUsername());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        userService.createPasswordResetToken(email);
        return ResponseEntity.ok("Check your console for the reset link");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password reset successfully");
    }
}
