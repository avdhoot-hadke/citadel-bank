package com.avdhoothadke.citadel.bank.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String token;
    private LocalDateTime expiryDate;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
