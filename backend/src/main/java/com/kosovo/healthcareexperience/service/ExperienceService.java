package com.kosovo.healthcareexperience.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kosovo.healthcareexperience.dto.experience.ExperienceRequest;
import com.kosovo.healthcareexperience.dto.experience.ExperienceResponse;
import com.kosovo.healthcareexperience.entity.Experience;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.entity.Vote;
import com.kosovo.healthcareexperience.enums.ExperienceStatus;
import com.kosovo.healthcareexperience.enums.InstitutionType;
import com.kosovo.healthcareexperience.enums.Role;
import com.kosovo.healthcareexperience.enums.VerificationLevel;
import com.kosovo.healthcareexperience.enums.VoteType;
import com.kosovo.healthcareexperience.exception.BadRequestException;
import com.kosovo.healthcareexperience.exception.ResourceNotFoundException;
import com.kosovo.healthcareexperience.repository.ExperienceRepository;
import com.kosovo.healthcareexperience.repository.VoteRepository;

/**
 * Business logic for experiences: listing with filters, CRUD, and voting.
 */
@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final VoteRepository voteRepository;
    private final UserService userService;
    private final TrustScoreService trustScoreService;
    private final SanitizationService sanitizationService;

    public ExperienceService(ExperienceRepository experienceRepository,
                             VoteRepository voteRepository,
                             UserService userService,
                             TrustScoreService trustScoreService,
                             SanitizationService sanitizationService) {
        this.experienceRepository = experienceRepository;
        this.voteRepository = voteRepository;
        this.userService = userService;
        this.trustScoreService = trustScoreService;
        this.sanitizationService = sanitizationService;
    }

    // ---- Listing with dynamic filters ----

    public List<ExperienceResponse> getExperiences(String search, String city, String category,
                                                   InstitutionType institutionType,
                                                   VerificationLevel verificationLevel,
                                                   Double minCost, Double maxCost,
                                                   String waitingTime) {

        Specification<Experience> spec = (root, query, cb) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            // Public listing only shows PUBLISHED experiences.
            predicates.add(cb.equal(root.get("status"), ExperienceStatus.PUBLISHED));

            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("category")), like),
                        cb.like(cb.lower(root.get("summary")), like),
                        cb.like(cb.lower(root.get("stepsTaken")), like),
                        cb.like(cb.lower(root.get("city")), like)
                ));
            }
            if (city != null && !city.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("city")), city.toLowerCase()));
            }
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("category")), category.toLowerCase()));
            }
            if (institutionType != null) {
                predicates.add(cb.equal(root.get("institutionType"), institutionType));
            }
            if (verificationLevel != null) {
                predicates.add(cb.equal(root.get("verificationLevel"), verificationLevel));
            }
            if (minCost != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("approximateCost"), minCost));
            }
            if (maxCost != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("approximateCost"), maxCost));
            }
            if (waitingTime != null && !waitingTime.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("waitingTime")), "%" + waitingTime.toLowerCase() + "%"));
            }

            query.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        return experienceRepository.findAll(spec).stream().map(this::toResponse).toList();
    }

    public ExperienceResponse getByIdAsResponse(Long id) {
        Experience e = getEntity(id);

        // Non-published experiences (HIDDEN / UNDER_REVIEW) must not be visible to
        // the public. Only the owner or an admin may view them directly.
        if (e.getStatus() != ExperienceStatus.PUBLISHED) {
            User current = userService.getCurrentUserOrNull();
            boolean isOwner = current != null && e.getAuthor() != null
                    && e.getAuthor().getId().equals(current.getId());
            boolean isAdmin = current != null && current.getRole() == Role.ADMIN;
            if (!isOwner && !isAdmin) {
                throw new ResourceNotFoundException("Experience not found: " + id);
            }
        }
        return toResponse(e);
    }

    /** All experiences authored by the current user (any status). */
    public List<ExperienceResponse> getMine() {
        User current = userService.getCurrentUser();
        return experienceRepository.findByAuthor(current).stream().map(this::toResponse).toList();
    }

    public Experience getEntity(Long id) {
        return experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found: " + id));
    }

    // ---- Create ----

    public ExperienceResponse create(ExperienceRequest request) {
        User author = userService.getCurrentUser();

        // Privacy guard: reject obvious personal identifiers before saving.
        if (sanitizationService.containsPersonalInfo(
                request.getStepsTaken(), request.getTestsPerformed(), request.getSummary())) {
            throw new BadRequestException(
                    "Your submission may contain personal information. Please remove identifiers before submitting.");
        }

        Experience e = new Experience();
        e.setAuthor(author);
        applyRequest(e, request);
        e.setVerificationLevel(VerificationLevel.SELF_REPORTED);
        e.setStatus(ExperienceStatus.PUBLISHED);
        e.setLikes(0);
        e.setDislikes(0);
        experienceRepository.save(e);
        return toResponse(e);
    }

    // ---- Update (owner or admin) ----

    public ExperienceResponse update(Long id, ExperienceRequest request) {
        Experience e = getEntity(id);
        User current = userService.getCurrentUser();
        requireOwnerOrAdmin(e, current);

        if (sanitizationService.containsPersonalInfo(
                request.getStepsTaken(), request.getTestsPerformed(), request.getSummary())) {
            throw new BadRequestException(
                    "Your submission may contain personal information. Please remove identifiers before submitting.");
        }

        applyRequest(e, request);
        experienceRepository.save(e);
        return toResponse(e);
    }

    // ---- Delete (owner soft-hide, admin hard delete) ----

    public void delete(Long id) {
        Experience e = getEntity(id);
        User current = userService.getCurrentUser();
        requireOwnerOrAdmin(e, current);

        if (current.getRole() == Role.ADMIN) {
            experienceRepository.delete(e);
        } else {
            // Normal users soft-hide their own experience.
            e.setStatus(ExperienceStatus.HIDDEN);
            experienceRepository.save(e);
        }
    }

    // ---- Admin: change status ----

    public ExperienceResponse updateStatus(Long id, ExperienceStatus status) {
        Experience e = getEntity(id);
        e.setStatus(status);
        experienceRepository.save(e);

        // Hiding content reduces the author's trust slightly.
        if (status == ExperienceStatus.HIDDEN && e.getAuthor() != null) {
            trustScoreService.applyVerificationBonus(e.getAuthor(), -5);
        }
        return toResponse(e);
    }

    // ---- Voting ----

    @Transactional
    public ExperienceResponse vote(Long experienceId, VoteType type) {
        Experience e = getEntity(experienceId);
        User user = userService.getCurrentUser();
        User author = e.getAuthor();

        // Prevent self-voting: a user cannot inflate their own trust score.
        if (author != null && author.getId().equals(user.getId())) {
            throw new BadRequestException("You cannot vote on your own experience.");
        }

        Vote existing = voteRepository.findByUserAndExperience(user, e).orElse(null);

        if (existing == null) {
            // New vote.
            Vote v = new Vote();
            v.setUser(user);
            v.setExperience(e);
            v.setType(type);
            voteRepository.save(v);
            applyCounts(e, author, type, +1);
        } else if (existing.getType() == type) {
            // Same vote again -> toggle it off (remove the vote).
            voteRepository.delete(existing);
            applyCounts(e, author, type, -1);
        } else {
            // Switch vote (e.g. LIKE -> DISLIKE).
            applyCounts(e, author, existing.getType(), -1);
            existing.setType(type);
            voteRepository.save(existing);
            applyCounts(e, author, type, +1);
        }

        experienceRepository.save(e);
        if (author != null) {
            trustScoreService.recalculate(author);
        }
        return toResponse(e);
    }

    // ---- Helpers ----

    private void applyCounts(Experience e, User author, VoteType type, int delta) {
        if (type == VoteType.LIKE) {
            e.setLikes(Math.max(0, nz(e.getLikes()) + delta));
            if (author != null) {
                author.setLikesReceived(Math.max(0, nz(author.getLikesReceived()) + delta));
            }
        } else {
            e.setDislikes(Math.max(0, nz(e.getDislikes()) + delta));
            if (author != null) {
                author.setDislikesReceived(Math.max(0, nz(author.getDislikesReceived()) + delta));
            }
        }
    }

    private void applyRequest(Experience e, ExperienceRequest r) {
        e.setCategory(r.getCategory());
        e.setInstitutionType(r.getInstitutionType());
        e.setCity(r.getCity());
        e.setStepsTaken(r.getStepsTaken());
        e.setTestsPerformed(r.getTestsPerformed());
        e.setApproximateCost(r.getApproximateCost());
        e.setWaitingTime(r.getWaitingTime());
        e.setResultTime(r.getResultTime());
        e.setSummary(r.getSummary());
        if (r.getIsAnonymous() != null) {
            e.setIsAnonymous(r.getIsAnonymous());
        }
    }

    private void requireOwnerOrAdmin(Experience e, User current) {
        boolean isOwner = e.getAuthor() != null && e.getAuthor().getId().equals(current.getId());
        if (!isOwner && current.getRole() != Role.ADMIN) {
            throw new BadRequestException("You can only modify your own experiences.");
        }
    }

    private int nz(Integer v) {
        return v == null ? 0 : v;
    }

    /** Map an entity to its public response, hiding author identity if anonymous. */
    public ExperienceResponse toResponse(Experience e) {
        ExperienceResponse r = new ExperienceResponse();
        r.setId(e.getId());
        r.setCategory(e.getCategory());
        r.setInstitutionType(e.getInstitutionType());
        r.setCity(e.getCity());
        r.setStepsTaken(e.getStepsTaken());
        r.setTestsPerformed(e.getTestsPerformed());
        r.setApproximateCost(e.getApproximateCost());
        r.setWaitingTime(e.getWaitingTime());
        r.setResultTime(e.getResultTime());
        r.setSummary(e.getSummary());
        r.setVerificationLevel(e.getVerificationLevel());
        r.setStatus(e.getStatus());
        r.setIsAnonymous(e.getIsAnonymous());
        r.setLikes(e.getLikes());
        r.setDislikes(e.getDislikes());
        r.setCreatedAt(e.getCreatedAt());

        User author = e.getAuthor();
        if (author != null) {
            // Trust score is always shown (it's about credibility, not identity).
            r.setAuthorTrustScore(author.getTrustScore());
            r.setAuthorTrustLabel(trustScoreService.label(author.getTrustScore()));

            if (Boolean.TRUE.equals(e.getIsAnonymous())) {
                r.setAuthorId(null);
                r.setAuthorDisplayName("Anonymous");
            } else {
                r.setAuthorId(author.getId());
                r.setAuthorDisplayName(author.getDisplayName());
            }
        }
        return r;
    }
}
