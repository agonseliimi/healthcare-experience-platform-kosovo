package com.kosovo.healthcareexperience.dto.report;

import java.time.LocalDateTime;

import com.kosovo.healthcareexperience.enums.ReportReason;
import com.kosovo.healthcareexperience.enums.ReportStatus;

public class ReportResponse {

    private Long id;
    private ReportReason reason;
    private String explanation;
    private ReportStatus status;
    private Long experienceId;
    private Long reportedUserId;
    private String reportedUserDisplayName;
    private Long reporterId;
    private String reporterDisplayName;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ReportReason getReason() { return reason; }
    public void setReason(ReportReason reason) { this.reason = reason; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public Long getExperienceId() { return experienceId; }
    public void setExperienceId(Long experienceId) { this.experienceId = experienceId; }

    public Long getReportedUserId() { return reportedUserId; }
    public void setReportedUserId(Long reportedUserId) { this.reportedUserId = reportedUserId; }

    public String getReportedUserDisplayName() { return reportedUserDisplayName; }
    public void setReportedUserDisplayName(String reportedUserDisplayName) { this.reportedUserDisplayName = reportedUserDisplayName; }

    public Long getReporterId() { return reporterId; }
    public void setReporterId(Long reporterId) { this.reporterId = reporterId; }

    public String getReporterDisplayName() { return reporterDisplayName; }
    public void setReporterDisplayName(String reporterDisplayName) { this.reporterDisplayName = reporterDisplayName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
