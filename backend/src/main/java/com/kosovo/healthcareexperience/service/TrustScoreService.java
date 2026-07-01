package com.kosovo.healthcareexperience.service;

import org.springframework.stereotype.Service;

import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.repository.UserRepository;

/**
 * Computes a community trust score (0-100) for a user.
 *
 * IMPORTANT: Trust score reflects COMMUNITY CREDIBILITY, not medical
 * correctness. It must never be interpreted as a judgement of medical accuracy.
 *
 * Formula (simple, tunable):
 *   base 50
 *   + likes received
 *   - dislikes received
 *   - 5 per report received
 *   (verification bonuses are applied when experiences get verified)
 * Result is always clamped to [0, 100].
 */
@Service
public class TrustScoreService {

    private static final int BASE_SCORE = 50;

    private final UserRepository userRepository;

    public TrustScoreService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** Recompute and persist a user's trust score from their counters. */
    public int recalculate(User user) {
        int score = BASE_SCORE;
        score += nz(user.getLikesReceived());
        score -= nz(user.getDislikesReceived());
        score -= nz(user.getReportsReceived()) * 5;
        score = clamp(score);

        user.setTrustScore(score);
        userRepository.save(user);
        return score;
    }

    /** Apply a one-off bonus (e.g. when an experience becomes verified). */
    public int applyVerificationBonus(User user, int bonus) {
        int score = clamp(nz(user.getTrustScore()) + bonus);
        user.setTrustScore(score);
        userRepository.save(user);
        return score;
    }

    /** Human-readable label for a score. */
    public String label(Integer score) {
        int s = nz(score);
        if (s >= 80) return "High Trust";
        if (s >= 50) return "Medium Trust";
        return "New / Low Trust";
    }

    private int clamp(int value) {
        return Math.max(0, Math.min(100, value));
    }

    private int nz(Integer value) {
        return value == null ? 0 : value;
    }
}
