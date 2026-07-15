package com.kosovo.healthcareexperience.dto.experience;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.kosovo.healthcareexperience.enums.ExperienceStatus;
import com.kosovo.healthcareexperience.enums.InstitutionType;
import com.kosovo.healthcareexperience.enums.VerificationLevel;

/**
 * Public-facing view of an experience.
 * Author identity is hidden when the experience is anonymous.
 */
public class ExperienceResponse {

    private Long id;
    private String category;
    private InstitutionType institutionType;
    private String city;
    private String stepsTaken;
    private List<String> symptoms = new ArrayList<>();
    private String testsPerformed;
    private Double approximateCost;
    private String waitingTime;
    private String resultTime;
    private String summary;
    private VerificationLevel verificationLevel;
    private ExperienceStatus status;
    private Boolean isAnonymous;
    private Integer likes;
    private Integer dislikes;

    // Author info (null / "Anonymous" when the experience is anonymous)
    private Long authorId;
    private String authorDisplayName;
    private Integer authorTrustScore;
    private String authorTrustLabel;

    private LocalDateTime createdAt;

    // Document attachment metadata (the binary data is served separately)
    private Boolean hasDocument;
    private String documentName;
    private String documentContentType;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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
        this.symptoms = symptoms == null ? new ArrayList<>() : new ArrayList<>(symptoms);
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

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }

    public Integer getLikes() { return likes; }
    public void setLikes(Integer likes) { this.likes = likes; }

    public Integer getDislikes() { return dislikes; }
    public void setDislikes(Integer dislikes) { this.dislikes = dislikes; }

    public Long getAuthorId() { return authorId; }
    public void setAuthorId(Long authorId) { this.authorId = authorId; }

    public String getAuthorDisplayName() { return authorDisplayName; }
    public void setAuthorDisplayName(String authorDisplayName) { this.authorDisplayName = authorDisplayName; }

    public Integer getAuthorTrustScore() { return authorTrustScore; }
    public void setAuthorTrustScore(Integer authorTrustScore) { this.authorTrustScore = authorTrustScore; }

    public String getAuthorTrustLabel() { return authorTrustLabel; }
    public void setAuthorTrustLabel(String authorTrustLabel) { this.authorTrustLabel = authorTrustLabel; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Boolean getHasDocument() { return hasDocument; }
    public void setHasDocument(Boolean hasDocument) { this.hasDocument = hasDocument; }

    public String getDocumentName() { return documentName; }
    public void setDocumentName(String documentName) { this.documentName = documentName; }

    public String getDocumentContentType() { return documentContentType; }
    public void setDocumentContentType(String documentContentType) { this.documentContentType = documentContentType; }
}
