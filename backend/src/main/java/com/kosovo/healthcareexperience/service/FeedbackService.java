package com.kosovo.healthcareexperience.service;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.kosovo.healthcareexperience.dto.feedback.FeedbackRequest;
import com.kosovo.healthcareexperience.exception.EmailDeliveryException;

/** Builds and sends plain-text feedback emails using backend-controlled addresses. */
@Service
public class FeedbackService {

    private static final Logger log = LoggerFactory.getLogger(FeedbackService.class);
    private static final String SUBJECT = "[Healthcare Experience Platform Kosovo] New user feedback";

    private final JavaMailSender mailSender;
    private final String from;
    private final String recipient;

    public FeedbackService(JavaMailSender mailSender,
                           @Value("${app.feedback.from}") String from,
                           @Value("${app.feedback.recipient}") String recipient) {
        this.mailSender = mailSender;
        this.from = from;
        this.recipient = recipient;
    }

    public String send(FeedbackRequest request) {
        String requestId = UUID.randomUUID().toString();
        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom(from);
        email.setTo(recipient);
        email.setSubject(SUBJECT);
        if (request.getEmail() != null) {
            email.setReplyTo(request.getEmail());
        }
        email.setText(buildBody(request, requestId));

        try {
            mailSender.send(email);
            log.info("Feedback delivery completed for request {}", requestId);
            return requestId;
        } catch (MailException | IllegalArgumentException ex) {
            log.warn("Feedback delivery failed for request {} ({})", requestId, ex.getClass().getSimpleName());
            throw new EmailDeliveryException();
        }
    }

    private String buildBody(FeedbackRequest request, String requestId) {
        return "Application: HealthPath Kosovo\n"
                + "Request ID: " + requestId + "\n"
                + "Submitted at: " + OffsetDateTime.now(ZoneOffset.UTC) + "\n"
                + "Name: " + valueOrNotProvided(request.getName()) + "\n"
                + "Contact email: " + valueOrNotProvided(request.getEmail()) + "\n\n"
                + "Feedback message:\n"
                + request.getMessage();
    }

    private String valueOrNotProvided(String value) {
        return value == null ? "Not provided" : value;
    }
}
