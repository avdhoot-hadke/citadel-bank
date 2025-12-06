package com.avdhoothadke.citadel.bank.backend.controller;


import com.avdhoothadke.citadel.bank.backend.entity.KycDocument;
import com.avdhoothadke.citadel.bank.backend.service.KycService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/kyc")
public class KycController {

    private final KycService kycService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadKyc(@RequestParam("file") MultipartFile file,
                                       @RequestParam("documentType") String documentType) {
        KycDocument document = kycService.uploadKyc(file, documentType);
        return ResponseEntity.ok("KYC Uploaded. ID: " + document.getId());
    }

    @GetMapping("/status")
    public ResponseEntity<?> getMyKycStatus() {
        KycDocument kyc = kycService.getMyKyc();
        if (kyc == null) {
            return ResponseEntity.ok(Map.of("status", "NOT_SUBMITTED"));
        }
        return ResponseEntity.ok(Map.of("status", kyc.getStatus()));
    }
}
