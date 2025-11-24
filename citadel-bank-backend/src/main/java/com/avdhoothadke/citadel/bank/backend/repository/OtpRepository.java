package com.avdhoothadke.citadel.bank.backend.repository;

import com.avdhoothadke.citadel.bank.backend.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpVerification, Long> {
    Optional<OtpVerification> findByBeneficiaryId(Long beneficiaryId);
}
