package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.dto.RegisterRequest;
import com.avdhoothadke.citadel.bank.backend.entity.PasswordResetToken;
import com.avdhoothadke.citadel.bank.backend.entity.Role;
import com.avdhoothadke.citadel.bank.backend.entity.RoleName;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.PasswordResetTokenRepository;
import com.avdhoothadke.citadel.bank.backend.repository.RoleRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceUnitTest {
    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    void testRegisterUser_Success() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("john");
        req.setEmail("john@test.com");
        req.setPassword("pass");

        Role userRole = new Role(RoleName.ROLE_USER);

        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@test.com")).thenReturn(false);
        when(roleRepository.findByName(RoleName.ROLE_USER)).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode("pass")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        User result = userService.registerUser(req);

        assertNotNull(result);
        assertEquals("encodedPass", result.getPassword());
        assertTrue(result.getRoles().contains(userRole));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void testRegisterUser_Fail_UsernameTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("john");
        when(userRepository.existsByUsername("john")).thenReturn(true);

        Exception ex = assertThrows(RuntimeException.class, () -> userService.registerUser(req));
        assertEquals("Username is already taken!", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void testRegisterUser_Fail_EmailTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("john");
        req.setEmail("john@test.com");

        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(userRepository.existsByEmail("john@test.com")).thenReturn(true);

        Exception ex = assertThrows(RuntimeException.class, () -> userService.registerUser(req));
        assertEquals("Email is already in use!", ex.getMessage());
    }

    @Test
    void testCreatePasswordResetToken_Success() {
        String email = "john@test.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        userService.createPasswordResetToken(email);

        verify(passwordResetTokenRepository).save(any(PasswordResetToken.class));
    }

    @Test
    void testCreatePasswordResetToken_UserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class,
                () -> userService.createPasswordResetToken("unknown@test.com"));

        assertEquals("User not found with email: unknown@test.com", ex.getMessage());
    }

    @Test
    void testResetPassword_Success() {
        String tokenStr = "valid-token";
        User user = new User();
        PasswordResetToken token = new PasswordResetToken();
        token.setToken(tokenStr);
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(1));

        when(passwordResetTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(token));
        when(passwordEncoder.encode("newPass")).thenReturn("encodedNew");

        userService.resetPassword(tokenStr, "newPass");

        assertEquals("encodedNew", user.getPassword());
        verify(userRepository).save(user);
        verify(passwordResetTokenRepository).delete(token);
    }

    @Test
    void testResetPassword_Expired() {
        String tokenStr = "expired-token";
        PasswordResetToken token = new PasswordResetToken();
        token.setExpiryDate(LocalDateTime.now().minusHours(1));

        when(passwordResetTokenRepository.findByToken(tokenStr)).thenReturn(Optional.of(token));

        Exception ex = assertThrows(RuntimeException.class,
                () -> userService.resetPassword(tokenStr, "newPass"));

        assertEquals("Token has expired", ex.getMessage());
    }
}
