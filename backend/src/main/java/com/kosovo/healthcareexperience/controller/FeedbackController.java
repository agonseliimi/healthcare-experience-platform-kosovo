package com.kosovo.healthcareexperience.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kosovo.healthcareexperience.dto.feedback.FeedbackRequest;
import com.kosovo.healthcareexperience.service.FeedbackRateLimiter;
import com.kosovo.healthcareexperience.service.FeedbackService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/** Public contact/feedback API. Recipient selection remains server-controlled. */
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final FeedbackRateLimiter rateLimiter;

    public FeedbackController(FeedbackService feedbackService, FeedbackRateLimiter rateLimiter) {
        this.feedbackService = feedbackService;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody FeedbackRequest request,
                                                       HttpServletRequest httpRequest) {
        rateLimiter.checkAllowed(httpRequest.getRemoteAddr());
        String requestId = feedbackService.send(request);
        return ResponseEntity.ok(Map.of(
                "requestId", requestId,
                "message", "Feedback sent successfully."));
    }
}
