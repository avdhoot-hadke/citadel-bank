package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.dto.TransactionDTO;
import com.avdhoothadke.citadel.bank.backend.dto.TransferRequest;
import com.avdhoothadke.citadel.bank.backend.entity.*;
import com.avdhoothadke.citadel.bank.backend.repository.AccountRepository;
import com.avdhoothadke.citadel.bank.backend.repository.TransactionRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.avdhoothadke.citadel.bank.backend.util.SecurityUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransferServiceTest {

    @Mock private AccountRepository accountRepository;
    @Mock private TransactionRepository transactionRepository;
    @Mock private UserRepository userRepository;
    @Mock private ActivityLogService activityLogService;
    @Mock private FraudDetectionService fraudDetectionService;
    @Mock private LedgerService ledgerService;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private TransferService transferService;

    private MockedStatic<SecurityUtils> securityUtilsMock;

    @BeforeEach
    void setUp() {
        securityUtilsMock = mockStatic(SecurityUtils.class);
    }

    @AfterEach
    void tearDown() {
        securityUtilsMock.close();
    }

    @Test
    void shouldTransferFundsSuccessfully() {
        String username = "john_doe";
        TransferRequest request = new TransferRequest();
        request.setSourceAccountNumber("1111");
        request.setTargetAccountNumber("2222");
        request.setAmount(new BigDecimal("100.00"));
        request.setDescription("Test Transfer");
        request.setPin("1234"); // <--- ADD PIN

        // User setup with PIN
        User user = User.builder()
                .id(1L)
                .username(username)
                .pin("encoded_pin") // <--- User needs a PIN in DB
                .build();

        Account source = Account.builder().id(1L).accountNumber("1111").balance(new BigDecimal("500.00")).user(user).build();
        Account target = Account.builder().id(2L).accountNumber("2222").balance(new BigDecimal("100.00")).user(new User()).build();

        securityUtilsMock.when(SecurityUtils::getCurrentUsername).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));

        when(passwordEncoder.matches(any(), any())).thenReturn(true);

        when(accountRepository.findByAccountNumber("1111")).thenReturn(Optional.of(source));
        when(accountRepository.findByAccountNumber("2222")).thenReturn(Optional.of(target));
        when(fraudDetectionService.checkForFraud(any())).thenReturn(false);

        when(transactionRepository.save(any(Transaction.class))).thenAnswer(i -> {
            Transaction t = i.getArgument(0);
            t.setId(100L);
            t.setStatus(TransactionStatus.SUCCESS);
            t.setTimestamp(LocalDateTime.now());
            return t;
        });

        TransactionDTO result = transferService.performTransfer(request);

        assertEquals("SUCCESS", result.getStatus());
        assertEquals(new BigDecimal("400.00"), source.getBalance());
        assertEquals(new BigDecimal("200.00"), target.getBalance());

        verify(ledgerService, times(1)).recordTransaction(any());
        verify(activityLogService, times(1)).logAction(anyString(), anyString(), anyString());

        System.out.println("✅ shouldTransferFundsSuccessfully Passed ");
    }

    @Test
    void shouldFail_WhenInsufficientFunds() {
        String username = "john_doe";
        TransferRequest request = new TransferRequest();
        request.setSourceAccountNumber("1111");
        request.setTargetAccountNumber("2222");
        request.setAmount(new BigDecimal("1000.00"));
        request.setPin("1234");

        User user = User.builder().id(1L).username(username).pin("encoded").build();
        Account source = Account.builder().id(1L).accountNumber("1111").balance(new BigDecimal("500.00")).user(user).build();
        Account target = Account.builder().id(2L).accountNumber("2222").balance(new BigDecimal("100.00")).build();

        securityUtilsMock.when(SecurityUtils::getCurrentUsername).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(true);
        when(accountRepository.findByAccountNumber("1111")).thenReturn(Optional.of(source));
        when(accountRepository.findByAccountNumber("2222")).thenReturn(Optional.of(target));

        Exception exception = assertThrows(RuntimeException.class, () -> transferService.performTransfer(request));
        assertEquals("Insufficient funds", exception.getMessage());

        assertEquals(new BigDecimal("500.00"), source.getBalance());
        verify(transactionRepository, never()).save(any());

        System.out.println("✅ shouldFail_WhenInsufficientFunds Passed ");
    }

    @Test
    void shouldFail_WhenTransferToSelf() {
        String username = "john_doe";
        TransferRequest request = new TransferRequest();
        request.setSourceAccountNumber("1111");
        request.setTargetAccountNumber("1111");
        request.setAmount(new BigDecimal("100.00"));
        request.setPin("1234");

        User user = User.builder().id(1L).username(username).pin("encoded").build();
        Account source = Account.builder().id(1L).accountNumber("1111").user(user).build();

        securityUtilsMock.when(SecurityUtils::getCurrentUsername).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(true); // Bypass PIN
        when(accountRepository.findByAccountNumber("1111")).thenReturn(Optional.of(source));

        when(accountRepository.findByAccountNumber("1111")).thenReturn(Optional.of(source));

        Exception exception = assertThrows(RuntimeException.class, () -> transferService.performTransfer(request));
        assertEquals("Cannot transfer to the same account", exception.getMessage());

        System.out.println("✅ shouldFail_WhenTransferToSelf Passed ");
    }

    @Test
    void shouldFail_WhenFraudDetected() {
        String username = "john_doe";
        TransferRequest request = new TransferRequest();
        request.setSourceAccountNumber("1111");
        request.setTargetAccountNumber("2222");
        request.setAmount(new BigDecimal("500000.00"));
        request.setPin("1234");

        User user = User.builder().id(1L).username(username).pin("encoded").build();
        Account source = Account.builder().id(1L).accountNumber("1111").balance(new BigDecimal("1000000.00")).user(user).build();
        Account target = Account.builder().id(2L).accountNumber("2222").user(new User()).build();

        securityUtilsMock.when(SecurityUtils::getCurrentUsername).thenReturn(username);
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(any(), any())).thenReturn(true); // Bypass PIN
        when(accountRepository.findByAccountNumber("1111")).thenReturn(Optional.of(source));
        when(accountRepository.findByAccountNumber("2222")).thenReturn(Optional.of(target));

        when(fraudDetectionService.checkForFraud(any())).thenReturn(true);

        Exception exception = assertThrows(RuntimeException.class, () -> transferService.performTransfer(request));
        assertEquals("Transfer blocked! Suspicious activity detected.", exception.getMessage());

        verify(transactionRepository, times(1)).save(any());

        System.out.println("✅ shouldFail_WhenFraudDetected Passed ");
    }
}