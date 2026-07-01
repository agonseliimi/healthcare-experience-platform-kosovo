package com.kosovo.healthcareexperience.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kosovo.healthcareexperience.dto.experience.ExperienceRequest;
import com.kosovo.healthcareexperience.dto.experience.ExperienceResponse;
import com.kosovo.healthcareexperience.enums.InstitutionType;
import com.kosovo.healthcareexperience.enums.VerificationLevel;
import com.kosovo.healthcareexperience.enums.VoteType;
import com.kosovo.healthcareexperience.exception.BadRequestException;
import com.kosovo.healthcareexperience.service.ExperienceService;

import jakarta.validation.Valid;

/** Experience browsing, CRUD, and voting. */
@RestController
@RequestMapping("/api/experiences")
public class ExperienceController {

    private final ExperienceService experienceService;

    public ExperienceController(ExperienceService experienceService) {
        this.experienceService = experienceService;
    }

    // Public list with optional filters.
    @GetMapping
    public ResponseEntity<List<ExperienceResponse>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) InstitutionType institutionType,
            @RequestParam(required = false) VerificationLevel verificationLevel,
            @RequestParam(required = false) Double minCost,
            @RequestParam(required = false) Double maxCost,
            @RequestParam(required = false) String waitingTime) {

        return ResponseEntity.ok(experienceService.getExperiences(
                search, city, category, institutionType, verificationLevel, minCost, maxCost, waitingTime));
    }

    // Logged-in user: their own experiences (any status).
    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ExperienceResponse>> mine() {
        return ResponseEntity.ok(experienceService.getMine());
    }

    // Public: single experience.
    @GetMapping("/{id}")
    public ResponseEntity<ExperienceResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(experienceService.getByIdAsResponse(id));
    }

    // Logged-in user creates an experience.
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExperienceResponse> create(@Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(experienceService.create(request));
    }

    // Owner or admin updates.
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExperienceResponse> update(@PathVariable Long id,
                                                     @Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(experienceService.update(id, request));
    }

    // Owner soft-hides; admin deletes.
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        experienceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Logged-in user votes. Body: { "type": "LIKE" } or { "type": "DISLIKE" }.
    @PostMapping("/{id}/vote")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ExperienceResponse> vote(@PathVariable Long id,
                                                   @RequestBody Map<String, String> body) {
        String rawType = body.get("type");
        if (rawType == null) {
            throw new BadRequestException("Vote 'type' is required (LIKE or DISLIKE).");
        }
        VoteType type;
        try {
            type = VoteType.valueOf(rawType.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid vote type. Use LIKE or DISLIKE.");
        }
        return ResponseEntity.ok(experienceService.vote(id, type));
    }
}
