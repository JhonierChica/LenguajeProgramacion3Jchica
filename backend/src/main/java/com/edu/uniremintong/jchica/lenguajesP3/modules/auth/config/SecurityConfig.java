package com.edu.uniremintong.jchica.lenguajesP3.modules.auth.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .authorizeHttpRequests(auth -> auth
                        // Swagger e interfaces de estado públicas
                        .requestMatchers("/", "/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        
                        // Autenticación pública
                        .requestMatchers("/api/auth/login").permitAll()
                        
                        // CRUD Productos: lectura para todos los autenticados, escritura solo ADMIN
                        .requestMatchers(HttpMethod.GET, "/api/products/**").authenticated()
                        .requestMatchers("/api/products/**").hasAuthority("ROLE_ADMIN")
                        
                        // CRUD Clientes: lectura para todos los autenticados, escritura ADMIN o CASHIER
                        .requestMatchers(HttpMethod.GET, "/api/customer/**").authenticated()
                        .requestMatchers("/api/customer/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_CASHIER")
                        
                        // CRUD Órdenes: lectura y escritura (POST/PUT) para todos los autenticados, borrado ADMIN o CASHIER
                        .requestMatchers(HttpMethod.DELETE, "/api/orders/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_CASHIER")
                        .requestMatchers("/api/orders/**").authenticated()
                        
                        // Creación de usuarios en auth: solo ADMIN
                        .requestMatchers("/api/auth/register").hasAuthority("ROLE_ADMIN")
                        
                        // Cualquier otra request requiere autenticación
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite orígenes locales de Vite y hosts de la red local
        configuration.setAllowedOriginPatterns(List.of(
            "http://localhost:5173",
            "http://localhost:8080",
            "https://*.onrender.com"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
