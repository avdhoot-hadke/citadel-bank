package com.avdhoothadke.citadel.bank.backend.controller;

import com.avdhoothadke.citadel.bank.backend.dto.AccountLookupResponse;
import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Map<String, String> request) {
        String type = request.get("accountType");
        return ResponseEntity.ok(accountService.createAccount(type));
    }

    @GetMapping
    public ResponseEntity<List<Account>> getMyAccounts() {
        return ResponseEntity.ok(accountService.getCurrentUserAccounts());
    }

    @GetMapping("/lookup")
    public ResponseEntity<List<AccountLookupResponse>> lookupByEmail(@RequestParam String email) {
        return ResponseEntity.ok(accountService.lookupAccountsByEmail(email));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/deposit")
    public ResponseEntity<Account> deposit(@PathVariable Long id, @RequestBody Map<String, BigDecimal> request) {
        return ResponseEntity.ok(accountService.deposit(id, request.get("amount")));
    }
}
