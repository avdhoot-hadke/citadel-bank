package com.avdhoothadke.citadel.bank.backend.service;

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

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private static final SecureRandom secureRandom = new SecureRandom();

    public Account createAccount(String accountType) {
        String username = SecurityUtils.getCurrentUserName();

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

        return accountRepository.save(account);
    }

    private String generateAccountNumber() {
        long number = 1000000000L + (long) (secureRandom.nextDouble() * 9000000000L);
        return String.valueOf(number);
    }

    public List<Account> getCurrentUserAccounts() {
        String username = SecurityUtils.getCurrentUserName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUserId(user.getId());
    }
}
