package com.avdhoothadke.citadel.bank.backend.controller;

import com.avdhoothadke.citadel.bank.backend.dto.TransactionDTO;
import com.avdhoothadke.citadel.bank.backend.dto.TransferRequest;
import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import com.avdhoothadke.citadel.bank.backend.service.TransferService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/transactions")
public class TransactionController {
    private final TransferService transferService;

    @PostMapping("/transfer")
    public ResponseEntity<TransactionDTO> transferFunds(@RequestBody TransferRequest request) {
        return ResponseEntity.ok(transferService.performTransfer(request));
    }

    @GetMapping("/history")
    public ResponseEntity<Page<TransactionDTO>> getTransactionHistory(Pageable pageable) {
        return ResponseEntity.ok(transferService.getTransactionHistory(pageable));
    }
}
