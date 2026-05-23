package com.edu.uniremintong.jchica.lenguajesP3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@SpringBootApplication
@RestController
public class LenguajesP3Application {

	public static void main(String[] args) {
		SpringApplication.run(LenguajesP3Application.class, args);
	}

	@GetMapping("/")
	public Map<String, String> status() {
		return Map.of(
				"status", "Aplicacion ejecutandose correctamente",
				"mensaje", "Spring Boot está corriendo y la base de datos está conectada.",
				"estudiante", "Jhonier Chica");
	}

}
