package com.avdhoothadke.citadel.bank.backend.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferRequest {
    private String sourceAccountNumber;
    private String targetAccountNumber;
    private BigDecimal amount;
    private String description;
    private String pin;
}
