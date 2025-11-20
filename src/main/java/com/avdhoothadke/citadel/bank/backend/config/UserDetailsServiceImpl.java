package com.avdhoothadke.citadel.bank.backend.config;

import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.userdetails.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not Found"));

        if (user.getLockTime() != null && user.getLockTime().isAfter(java.time.LocalDateTime.now())) {
            throw new LockedException("Account is locked. Try again later.");
        }

        return new UserDetailsImpl(user);
    }
}
