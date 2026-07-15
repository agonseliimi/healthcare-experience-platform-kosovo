package com.kosovo.healthcareexperience.service;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.kosovo.healthcareexperience.exception.RateLimitExceededException;

/** Small in-memory limit for the public feedback endpoint: five attempts per ten minutes. */
@Component
public class FeedbackRateLimiter {

    private static final int MAX_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(10);
    private final Map<String, Deque<Instant>> attemptsByClient = new ConcurrentHashMap<>();

    public void checkAllowed(String clientKey) {
        String safeKey = clientKey == null || clientKey.isBlank() ? "unknown" : clientKey;
        Instant now = Instant.now();
        Deque<Instant> attempts = attemptsByClient.computeIfAbsent(safeKey, ignored -> new ArrayDeque<>());

        synchronized (attempts) {
            Instant cutoff = now.minus(WINDOW);
            while (!attempts.isEmpty() && attempts.peekFirst().isBefore(cutoff)) {
                attempts.removeFirst();
            }
            if (attempts.size() >= MAX_ATTEMPTS) {
                throw new RateLimitExceededException();
            }
            attempts.addLast(now);
        }
    }
}
