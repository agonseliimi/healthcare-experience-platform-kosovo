package com.kosovo.healthcareexperience.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.kosovo.healthcareexperience.dto.feedback.FeedbackRequest;
import com.kosovo.healthcareexperience.exception.EmailDeliveryException;
import com.kosovo.healthcareexperience.exception.GlobalExceptionHandler;
import com.kosovo.healthcareexperience.service.FeedbackRateLimiter;
import com.kosovo.healthcareexperience.service.FeedbackService;

class FeedbackControllerTest {

    private FeedbackService feedbackService;
    private FeedbackRateLimiter rateLimiter;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        feedbackService = org.mockito.Mockito.mock(FeedbackService.class);
        rateLimiter = org.mockito.Mockito.mock(FeedbackRateLimiter.class);
        doNothing().when(rateLimiter).checkAllowed(any());
        mockMvc = MockMvcBuilders
                .standaloneSetup(new FeedbackController(feedbackService, rateLimiter))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void acceptsValidFeedback() throws Exception {
        when(feedbackService.send(any(FeedbackRequest.class))).thenReturn("request-123");

        mockMvc.perform(post("/api/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"Arta","email":"arta@example.com","message":"A useful feedback message."}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requestId").value("request-123"));

        verify(feedbackService).send(any(FeedbackRequest.class));
    }

    @Test
    void rejectsBlankFeedbackMessage() throws Exception {
        mockMvc.perform(post("/api/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"   \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("message")));
    }

    @Test
    void rejectsInvalidOptionalEmail() throws Exception {
        mockMvc.perform(post("/api/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"not-an-email\",\"message\":\"A valid feedback message.\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Email must be valid")));
    }

    @Test
    void emailFailureReturnsSafeResponse() throws Exception {
        when(feedbackService.send(any(FeedbackRequest.class))).thenThrow(new EmailDeliveryException());

        mockMvc.perform(post("/api/feedback")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"message\":\"A valid feedback message.\"}"))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.message").value("The message could not be sent. Please try again later."));
    }
}
