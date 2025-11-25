package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.LedgerBlock;
import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import com.avdhoothadke.citadel.bank.backend.repository.LedgerRepository;
import com.google.common.hash.Hashing;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LedgerService {

    private final LedgerRepository ledgerRepository;

    public synchronized void recordTransaction(Transaction transaction) {

        String previousHash = ledgerRepository.findTopByOrderByIdDesc()
                .map(LedgerBlock::getDataHash)
                .orElse("GENESIS_HASH_0000");

        String rawData = transaction.getId() +
                transaction.getAmount().toString() +
                transaction.getSourceAccount().getAccountNumber() +
                transaction.getTargetAccount().getAccountNumber() +
                previousHash;

        String currentHash = Hashing.sha256()
                .hashString(rawData, StandardCharsets.UTF_8)
                .toString();

        LedgerBlock block = LedgerBlock.builder()
                .transactionId(transaction.getId())
                .dataHash(currentHash)
                .previousHash(previousHash)
                .timestamp(LocalDateTime.now())
                .build();

        ledgerRepository.save(block);
    }
}
