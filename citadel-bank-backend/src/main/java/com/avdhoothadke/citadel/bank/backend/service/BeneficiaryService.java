package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.entity.Beneficiary;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.AccountRepository;
import com.avdhoothadke.citadel.bank.backend.repository.BeneficiaryRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import com.avdhoothadke.citadel.bank.backend.util.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BeneficiaryService {
    private final BeneficiaryRepository beneficiaryRepository;
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

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

        return beneficiaryRepository.save(beneficiary);
    }

    public Page<Beneficiary> getMyBeneficiaries(Pageable pageable) {
        String username = SecurityUtils.getCurrentUserName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow();
        return beneficiaryRepository.findByUserId(currentUser.getId(), pageable);
    }
}
