package com.kosovo.healthcareexperience.dto.report;

import com.kosovo.healthcareexperience.enums.ReportReason;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ReportRequest {

    // At least one of experienceId / reportedUserId should be provided.
    private Long experienceId;
    private Long reportedUserId;

    @NotNull(message = "Reason is required")
    private ReportReason reason;

    @Size(max = 2000)
    private String explanation;

    public Long getExperienceId() { return experienceId; }
    public void setExperienceId(Long experienceId) { this.experienceId = experienceId; }

    public Long getReportedUserId() { return reportedUserId; }
    public void setReportedUserId(Long reportedUserId) { this.reportedUserId = reportedUserId; }

    public ReportReason getReason() { return reason; }
    public void setReason(ReportReason reason) { this.reason = reason; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
