package com.avdhoothadke.citadel.bank.backend.controller;


import com.avdhoothadke.citadel.bank.backend.entity.KycDocument;
import com.avdhoothadke.citadel.bank.backend.service.KycService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
}
