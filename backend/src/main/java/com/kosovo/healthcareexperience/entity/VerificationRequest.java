package com.kosovo.healthcareexperience.entity;

import java.time.LocalDateTime;

import com.kosovo.healthcareexperience.enums.VerificationStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * A request to raise the verification level of an experience.
 *
 * PRIVACY: Uploaded documents are NEVER shown publicly. In this MVP we only
 * store a file name reference (no real file). A production system would need:
 *   - encrypted storage
 *   - strict admin-only access control
 *   - automatic deletion / retention policy
 *   - privacy audit logs
 *   - legal / privacy review
 */
@Entity
@Table(name = "verification_requests")
public class VerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false)
    @JoinColumn(name = "experience_id")
    private Experience experience;

    @Column(length = 2000)
    private String documentNote;

    // Demo-only reference. Not a public URL. Never expose the actual file.
    private String fileName;

    private Boolean redactionConfirmed = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationStatus status = VerificationStatus.PENDING;

    @Column(length = 2000)
    private String adminNote;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ---- Getters / setters ----

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Experience getExperience() { return experience; }
    public void setExperience(Experience experience) { this.experience = experience; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
