package com.avdhoothadke.citadel.bank.backend.service;

import com.avdhoothadke.citadel.bank.backend.entity.ActivityLog;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.ActivityLogRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ActivityLogService {
    private final ActivityLogRepository logRepository;
    private final UserRepository userRepository;

    @Async
    public void logAction(String username, String action, String description) {
        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            ActivityLog log = ActivityLog.builder()
                    .action(action)
                    .description(description)
                    .timestamp(LocalDateTime.now())
                    .user(user)
                    .build();
            logRepository.save(log);
        }
    }
}
