package com.avdhoothadke.citadel.bank.backend.service.fraud;


import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import com.avdhoothadke.citadel.bank.backend.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class VelocityRule implements FraudRule {
    private final TransactionRepository transactionRepository;

    @Override
    public boolean isFraud(Transaction transaction) {
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        Long sourceAccountId = transaction.getSourceAccount().getId();

        int recentCount = transactionRepository.countBySourceAccountIdAndTimestampAfter(sourceAccountId, fiveMinutesAgo);

        // If more than 5 transactions in 5 minutes -> FRAUD
        return recentCount >= 5;

    }

    @Override
    public String getRuleName() {
        return "VELOCITY_CHECK";
    }

    @Override
    public String getReason() {
        return "Too many transactions in a short period.";
    }
}
