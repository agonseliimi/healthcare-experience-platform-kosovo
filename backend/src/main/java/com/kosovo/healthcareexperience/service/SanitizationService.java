package com.kosovo.healthcareexperience.service;

import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

/**
 * Best-effort check for obvious personal identifiers in submitted text.
 *
 * IMPORTANT: This is intentionally simple for a university MVP. Real privacy
 * protection would require:
 *   - much stronger detection (NER models, address gazetteers, etc.)
 *   - human moderation
 *   - configurable rules per locale/language
 *   - continuous review
 * Do NOT rely on this as a real privacy guarantee.
 */
@Service
public class SanitizationService {

    // Matches email addresses.
    private static final Pattern EMAIL =
            Pattern.compile("[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}");

    // Matches phone-number-like sequences (>= 8 digits, allowing spaces/+/-/()).
    private static final Pattern PHONE =
            Pattern.compile("(\\+?\\d[\\d\\s().-]{7,}\\d)");

    // Matches long digit runs that look like personal ID numbers (10+ digits).
    private static final Pattern LONG_ID =
            Pattern.compile("\\b\\d{10,}\\b");

    // Matches simple street-address-like phrases ("Rr. ...", "Street ...", "Rruga ...").
    private static final Pattern ADDRESS =
            Pattern.compile("(?i)\\b(rr\\.|rruga|street|str\\.|avenue|ave\\.)\\s+\\w+");

    /**
     * @return true if the text appears to contain a personal identifier.
     */
    public boolean containsPersonalInfo(String... texts) {
        for (String text : texts) {
            if (text == null || text.isBlank()) {
                continue;
            }
            if (EMAIL.matcher(text).find()) return true;
            if (PHONE.matcher(text).find()) return true;
            if (LONG_ID.matcher(text).find()) return true;
            if (ADDRESS.matcher(text).find()) return true;
        }
        return false;
    }
}
