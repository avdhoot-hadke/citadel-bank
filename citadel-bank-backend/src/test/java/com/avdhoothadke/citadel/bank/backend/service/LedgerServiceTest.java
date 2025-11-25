package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.entity.LedgerBlock;
import com.avdhoothadke.citadel.bank.backend.entity.Transaction;
import com.avdhoothadke.citadel.bank.backend.repository.LedgerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LedgerServiceTest {

    @Mock private LedgerRepository ledgerRepository;
    @InjectMocks private LedgerService ledgerService;

    @Test
    void shouldCreateGenesisBlock_WhenNoPreviousBlocks() {
        Transaction transaction = Transaction.builder()
                .id(100L)
                .amount(new BigDecimal("50.00"))
                .sourceAccount(Account.builder().accountNumber("SRC").build())
                .targetAccount(Account.builder().accountNumber("TGT").build())
                .build();

        when(ledgerRepository.findTopByOrderByIdDesc()).thenReturn(Optional.empty());

        ledgerService.recordTransaction(transaction);

        ArgumentCaptor<LedgerBlock> captor = ArgumentCaptor.forClass(LedgerBlock.class);
        verify(ledgerRepository).save(captor.capture());

        LedgerBlock savedBlock = captor.getValue();
        assertEquals("GENESIS_HASH_0000", savedBlock.getPreviousHash());
        assertNotNull(savedBlock.getDataHash());
        System.out.println("✅shouldCreateGenesisBlock_WhenNoPreviousBlocks Passed ");

    }

    @Test
    void shouldChainBlocksCorrectly() {
        Transaction transaction = Transaction.builder()
                .id(101L)
                .amount(new BigDecimal("10.00"))
                .sourceAccount(Account.builder().accountNumber("A").build())
                .targetAccount(Account.builder().accountNumber("B").build())
                .build();

        LedgerBlock previousBlock = LedgerBlock.builder().dataHash("HASH_123").build();

        when(ledgerRepository.findTopByOrderByIdDesc()).thenReturn(Optional.of(previousBlock));

        ledgerService.recordTransaction(transaction);

        ArgumentCaptor<LedgerBlock> captor = ArgumentCaptor.forClass(LedgerBlock.class);
        verify(ledgerRepository).save(captor.capture());

        LedgerBlock savedBlock = captor.getValue();
        assertEquals("HASH_123", savedBlock.getPreviousHash());

        System.out.println("✅shouldChainBlocksCorrectly Passed ");

    }
}
