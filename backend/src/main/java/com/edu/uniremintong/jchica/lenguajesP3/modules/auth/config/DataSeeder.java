package com.edu.uniremintong.jchica.lenguajesP3.modules.auth.config;

import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.model.Role;
import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.model.User;
import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Semilla para el Administrador
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Administrador")
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Usuario ADMIN creado por defecto (admin / admin123)");
        }

        // Semilla para el Cajero
        if (!userRepository.existsByUsername("cajero")) {
            User cashier = User.builder()
                    .username("cajero")
                    .password(passwordEncoder.encode("cajero123"))
                    .fullName("Cajero de Turno")
                    .role(Role.ROLE_CASHIER)
                    .enabled(true)
                    .build();
            userRepository.save(cashier);
            System.out.println("✅ Usuario CASHIER creado por defecto (cajero / cajero123)");
        }

        // Semilla para el Mesero
        if (!userRepository.existsByUsername("mesero")) {
            User waiter = User.builder()
                    .username("mesero")
                    .password(passwordEncoder.encode("mesero123"))
                    .fullName("Mesero de Salón")
                    .role(Role.ROLE_WAITER)
                    .enabled(true)
                    .build();
            userRepository.save(waiter);
            System.out.println("✅ Usuario WAITER creado por defecto (mesero / mesero123)");
        }
    }
}
