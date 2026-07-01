package com.kosovo.healthcareexperience.exception;

/** Thrown for invalid input or business-rule violations. Maps to HTTP 400. */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
