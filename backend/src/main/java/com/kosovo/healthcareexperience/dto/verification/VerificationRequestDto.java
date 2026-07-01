package com.kosovo.healthcareexperience.dto.verification;

import com.kosovo.healthcareexperience.enums.VerificationLevel;
import com.kosovo.healthcareexperience.enums.VerificationStatus;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Combined DTO used both when a user creates a verification request and when an
 * admin updates its status. Only the relevant fields are used in each case.
 */
public class VerificationRequestDto {

    // ---- Fields used when a user creates a request ----
    @NotNull(message = "experienceId is required")
    private Long experienceId;

    @Size(max = 2000)
    private String documentNote;

    private String fileName;

    private Boolean redactionConfirmed = false;

    // ---- Fields used when an admin updates a request ----
    private VerificationStatus status;
    private String adminNote;
    private VerificationLevel newVerificationLevel;

    public Long getExperienceId() { return experienceId; }
    public void setExperienceId(Long experienceId) { this.experienceId = experienceId; }

    public String getDocumentNote() { return documentNote; }
    public void setDocumentNote(String documentNote) { this.documentNote = documentNote; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Boolean getRedactionConfirmed() { return redactionConfirmed; }
    public void setRedactionConfirmed(Boolean redactionConfirmed) { this.redactionConfirmed = redactionConfirmed; }

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

    public VerificationLevel getNewVerificationLevel() { return newVerificationLevel; }
    public void setNewVerificationLevel(VerificationLevel newVerificationLevel) { this.newVerificationLevel = newVerificationLevel; }
}
