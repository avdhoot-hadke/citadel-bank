package com.avdhoothadke.citadel.bank.backend.repository;

import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Page<Transaction> findBySourceAccountIdOrTargetAccountId(Long sourceId, Long targetId, Pageable pageable);

    int countBySourceAccountIdAndTimestampAfter(Long sourceAccountId, LocalDateTime timestamp);

    Page<Transaction> findBySourceAccountIdOrTargetAccountIdOrderByTimestampDesc(Long sourceId, Long targetId, Pageable pageable);

    Page<Transaction> findBySourceAccountAccountNumberOrTargetAccountAccountNumber(String sourceAccNum, String targetAccNum, Pageable pageable);

    @Query("SELECT t FROM Transaction t WHERE t.sourceAccount.user.id = :userId OR t.targetAccount.user.id = :userId")
    Page<Transaction> findAllByUserId(@Param("userId") Long userId, Pageable pageable);

}
