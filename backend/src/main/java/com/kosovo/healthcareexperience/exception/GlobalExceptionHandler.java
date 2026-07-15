package com.kosovo.healthcareexperience.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Turns exceptions into consistent JSON error responses so the frontend can
 * display friendly messages.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    private Map<String, Object> body(HttpStatus status, String message) {
        Map<String, Object> map = new HashMap<>();
        map.put("timestamp", LocalDateTime.now().toString());
        map.put("status", status.value());
        map.put("error", status.getReasonPhrase());
        map.put("message", message);
        return map;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFound(ResourceNotFoundException ex) {
        return new ResponseEntity<>(body(HttpStatus.NOT_FOUND, ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequest(BadRequestException ex) {
        return new ResponseEntity<>(body(HttpStatus.BAD_REQUEST, ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Object> handleBadCredentials(BadCredentialsException ex) {
        return new ResponseEntity<>(body(HttpStatus.UNAUTHORIZED, "Invalid email or password."),
                HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<Object> handleRateLimit(RateLimitExceededException ex) {
        return new ResponseEntity<>(body(HttpStatus.TOO_MANY_REQUESTS, ex.getMessage()),
                HttpStatus.TOO_MANY_REQUESTS);
    }

    @ExceptionHandler(EmailDeliveryException.class)
    public ResponseEntity<Object> handleEmailDelivery() {
        return new ResponseEntity<>(body(HttpStatus.SERVICE_UNAVAILABLE,
                "The message could not be sent. Please try again later."), HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException ex) {
        return new ResponseEntity<>(body(HttpStatus.FORBIDDEN, "You do not have permission to do that."),
                HttpStatus.FORBIDDEN);
    }

    // Collects @Valid field errors into a single readable message.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidation(MethodArgumentNotValidException ex) {
        StringBuilder sb = new StringBuilder();
        ex.getBindingResult().getFieldErrors().forEach(err ->
                sb.append(err.getField()).append(": ").append(err.getDefaultMessage()).append("; "));
        return new ResponseEntity<>(body(HttpStatus.BAD_REQUEST, sb.toString().trim()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGeneric(Exception ex) {
        log.error("Unhandled API exception ({})", ex.getClass().getName(), ex);
        return new ResponseEntity<>(body(HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected server error occurred."),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
