package com.avdhoothadke.citadel.bank.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccountLookupResponse {
    private String username;
    private String accountNumber;
    private String accountType;
}