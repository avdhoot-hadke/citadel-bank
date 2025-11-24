package com.avdhoothadke.citadel.bank.backend.controller;

import com.avdhoothadke.citadel.bank.backend.dto.TransferRequest;
import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import com.avdhoothadke.citadel.bank.backend.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransferService transferService;

    @PostMapping("/transfer")
    public ResponseEntity<Transaction> transferFunds(@RequestBody TransferRequest request) {
        return ResponseEntity.ok(transferService.performTransfer(request));
    }
}
