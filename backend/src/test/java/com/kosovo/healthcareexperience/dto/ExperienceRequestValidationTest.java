package com.kosovo.healthcareexperience.dto;

import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.kosovo.healthcareexperience.dto.experience.ExperienceRequest;
import com.kosovo.healthcareexperience.enums.InstitutionType;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

class ExperienceRequestValidationTest {

    private static ValidatorFactory factory;
    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @AfterAll
    static void closeValidator() {
        factory.close();
    }

    @Test
    void rejectsMoreThanTenSymptoms() {
        ExperienceRequest request = validRequest();
        request.setSymptoms(new ArrayList<>(List.of("s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11")));

        assertTrue(validator.validate(request).stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().equals("symptoms")));
    }

    @Test
    void rejectsOversizedSymptom() {
        ExperienceRequest request = validRequest();
        request.setSymptoms(List.of("x".repeat(81)));

        assertTrue(validator.validate(request).stream()
                .anyMatch(violation -> violation.getPropertyPath().toString().startsWith("symptoms")));
    }

    private ExperienceRequest validRequest() {
        ExperienceRequest request = new ExperienceRequest();
        request.setCategory("Neurology");
        request.setInstitutionType(InstitutionType.PUBLIC_HOSPITAL);
        request.setCity("Prishtina");
        request.setStepsTaken("Family doctor and specialist visit");
        return request;
    }
}
