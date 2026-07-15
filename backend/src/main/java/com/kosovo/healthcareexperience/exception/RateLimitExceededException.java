package com.kosovo.healthcareexperience.exception;

/** Raised when a public client submits feedback too frequently. */
public class RateLimitExceededException extends RuntimeException {
    public RateLimitExceededException() {
        super("Too many feedback submissions. Please try again later.");
    }
}
