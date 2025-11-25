package com.avdhoothadke.citadel.bank.backend.service.fraud;

import com.avdhoothadke.citadel.bank.backend.entity.Transaction;

public interface FraudRule {
    boolean isFraud(Transaction transaction);
    String getRuleName();
    String getReason();
}
