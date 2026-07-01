package com.kosovo.healthcareexperience.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.kosovo.healthcareexperience.dto.verification.VerificationRequestDto;
import com.kosovo.healthcareexperience.dto.verification.VerificationResponse;
import com.kosovo.healthcareexperience.entity.Experience;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.entity.VerificationRequest;
import com.kosovo.healthcareexperience.enums.VerificationLevel;
import com.kosovo.healthcareexperience.enums.VerificationStatus;
import com.kosovo.healthcareexperience.exception.BadRequestException;
import com.kosovo.healthcareexperience.exception.ResourceNotFoundException;
import com.kosovo.healthcareexperience.repository.ExperienceRepository;
import com.kosovo.healthcareexperience.repository.VerificationRequestRepository;

/**
 * Optional, privacy-first verification workflow.
 *
 * PRIVACY: Documents are never shown publicly. We only store a file name
 * reference for the demo. See VerificationRequest for the production TODOs.
 */
@Service
public class VerificationService {

    private final VerificationRequestRepository verificationRepository;
    private final ExperienceRepository experienceRepository;
    private final ExperienceService experienceService;
    private final UserService userService;
    private final TrustScoreService trustScoreService;

    public VerificationService(VerificationRequestRepository verificationRepository,
                               ExperienceRepository experienceRepository,
                               ExperienceService experienceService,
                               UserService userService,
                               TrustScoreService trustScoreService) {
        this.verificationRepository = verificationRepository;
        this.experienceRepository = experienceRepository;
        this.experienceService = experienceService;
        this.userService = userService;
        this.trustScoreService = trustScoreService;
    }

    public VerificationResponse create(VerificationRequestDto dto) {
        User user = userService.getCurrentUser();
        Experience experience = experienceService.getEntity(dto.getExperienceId());

        if (!Boolean.TRUE.equals(dto.getRedactionConfirmed())) {
            throw new BadRequestException(
                    "Please confirm you removed personal identifiers before requesting verification.");
        }

        VerificationRequest vr = new VerificationRequest();
        vr.setUser(user);
        vr.setExperience(experience);
        vr.setDocumentNote(dto.getDocumentNote());
        vr.setFileName(dto.getFileName()); // demo reference only, never public
        vr.setRedactionConfirmed(dto.getRedactionConfirmed());
        vr.setStatus(VerificationStatus.PENDING);
        verificationRepository.save(vr);

        return toResponse(vr);
    }

    public List<VerificationResponse> getMine() {
        User user = userService.getCurrentUser();
        return verificationRepository.findByUser(user).stream().map(this::toResponse).toList();
    }

    public List<VerificationResponse> getAll() {
        return verificationRepository.findAll().stream().map(this::toResponse).toList();
    }

    /**
     * Admin decision. When approved, the experience verification level is raised
     * and the author gets a trust bonus.
     */
    public VerificationResponse updateStatus(Long id, VerificationRequestDto dto) {
        VerificationRequest vr = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Verification request not found: " + id));

        if (dto.getStatus() != null) {
            vr.setStatus(dto.getStatus());
        }
        vr.setAdminNote(dto.getAdminNote());

        if (vr.getStatus() == VerificationStatus.APPROVED) {
            Experience experience = vr.getExperience();
            VerificationLevel newLevel = dto.getNewVerificationLevel() != null
                    ? dto.getNewVerificationLevel()
                    : VerificationLevel.DOCUMENT_SUPPORTED;
            experience.setVerificationLevel(newLevel);
            experienceRepository.save(experience);

            int bonus = newLevel == VerificationLevel.HIGH_CONFIDENCE ? 15 : 8;
            if (experience.getAuthor() != null) {
                trustScoreService.applyVerificationBonus(experience.getAuthor(), bonus);
            }
        }

        verificationRepository.save(vr);
        return toResponse(vr);
    }

    public VerificationResponse toResponse(VerificationRequest vr) {
        VerificationResponse r = new VerificationResponse();
        r.setId(vr.getId());
        r.setDocumentNote(vr.getDocumentNote());
        r.setFileName(vr.getFileName());
        r.setRedactionConfirmed(vr.getRedactionConfirmed());
        r.setStatus(vr.getStatus());
        r.setAdminNote(vr.getAdminNote());
        r.setCreatedAt(vr.getCreatedAt());
        if (vr.getExperience() != null) {
            r.setExperienceId(vr.getExperience().getId());
            r.setExperienceCategory(vr.getExperience().getCategory());
        }
        if (vr.getUser() != null) {
            r.setUserId(vr.getUser().getId());
            r.setUserDisplayName(vr.getUser().getDisplayName());
        }
        return r;
    }
}
