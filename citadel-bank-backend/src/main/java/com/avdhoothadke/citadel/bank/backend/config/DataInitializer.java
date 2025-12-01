package com.avdhoothadke.citadel.bank.backend.config;

import com.avdhoothadke.citadel.bank.backend.entity.Role;
import com.avdhoothadke.citadel.bank.backend.entity.RoleName;
import com.avdhoothadke.citadel.bank.backend.entity.User;
import com.avdhoothadke.citadel.bank.backend.repository.RoleRepository;
import com.avdhoothadke.citadel.bank.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_USER)));

        Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                .orElseGet(() -> roleRepository.save(new Role(RoleName.ROLE_ADMIN)));

        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = User.builder()
                    .username("admin")
                    .email("admin@citadel.com")
                    .password(passwordEncoder.encode("adm@123"))
                    .pin("1234")
                    .roles(Set.of(adminRole))
                    .failedLoginAttempts(0)
                    .build();

            userRepository.save(admin);
            System.out.println("✅ ADMIN USER CREATED: Username: 'admin' | Password: 'admin123'");
        }
    }
}
