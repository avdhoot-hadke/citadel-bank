package com.avdhoothadke.citadel.bank.backend.controller;

import com.avdhoothadke.citadel.bank.backend.entity.Beneficiary;
import com.avdhoothadke.citadel.bank.backend.service.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/beneficiaries")
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @PostMapping
    public ResponseEntity<Beneficiary> addBeneficiary(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(beneficiaryService.addBeneficiary(
                request.get("name"),
                request.get("accountNumber")
        ));
    }

    @GetMapping
    public ResponseEntity<Page<Beneficiary>> getBeneficiaries(Pageable pageable) {
        return ResponseEntity.ok(beneficiaryService.getMyBeneficiaries(pageable));
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<String> validateOtp(@RequestBody Map<String, String> request) {
        Long id = Long.parseLong(request.get("beneficiaryId"));
        String otp = request.get("otp");
        return ResponseEntity.ok(beneficiaryService.validateOtp(id, otp));
    }
}
