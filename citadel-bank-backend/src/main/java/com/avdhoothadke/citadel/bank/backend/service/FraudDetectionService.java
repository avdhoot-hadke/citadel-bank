package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.FraudAlert;
import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import com.avdhoothadke.citadel.bank.backend.repository.FraudAlertRepository;
import com.avdhoothadke.citadel.bank.backend.service.fraud.FraudRule;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FraudDetectionService {
    private final List<FraudRule> fraudRules;
    private final FraudAlertRepository fraudAlertRepository;

    public boolean checkForFraud(Transaction transaction) {
        boolean fraudDetected = false;

        for (FraudRule rule : fraudRules) {
            if (rule.isFraud(transaction)) {
                fraudDetected = true;

                FraudAlert alert = FraudAlert.builder()
                        .ruleName(rule.getRuleName())
                        .reason(rule.getReason())
                        .timestamp(LocalDateTime.now())
                        .transaction(transaction)
                        .user(transaction.getSourceAccount().getUser())
                        .build();

                fraudAlertRepository.save(alert);
                break;
            }
        }
        return fraudDetected;
    }
    public Page<FraudAlert> getFraudAlerts(Pageable pageable) {
        return fraudAlertRepository.findAll(pageable);
    }
}
