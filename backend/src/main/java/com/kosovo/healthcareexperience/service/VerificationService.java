package com.kosovo.healthcareexperience.service;

import java.util.List;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    private final FileStorageService fileStorageService;

    public VerificationService(VerificationRequestRepository verificationRepository,
                               ExperienceRepository experienceRepository,
                               ExperienceService experienceService,
                               UserService userService,
                               TrustScoreService trustScoreService,
                               FileStorageService fileStorageService) {
        this.verificationRepository = verificationRepository;
        this.experienceRepository = experienceRepository;
        this.experienceService = experienceService;
        this.userService = userService;
        this.trustScoreService = trustScoreService;
        this.fileStorageService = fileStorageService;
    }

    /**
     * Creates a verification request. The optional document is stored privately on
     * disk (never public); only administrators can download it later.
     */
    public VerificationResponse create(Long experienceId, String documentNote,
                                       Boolean redactionConfirmed, MultipartFile file) {
        User user = userService.getCurrentUser();
        Experience experience = experienceService.getEntity(experienceId);

        if (!Boolean.TRUE.equals(redactionConfirmed)) {
            throw new BadRequestException(
                    "Please confirm you removed personal identifiers before requesting verification.");
        }

        VerificationRequest vr = new VerificationRequest();
        vr.setUser(user);
        vr.setExperience(experience);
        vr.setDocumentNote(documentNote);
        vr.setRedactionConfirmed(redactionConfirmed);
        vr.setStatus(VerificationStatus.PENDING);

        // Store the uploaded document privately (admin-only access).
        if (file != null && !file.isEmpty()) {
            String storedName = fileStorageService.store(file);
            vr.setStoredFileName(storedName);
            vr.setFileName(file.getOriginalFilename());
            vr.setFileContentType(file.getContentType());
        }

        verificationRepository.save(vr);

        return toResponse(vr);
    }

    /** Admin-only: load the private document resource for a verification request. */
    public Resource loadDocument(Long id) {
        VerificationRequest vr = verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Verification request not found: " + id));
        if (vr.getStoredFileName() == null) {
            throw new ResourceNotFoundException("No document attached to this verification request.");
        }
        return fileStorageService.loadAsResource(vr.getStoredFileName());
    }

    /** Admin-only: metadata for the stored document (content type, original name). */
    public VerificationRequest getEntity(Long id) {
        return verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Verification request not found: " + id));
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
        r.setHasDocument(vr.getStoredFileName() != null);
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
