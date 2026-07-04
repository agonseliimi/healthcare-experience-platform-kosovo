package com.kosovo.healthcareexperience.dto.verification;

import java.time.LocalDateTime;

import com.kosovo.healthcareexperience.enums.VerificationStatus;

public class VerificationResponse {

    private Long id;
    private Long experienceId;
    private String experienceCategory;
    private Long userId;
    private String userDisplayName;
    private String documentNote;
    private String fileName;
    private Boolean hasDocument;
    private Boolean redactionConfirmed;
    private VerificationStatus status;
    private String adminNote;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getExperienceId() { return experienceId; }
    public void setExperienceId(Long experienceId) { this.experienceId = experienceId; }

    public String getExperienceCategory() { return experienceCategory; }
    public void setExperienceCategory(String experienceCategory) { this.experienceCategory = experienceCategory; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserDisplayName() { return userDisplayName; }
    public void setUserDisplayName(String userDisplayName) { this.userDisplayName = userDisplayName; }

    public String getDocumentNote() { return documentNote; }
    public void setDocumentNote(String documentNote) { this.documentNote = documentNote; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Boolean getHasDocument() { return hasDocument; }
    public void setHasDocument(Boolean hasDocument) { this.hasDocument = hasDocument; }

    public Boolean getRedactionConfirmed() { return redactionConfirmed; }
    public void setRedactionConfirmed(Boolean redactionConfirmed) { this.redactionConfirmed = redactionConfirmed; }

    public VerificationStatus getStatus() { return status; }
    public void setStatus(VerificationStatus status) { this.status = status; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
