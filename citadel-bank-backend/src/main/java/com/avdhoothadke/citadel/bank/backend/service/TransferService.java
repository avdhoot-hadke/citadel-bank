package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.dto.TransferRequest;
import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import com.avdhoothadke.citadel.bank.backend.entity.TransactionStatus;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.AccountRepository;
import com.avdhoothadke.citadel.bank.backend.repository.TransactionRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.avdhoothadke.citadel.bank.backend.util.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransferService {
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private final FraudDetectionService fraudDetectionService;
    private final LedgerService ledgerService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Transaction performTransfer(TransferRequest request) {
        String username = SecurityUtils.getCurrentUsername();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPin(), currentUser.getPin())) {
            throw new RuntimeException("Invalid PIN");
        }

        Account sourceAccount = accountRepository.findByAccountNumber(request.getSourceAccountNumber())
                .orElseThrow(() -> new RuntimeException("Source account not found"));

        if (!sourceAccount.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You do not own this source account");
        }

        Account targetAccount = accountRepository.findByAccountNumber(request.getTargetAccountNumber())
                .orElseThrow(() -> new RuntimeException("Target account not found"));

        if (sourceAccount.getAccountNumber().equals(targetAccount.getAccountNumber())) {
            throw new RuntimeException("Cannot transfer to the same account");
        }

        if (sourceAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient funds");
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Transfer amount must be positive");
        }

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .sourceAccount(sourceAccount)
                .targetAccount(targetAccount)
                .status(TransactionStatus.PENDING)
                .timestamp(LocalDateTime.now())
                .build();

        boolean isFraud = fraudDetectionService.checkForFraud(transaction);
        if (isFraud) {
            transaction.setStatus(TransactionStatus.FRAUD_DETECTED);
            transactionRepository.save(transaction);
            throw new RuntimeException("Transfer blocked! Suspicious activity detected.");
        }

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        accountRepository.save(sourceAccount);

        targetAccount.setBalance(targetAccount.getBalance().add(request.getAmount()));
        accountRepository.save(targetAccount);

        transaction.setStatus(TransactionStatus.SUCCESS);

        Transaction savedTransaction = transactionRepository.save(transaction);

        ledgerService.recordTransaction(savedTransaction);

        activityLogService.logAction(username, "TRANSFER", "Transferred " + request.getAmount() + " to " + request.getTargetAccountNumber());

        return savedTransaction;
    }
    public Page<Transaction> getTransactionHistory(Long accountId, Pageable pageable) {
        String username = SecurityUtils.getCurrentUsername();
        User currentUser = userRepository.findByUsername(username).orElseThrow();

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (!account.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized access to account history");
        }

        return transactionRepository.findBySourceAccountIdOrTargetAccountIdOrderByTimestampDesc(
                accountId, accountId, pageable
        );
    }
}
