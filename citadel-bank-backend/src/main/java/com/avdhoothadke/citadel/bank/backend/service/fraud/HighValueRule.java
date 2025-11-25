package com.avdhoothadke.citadel.bank.backend.service.fraud;

import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class HighValueRule implements FraudRule {
    @Value("${app.fraud.high-value-threshold}")
    private BigDecimal threshold;

    @Override
    public boolean isFraud(Transaction transaction) {
        return transaction.getAmount().compareTo(threshold) > 0;
    }

    @Override
    public String getRuleName() {
        return "HIGH_VALUE_TRANSACTION";
    }

    @Override
    public String getReason() {
        return "Transaction amount exceeds automatic approval limit.";
    }
}
