package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.dto.RegisterRequest;
import com.avdhoothadke.citadel.bank.backend.entity.PasswordResetToken;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.PasswordResetTokenRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;


@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
    }

    @Test
    void testRegisterUser_Success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("junitUser");
        request.setEmail("junit@test.com");
        request.setPassword("password123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("registered successfully")));
        System.out.println("✅Test Passed ");
    }

    @Test
    void testForgotPassword_Success() throws Exception {
        User user = new User();
        user.setUsername("forgotUser");
        user.setEmail("forgot@test.com");
        user.setPassword("encodedPass");
        userRepository.save(user);

        mockMvc.perform(post("/api/auth/forgot-password")
                        .param("email", "forgot@test.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("Check your console for the reset link"));

        assertTrue(tokenRepository.findAll().stream().anyMatch(t -> t.getUser().getEmail().equals("forgot@test.com")));
        System.out.println("✅Test Passed ");

    }

    @Test
    void testResetPassword_Success() throws Exception {
        User user = new User();
        user.setUsername("resetUser");
        user.setEmail("reset@test.com");
        user.setPassword(passwordEncoder.encode("oldPassword"));
        userRepository.save(user);

        String tokenString = "valid-uuid-token";
        PasswordResetToken token = new PasswordResetToken();
        token.setToken(tokenString);
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(1));
        tokenRepository.save(token);

        mockMvc.perform(post("/api/auth/reset-password")
                        .param("token", tokenString)
                        .param("newPassword", "newSecurePassword"))
                .andExpect(status().isOk());

        User updatedUser = userRepository.findByUsername("resetUser").get();
        assertTrue(passwordEncoder.matches("newSecurePassword", updatedUser.getPassword()));
        System.out.println("✅Test Passed ");

    }

}
