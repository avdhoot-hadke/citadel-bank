package com.avdhoothadke.citadel.bank.backend.repository;

import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findBySourceAccountIdOrTargetAccountId(Long sourceId, Long targetId, Pageable pageable);

    int countBySourceAccountIdAndTimestampAfter(Long sourceAccountId, LocalDateTime timestamp);
}
