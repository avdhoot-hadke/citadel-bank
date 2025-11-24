package com.avdhoothadke.citadel.bank.backend.repository;

import com.avdhoothadke.citadel.bank.backend.entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}
