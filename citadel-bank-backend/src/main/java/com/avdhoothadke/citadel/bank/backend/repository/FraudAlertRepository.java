package com.avdhoothadke.citadel.bank.backend.repository;

import com.avdhoothadke.citadel.bank.backend.entity.FraudAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FraudAlertRepository extends JpaRepository<FraudAlert, Long> {
}
