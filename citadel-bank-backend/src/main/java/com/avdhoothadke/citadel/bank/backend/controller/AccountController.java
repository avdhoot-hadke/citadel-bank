package com.avdhoothadke.citadel.bank.backend.controller;

import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("api/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Map<String, String> request){
        String type = request.get("accountType");
        return ResponseEntity.ok(accountService.createAccount(type));
    }

    @GetMapping
    public ResponseEntity<List<Account>> getMyAccounts() {
        return ResponseEntity.ok(accountService.getCurrentUserAccounts());
    }

}
