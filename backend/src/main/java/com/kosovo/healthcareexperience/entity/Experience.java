package com.kosovo.healthcareexperience.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.kosovo.healthcareexperience.enums.ExperienceStatus;
import com.kosovo.healthcareexperience.enums.InstitutionType;
import com.kosovo.healthcareexperience.enums.VerificationLevel;

import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

/**
 * A single anonymous patient journey.
 *
 * Text fields describe the general journey only. Personal identifiers must be
 * removed before saving (see SanitizationService).
 */
@Entity
@Table(name = "experiences")
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many experiences belong to one author.
    @ManyToOne(optional = false)
    @JoinColumn(name = "author_id")
    private User author;

    @Column(nullable = false)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InstitutionType institutionType;

    @Column(nullable = false)
    private String city;

    @Column(length = 4000)
    private String stepsTaken;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "experience_symptoms", joinColumns = @JoinColumn(name = "experience_id"))
    @OrderColumn(name = "position")
    @Column(name = "symptom", nullable = false, length = 80)
    private List<String> symptoms = new ArrayList<>();

    @Column(length = 2000)
    private String testsPerformed;

    private Double approximateCost;
    private String waitingTime;
    private String resultTime;

    @Column(length = 4000)
    private String summary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VerificationLevel verificationLevel = VerificationLevel.SELF_REPORTED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExperienceStatus status = ExperienceStatus.PUBLISHED;

    private Boolean isAnonymous = true;

    /**
     * Name the author chose to sign this journey with. Blank or null means the
     * journey is published anonymously, which is the default.
     */
    @Column(name = "display_name", length = 60)
    private String displayName;

    private Integer likes = 0;
    private Integer dislikes = 0;

    // ---- Document attachment (stored as BLOB in SQLite) ----
    @Column(name = "document_data")
    private byte[] documentData;

    @Column(name = "document_name")
    private String documentName;

    @Column(name = "document_content_type")
    private String documentContentType;

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

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public InstitutionType getInstitutionType() { return institutionType; }
    public void setInstitutionType(InstitutionType institutionType) { this.institutionType = institutionType; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getStepsTaken() { return stepsTaken; }
    public void setStepsTaken(String stepsTaken) { this.stepsTaken = stepsTaken; }

    public List<String> getSymptoms() { return symptoms; }
    public void setSymptoms(List<String> symptoms) {
        this.symptoms.clear();
        if (symptoms != null) {
            this.symptoms.addAll(symptoms);
        }
    }

    public String getTestsPerformed() { return testsPerformed; }
    public void setTestsPerformed(String testsPerformed) { this.testsPerformed = testsPerformed; }

    public Double getApproximateCost() { return approximateCost; }
    public void setApproximateCost(Double approximateCost) { this.approximateCost = approximateCost; }

    public String getWaitingTime() { return waitingTime; }
    public void setWaitingTime(String waitingTime) { this.waitingTime = waitingTime; }

    public String getResultTime() { return resultTime; }
    public void setResultTime(String resultTime) { this.resultTime = resultTime; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public VerificationLevel getVerificationLevel() { return verificationLevel; }
    public void setVerificationLevel(VerificationLevel verificationLevel) { this.verificationLevel = verificationLevel; }

    public ExperienceStatus getStatus() { return status; }
    public void setStatus(ExperienceStatus status) { this.status = status; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public Integer getDislikes() { return dislikes; }
    public void setDislikes(Integer dislikes) { this.dislikes = dislikes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public byte[] getDocumentData() { return documentData; }
    public void setDocumentData(byte[] documentData) { this.documentData = documentData; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getDocumentContentType() { return documentContentType; }
    public void setDocumentContentType(String documentContentType) { this.documentContentType = documentContentType; }
}
