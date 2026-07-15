package com.kosovo.healthcareexperience.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.kosovo.healthcareexperience.dto.experience.ExperienceRequest;
import com.kosovo.healthcareexperience.dto.experience.ExperienceResponse;
import com.kosovo.healthcareexperience.entity.Experience;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.enums.ExperienceStatus;
import com.kosovo.healthcareexperience.enums.InstitutionType;
import com.kosovo.healthcareexperience.repository.ExperienceRepository;
import com.kosovo.healthcareexperience.repository.VoteRepository;

class ExperienceSymptomsTest {

    private ExperienceRepository repository;
    private User author;
    private ExperienceService service;

    @BeforeEach
    void setUp() {
        repository = mock(ExperienceRepository.class);
        UserService userService = mock(UserService.class);
        TrustScoreService trustScoreService = mock(TrustScoreService.class);
        author = new User();
        author.setId(7L);
        author.setTrustScore(50);
        when(userService.getCurrentUser()).thenReturn(author);
        when(trustScoreService.label(any())).thenReturn("Medium Trust");
        when(repository.save(any(Experience.class))).thenAnswer(invocation -> {
            Experience saved = invocation.getArgument(0);
            if (saved.getId() == null) saved.setId(42L);
            return saved;
        });
        service = new ExperienceService(repository, mock(VoteRepository.class), userService,
                trustScoreService, new SanitizationService());
    }

    @Test
    void createsExperienceWithSymptomsAndRemovesDuplicates() {
        ExperienceRequest request = validRequest();
        request.setSymptoms(List.of(" Headache ", "headache", "Fever"));

        ExperienceResponse response = service.create(request, null);

        assertEquals(List.of("Headache", "Fever"), response.getSymptoms());
    }

    @Test
    void retrievingExperienceReturnsSymptoms() {
        Experience experience = existingExperience();
        experience.setSymptoms(List.of("Cough", "Fatigue"));
        when(repository.findById(9L)).thenReturn(Optional.of(experience));

        assertEquals(List.of("Cough", "Fatigue"), service.getByIdAsResponse(9L).getSymptoms());
    }

    @Test
    void olderExperienceWithoutSymptomsReturnsEmptyList() {
        Experience experience = existingExperience();
        when(repository.findById(9L)).thenReturn(Optional.of(experience));

        assertTrue(service.getByIdAsResponse(9L).getSymptoms().isEmpty());
    }

    private ExperienceRequest validRequest() {
        ExperienceRequest request = new ExperienceRequest();
        request.setCategory("Neurology");
        request.setInstitutionType(InstitutionType.PUBLIC_HOSPITAL);
        request.setCity("Prishtina");
        request.setStepsTaken("Family doctor and specialist visit");
        request.setIsAnonymous(true);
        return request;
    }

    private Experience existingExperience() {
        Experience experience = new Experience();
        experience.setId(9L);
        experience.setAuthor(author);
        experience.setCategory("General Practice");
        experience.setInstitutionType(InstitutionType.PUBLIC_HOSPITAL);
        experience.setCity("Prishtina");
        experience.setStepsTaken("Family doctor visit");
        experience.setStatus(ExperienceStatus.PUBLISHED);
        return experience;
    }
}
