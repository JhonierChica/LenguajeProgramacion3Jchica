package com.edu.uniremintong.jchica.lenguajesP3.modules.auth.repository;

import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}
