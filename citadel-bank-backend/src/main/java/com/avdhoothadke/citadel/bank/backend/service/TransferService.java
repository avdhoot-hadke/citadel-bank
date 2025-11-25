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

    @Transactional
    public Transaction performTransfer(TransferRequest request) {
        String username = SecurityUtils.getCurrentUsername();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

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

        sourceAccount.setBalance(sourceAccount.getBalance().subtract(request.getAmount()));
        accountRepository.save(sourceAccount);

        targetAccount.setBalance(targetAccount.getBalance().add(request.getAmount()));
        accountRepository.save(targetAccount);

        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .description(request.getDescription())
                .sourceAccount(sourceAccount)
                .targetAccount(targetAccount)
                .status(TransactionStatus.SUCCESS)
                .timestamp(LocalDateTime.now())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);

        activityLogService.logAction(username, "TRANSFER", "Transferred " + request.getAmount() + " to " + request.getTargetAccountNumber());

        return savedTransaction;
    }
}
