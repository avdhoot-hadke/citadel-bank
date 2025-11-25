package com.avdhoothadke.citadel.bank.backend.repository;

import com.avdhoothadke.citadel.bank.backend.entity.Account;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    List<Account> findByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Account> findByAccountNumber(String accountNumber);

    List<Account> findAllByUserEmail(String email);

    Page<Account> findByAccountType(String accountType, Pageable pageable);
}
