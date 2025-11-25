package com.avdhoothadke.citadel.bank.backend.repository;

import com.avdhoothadke.citadel.bank.backend.entity.LedgerBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LedgerRepository extends JpaRepository<LedgerBlock, Long> {
    Optional<LedgerBlock> findTopByOrderByIdDesc();

}
