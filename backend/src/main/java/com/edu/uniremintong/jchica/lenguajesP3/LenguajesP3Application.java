package com.edu.uniremintong.jchica.lenguajesP3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.util.Map;

@SpringBootApplication
@RestController
public class LenguajesP3Application {

	public static void main(String[] args) {
		SpringApplication.run(LenguajesP3Application.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
						.allowedOrigins("http://localhost:5173")
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}

	@GetMapping("/")
	public Map<String, String> status() {
		return Map.of(
				"status", "Aplicacion ejecutandose correctamente",
				"mensaje", "Spring Boot está corriendo y la base de datos está conectada.",
				"estudiante", "Jhonier Chica");
	}

}
