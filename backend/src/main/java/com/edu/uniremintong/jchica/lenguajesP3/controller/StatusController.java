package com.edu.uniremintong.jchica.lenguajesP3.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class StatusController {

    @GetMapping("/")
    public Map<String, String> status() {
        return Map.of(
                "status", "¡Listo el pollo! 🐥",
                "mensaje", "Spring Boot está corriendo y la base de datos está conectada.",
                "estudiante", "Jhonier Chica");
    }
}
