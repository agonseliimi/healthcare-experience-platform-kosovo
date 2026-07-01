package com.kosovo.healthcareexperience.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.exception.ResourceNotFoundException;
import com.kosovo.healthcareexperience.repository.UserRepository;

/**
 * User lookups and the helper for retrieving the currently authenticated user.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final TrustScoreService trustScoreService;

    public UserService(UserRepository userRepository, TrustScoreService trustScoreService) {
        this.userRepository = userRepository;
        this.trustScoreService = trustScoreService;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    /**
     * Returns the user for the current JWT-authenticated request.
     * The Spring Security principal username is the user's email.
     */
    public User getCurrentUser() {
        User user = getCurrentUserOrNull();
        if (user == null) {
            throw new ResourceNotFoundException("No authenticated user in the current request.");
        }
        return user;
    }

    /**
     * Returns the current user, or {@code null} if the request is anonymous.
     * Useful for public endpoints that behave differently for logged-in users.
     */
    public User getCurrentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return userRepository.findByEmail(auth.getName()).orElse(null);
    }

    public String trustLabel(Integer score) {
        return trustScoreService.label(score);
    }

    /** Admin action: manually override a user's trust score. */
    public User updateTrustScore(Long userId, int trustScore) {
        User user = getById(userId);
        user.setTrustScore(Math.max(0, Math.min(100, trustScore)));
        return userRepository.save(user);
    }
}
