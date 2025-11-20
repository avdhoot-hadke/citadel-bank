package com.avdhoothadke.citadel.bank.backend.config;

import com.avdhoothadke.citadel.bank.backend.entity.Role;
import com.avdhoothadke.citadel.bank.backend.entity.RoleName;
import com.avdhoothadke.citadel.bank.backend.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName(RoleName.ROLE_USER).isEmpty())
            roleRepository.save(new Role(RoleName.ROLE_USER));

        if (roleRepository.findByName(RoleName.ROLE_ADMIN).isEmpty())
            roleRepository.save(new Role(RoleName.ROLE_ADMIN));
    }

}
