package com.avdhoothadke.citadel.bank.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDateTime timestamp;
    private String status;
    private String sourceAccountNumber;
    private String targetAccountNumber;
}
