package com.kosovo.healthcareexperience;

import java.io.File;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application entry point for the Healthcare Experience Platform (Kosovo).
 *
 * This is a university MVP. It is NOT a production medical system and does not
 * provide medical diagnosis or medical advice.
 */
@SpringBootApplication
public class HealthcareExperienceApplication {

    public static void main(String[] args) {
        // Ensure the local ./data directory exists so SQLite can create the .db file.
        File dataDir = new File("data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
        SpringApplication.run(HealthcareExperienceApplication.class, args);
    }
}
