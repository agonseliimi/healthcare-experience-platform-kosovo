package com.kosovo.healthcareexperience.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import com.kosovo.healthcareexperience.dto.feedback.FeedbackRequest;
import com.kosovo.healthcareexperience.exception.EmailDeliveryException;

class FeedbackServiceTest {

    @Test
    void sendsToConfiguredRecipientAndUsesReplyTo() {
        JavaMailSender sender = mock(JavaMailSender.class);
        FeedbackService service = new FeedbackService(sender, "noreply@example.com", "team@example.com");
        FeedbackRequest request = request();

        service.send(request);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(sender).send(captor.capture());
        SimpleMailMessage sent = captor.getValue();
        assertEquals("team@example.com", sent.getTo()[0]);
        assertEquals("noreply@example.com", sent.getFrom());
        assertEquals("user@example.com", sent.getReplyTo());
        assertTrue(sent.getText().contains("This platform is useful"));
    }

    @Test
    void wrapsMailProviderFailures() {
        JavaMailSender sender = mock(JavaMailSender.class);
        doThrow(new MailSendException("provider detail")).when(sender).send(any(SimpleMailMessage.class));
        FeedbackService service = new FeedbackService(sender, "noreply@example.com", "team@example.com");

        assertThrows(EmailDeliveryException.class, () -> service.send(request()));
    }

    private FeedbackRequest request() {
        FeedbackRequest request = new FeedbackRequest();
        request.setName("User");
        request.setEmail("user@example.com");
        request.setMessage("This platform is useful and clear.");
        return request;
    }
}
