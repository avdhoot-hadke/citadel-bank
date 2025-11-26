package com.avdhoothadke.citadel.bank.backend.controller;

import com.avdhoothadke.citadel.bank.backend.entity.FraudAlert;
import com.avdhoothadke.citadel.bank.backend.entity.KycDocument;
import com.avdhoothadke.citadel.bank.backend.entity.KycStatus;
import com.avdhoothadke.citadel.bank.backend.entity.LedgerBlock;
import com.avdhoothadke.citadel.bank.backend.service.FraudDetectionService;
import com.avdhoothadke.citadel.bank.backend.service.KycService;
import com.avdhoothadke.citadel.bank.backend.service.LedgerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final KycService kycService;
    private final FraudDetectionService fraudService;
    private final LedgerService ledgerService;

    @GetMapping("/kyc/pending")
    public ResponseEntity<Page<KycDocument>> getPendingKycs(Pageable pageable) {
        return ResponseEntity.ok(kycService.getPendingKycs(pageable));
    }

    @PostMapping("/kyc/{id}/approve")
    public ResponseEntity<?> approveKyc(@PathVariable Long id) {
        kycService.updateKycStatus(id, KycStatus.APPROVED);
        return ResponseEntity.ok("KYC Approved");
    }

    @PostMapping("/kyc/{id}/reject")
    public ResponseEntity<?> rejectKyc(@PathVariable Long id) {
        kycService.updateKycStatus(id, KycStatus.REJECTED);
        return ResponseEntity.ok("KYC Rejected");
    }

    @GetMapping("/fraud-alerts")
    public ResponseEntity<Page<FraudAlert>> getFraudAlerts(Pageable pageable) {
        return ResponseEntity.ok(fraudService.getFraudAlerts(pageable));
    }

    @GetMapping("/ledger")
    public ResponseEntity<Page<LedgerBlock>> getLedger(Pageable pageable) {
        return ResponseEntity.ok(ledgerService.getLedger(pageable));
    }

    @GetMapping("/ledger/audit")
    public ResponseEntity<String> auditLedger() {
        return ResponseEntity.ok(ledgerService.validateLedgerIntegrity());
    }
}
