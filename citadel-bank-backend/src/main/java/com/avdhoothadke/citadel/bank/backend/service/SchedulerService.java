package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.Account;
import com.avdhoothadke.citadel.bank.backend.repository.AccountRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class SchedulerService {
    @Value("${app.interest-rate}")
    private BigDecimal interestRate;

    private final AccountRepository accountRepository;

    @Scheduled(cron = "0 0 0 1 * ?")
    public void applyMonthlyInterest() {
        System.out.println("Starting Interest Calculation...");

        int pageNumber = 0;
        int pageSize = 100;
        Page<Account> page;

        do {
            page = accountRepository.findByAccountType("SAVINGS", PageRequest.of(pageNumber, pageSize));

            processBatch(page);

            pageNumber++;
        } while (page.hasNext());

        System.out.println("Interest Calculation Complete.");
    }

    @Transactional
    protected void processBatch(Page<Account> page) {
        for (Account acc : page.getContent()) {
            BigDecimal current = acc.getBalance();

            BigDecimal interest = current.multiply(interestRate);
            acc.setBalance(current.add(interest));

            accountRepository.save(acc);
        }
    }

}
