package com.avdhoothadke.citadel.bank.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "ledger_blocks")
public class LedgerBlock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long transactionId; 

    @Column(nullable = false)
    private String dataHash;   

    @Column(nullable = false)
    private String previousHash; 

    private LocalDateTime timestamp;
}
