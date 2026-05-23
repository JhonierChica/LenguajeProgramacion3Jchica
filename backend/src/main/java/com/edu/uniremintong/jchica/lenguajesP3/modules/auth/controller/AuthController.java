package com.edu.uniremintong.jchica.lenguajesP3.modules.auth.controller;

import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.dto.AuthResponse;
import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.dto.LoginRequest;
import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.dto.RegisterRequest;
import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.model.User;
import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getMe(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(401).build();
        }
        
        AuthResponse response = AuthResponse.builder()
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole())
                .token(null) // El token no es necesario reenviarlo
                .build();
                
        return ResponseEntity.ok(response);
    }
}
