package com.avdhoothadke.citadel.bank.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "beneficiaries")
public class Beneficiary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String accountNumber;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private boolean active = false;

}
