package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.dto.JwtResponse;
import com.avdhoothadke.citadel.bank.backend.dto.LoginRequest;
import com.avdhoothadke.citadel.bank.backend.dto.RegisterRequest;
import com.avdhoothadke.citadel.bank.backend.entity.PasswordResetToken;
import com.avdhoothadke.citadel.bank.backend.entity.Role;
import com.avdhoothadke.citadel.bank.backend.entity.RoleName;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.PasswordResetTokenRepository;
import com.avdhoothadke.citadel.bank.backend.repository.RoleRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.avdhoothadke.citadel.bank.backend.util.JwtUtils;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
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

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private Authentication authentication;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private ActivityLogService activityLogService;

    @Mock
    private EmailService emailService;

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
        System.out.println("✅testRegisterUser_Success Passed ");

    }

    @Test
    void testRegisterUser_Fail_UsernameTaken() {
        RegisterRequest req = new RegisterRequest();
        req.setUsername("john");
        when(userRepository.existsByUsername("john")).thenReturn(true);

        Exception ex = assertThrows(RuntimeException.class, () -> userService.registerUser(req));
        assertEquals("Username is already taken!", ex.getMessage());
        verify(userRepository, never()).save(any());
        System.out.println("✅testRegisterUser_Fail_UsernameTaken Passed ");

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
        System.out.println("✅testRegisterUser_Fail_EmailTaken Passed ");

    }

    @Test
    void testCreatePasswordResetToken_Success() {
        String email = "john@test.com";
        User user = new User();
        user.setEmail(email);

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        userService.createPasswordResetToken(email);

        verify(passwordResetTokenRepository).save(any(PasswordResetToken.class));
        System.out.println("✅testCreatePasswordResetToken_Success Passed ");

    }

    @Test
    void testCreatePasswordResetToken_UserNotFound() {
        when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

        Exception ex = assertThrows(RuntimeException.class,
                () -> userService.createPasswordResetToken("unknown@test.com"));

        assertEquals("User not found with email: unknown@test.com", ex.getMessage());
        System.out.println("✅testCreatePasswordResetToken_UserNotFound Passed ");

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
        System.out.println("✅testResetPassword_Success Passed ");

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
        System.out.println("✅testResetPassword_Expired Passed ");

    }

    @Test
    void loginUser_Success_ShouldReturnJwtResponse() {
        LoginRequest request = new LoginRequest("testUser", "password123");
        String expectedToken = "mocked-jwt-token";

        when(authentication.getName()).thenReturn("testUser");
        doReturn(List.of(new SimpleGrantedAuthority("ROLE_USER"))).when(authentication).getAuthorities();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        when(jwtUtils.generateJwtToken(authentication)).thenReturn(expectedToken);

        JwtResponse response = userService.loginUser(request);

        assertNotNull(response);
        assertEquals(expectedToken, response.getToken());
        assertEquals("testUser", response.getUsername());
        assertEquals("Bearer", response.getType());

        verify(authenticationManager, times(1)).authenticate(any());
        System.out.println("✅loginUser_Success_ShouldReturnJwtResponse Passed ");

    }

    @Test
    void loginUser_WrongPassword_ShouldThrowException() {
        LoginRequest request = new LoginRequest("testUser", "wrongPassword");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> {
            userService.loginUser(request);
        });

        verify(jwtUtils, never()).generateJwtToken(any());
        System.out.println("✅loginUser_WrongPassword_ShouldThrowException Passed ");

    }
}
