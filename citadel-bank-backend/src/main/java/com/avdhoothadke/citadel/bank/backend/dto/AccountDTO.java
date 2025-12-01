package com.avdhoothadke.citadel.bank.backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class AccountDTO {
    private Long id;
    private String accountNumber;
    private BigDecimal balance;
    private String accountType;
    private String username;
    private String email;
}
