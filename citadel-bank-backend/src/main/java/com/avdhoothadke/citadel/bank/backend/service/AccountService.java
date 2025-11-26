package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.dto.AccountLookupResponse;
import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.AccountRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.avdhoothadke.citadel.bank.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;
    private static final SecureRandom secureRandom = new SecureRandom();

    public Account createAccount(String accountType) {
        String username = SecurityUtils.getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accountNumber;
        boolean isUnique = false;

        do {
            accountNumber = generateAccountNumber();
            if (accountRepository.findByAccountNumber(accountNumber).isEmpty()) isUnique = true;
        } while (!isUnique);

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .balance(BigDecimal.ZERO)
                .accountType(accountType.toUpperCase())
                .user(user)
                .build();

        Account savedAccount = accountRepository.save(account);
        activityLogService.logAction(
                username,
                "ACCOUNT_CREATED",
                "Created " + accountType + " account: " + savedAccount.getAccountNumber()
        );

        return savedAccount;
    }

    private String generateAccountNumber() {
        long number = 1000000000L + (long) (secureRandom.nextDouble() * 9000000000L);
        return String.valueOf(number);
    }

    public List<Account> getCurrentUserAccounts() {
        String username = SecurityUtils.getCurrentUsername();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUserId(user.getId());
    }

    public List<AccountLookupResponse> lookupAccountsByEmail(String email) {
        List<Account> accountList = accountRepository.findAllByUserEmail(email);

        return accountList.stream()
                .map(account -> AccountLookupResponse.builder()
                        .username(account.getUser().getUsername())
                        .accountNumber(account.getAccountNumber())
                        .accountType(account.getAccountType())
                        .build())
                .collect(Collectors.toList());
    }

    public Account deposit(Long accountId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) throw new RuntimeException("Deposit amount must be positive");

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        account.setBalance(account.getBalance().add(amount));

        activityLogService.logAction("SYSTEM", "DEPOSIT", "Deposited " + amount + " to " + account.getAccountNumber());

        return accountRepository.save(account);
    }
}
