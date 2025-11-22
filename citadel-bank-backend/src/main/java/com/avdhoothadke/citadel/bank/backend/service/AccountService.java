package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.AccountRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.avdhoothadke.citadel.bank.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final UserRepository usesRepository;

    public Account createAccount(String accountType) {
        String username = SecurityUtils.getCurrentUserName();
        User user = usesRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        String accountNumber = String.valueOf((long) (Math.random() * 9000000000L) + 1000000000L);

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .balance(BigDecimal.ZERO)
                .accountType(accountType.toUpperCase())
                .user(user)
                .build();
        return accountRepository.save(account);
    }

    public List<Account> getCurrentUserAccounts() {
        String username = SecurityUtils.getCurrentUserName();
        User user = usesRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return accountRepository.findByUserId(user.getId());
    }
}
