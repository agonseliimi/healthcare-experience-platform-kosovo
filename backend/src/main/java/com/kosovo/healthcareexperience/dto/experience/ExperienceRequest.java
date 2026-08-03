package com.kosovo.healthcareexperience.dto.experience;

import java.util.ArrayList;
import java.util.List;

import com.kosovo.healthcareexperience.enums.InstitutionType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

/** Payload for creating or updating an experience. */
public class ExperienceRequest {

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Institution type is required")
    private InstitutionType institutionType;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "Steps taken is required")
    @Size(max = 4000)
    private String stepsTaken;

    @Size(max = 10, message = "A maximum of 10 symptoms is allowed")
    private List<@NotBlank(message = "Symptoms cannot be blank")
            @Size(min = 2, max = 80, message = "Each symptom must be between 2 and 80 characters") String>
            symptoms = new ArrayList<>();

    @Size(max = 2000)
    private String testsPerformed;

    @PositiveOrZero(message = "Approximate cost cannot be negative")
    private Double approximateCost;

    private String waitingTime;
    private String resultTime;

    @Size(max = 4000)
    private String summary;

    @Size(max = 60, message = "The name can be at most 60 characters")
    private String displayName;

    private Boolean isAnonymous = true;

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
        this.symptoms = symptoms == null ? new ArrayList<>() : symptoms;
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

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
}
