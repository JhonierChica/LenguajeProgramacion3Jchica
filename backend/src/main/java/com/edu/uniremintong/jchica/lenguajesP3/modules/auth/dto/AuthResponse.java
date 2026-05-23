package com.edu.uniremintong.jchica.lenguajesP3.modules.auth.dto;

import com.edu.uniremintong.jchica.lenguajesP3.modules.auth.model.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String fullName;
    private Role role;
}
