package com.kosovo.healthcareexperience.exception;

/** Signals a technical SMTP delivery failure without exposing provider details. */
public class EmailDeliveryException extends RuntimeException {
    public EmailDeliveryException() {
        super("Feedback email delivery failed");
    }
}
