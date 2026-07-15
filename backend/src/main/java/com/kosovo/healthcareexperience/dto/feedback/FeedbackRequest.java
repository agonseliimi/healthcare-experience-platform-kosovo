package com.kosovo.healthcareexperience.dto.feedback;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Public feedback form payload. Optional fields are normalized to null. */
public class FeedbackRequest {

    @Size(max = 100, message = "Name must be at most 100 characters")
    @Pattern(regexp = "^[^\\r\\n]*$", message = "Name contains invalid characters")
    private String name;

    @Email(message = "Email must be valid")
    @Size(max = 254, message = "Email must be at most 254 characters")
    @Pattern(regexp = "^[^\\r\\n]*$", message = "Email contains invalid characters")
    private String email;

    @NotBlank(message = "Message is required")
    @Size(min = 10, max = 3000, message = "Message must be between 10 and 3000 characters")
    private String message;

    public String getName() { return name; }
    public void setName(String name) { this.name = normalizeOptional(name); }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = normalizeOptional(email); }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message == null ? null : message.trim(); }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}
