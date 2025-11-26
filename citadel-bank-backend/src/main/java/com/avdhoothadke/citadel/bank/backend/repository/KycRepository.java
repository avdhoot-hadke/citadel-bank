package com.avdhoothadke.citadel.bank.backend.repository;

import com.avdhoothadke.citadel.bank.backend.entity.KycDocument;
import com.avdhoothadke.citadel.bank.backend.entity.KycStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KycRepository extends JpaRepository<KycDocument, Long> {
    Page<KycDocument> findByStatus(KycStatus status, Pageable pageable);
}
