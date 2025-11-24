package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.entity.Beneficiary;
import com.avdhoothadke.citadel.bank.backend.entity.OtpVerification;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.AccountRepository;
import com.avdhoothadke.citadel.bank.backend.repository.BeneficiaryRepository;
import com.avdhoothadke.citadel.bank.backend.repository.OtpRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.avdhoothadke.citadel.bank.backend.util.SecurityUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BeneficiaryService {
    private final BeneficiaryRepository beneficiaryRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final EmailService emailService;
    private static final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public Beneficiary addBeneficiary(String name, String accountNumber) {
        String username = SecurityUtils.getCurrentUserName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Account targetAccount = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new RuntimeException("Invalid Beneficiary Account Number"));

        if (targetAccount.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You cannot add your own account as a beneficiary");
        }

        if (beneficiaryRepository.findByUserIdAndAccountNumber(currentUser.getId(), accountNumber).isPresent()) {
            throw new RuntimeException("Beneficiary already exists");
        }

        Beneficiary beneficiary = Beneficiary.builder()
                .name(name)
                .accountNumber(accountNumber)
                .user(currentUser)
                .active(false)
                .build();

        Beneficiary savedBeneficiary = beneficiaryRepository.save(beneficiary);

        String otp = String.valueOf(100000 + secureRandom.nextInt(900000));
        OtpVerification verification = new OtpVerification();
        verification.setOtp(otp);
        verification.setBeneficiary(savedBeneficiary);
        verification.setExpiryDate(LocalDateTime.now().plusMinutes(10));
        otpRepository.save(verification);

        emailService.sendEmail(currentUser.getEmail(), "Beneficiary Activation OTP", "Your OTP to activate " + name + " is: " + otp);

        return savedBeneficiary;
    }

    @Transactional
    public String validateOtp(Long beneficiaryId, String otp) {
        String username = SecurityUtils.getCurrentUserName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        OtpVerification otpData = otpRepository.findByBeneficiaryId(beneficiaryId)
                .orElseThrow(() -> new RuntimeException("OTP not found"));

        Beneficiary beneficiary = otpData.getBeneficiary();

        if (!beneficiary.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: This beneficiary does not belong to you.");
        }

        if (otpData.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            throw new RuntimeException("OTP Expired");
        }

        if (!otpData.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }


        beneficiary.setActive(true);
        beneficiaryRepository.save(beneficiary);

        otpRepository.delete(otpData);

        return "Beneficiary Activated Successfully";
    }

    public Page<Beneficiary> getMyBeneficiaries(Pageable pageable) {
        String username = SecurityUtils.getCurrentUserName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow();
        return beneficiaryRepository.findByUserId(currentUser.getId(), pageable);
    }
}
