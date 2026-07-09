package com.kosovo.healthcareexperience.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

/**
 * Unit tests for the automatic NSFW / sensitive-content detection used to blur
 * attached images. Plain unit test (no Spring context) so it runs without
 * starting the web server.
 */
class SanitizationServiceTest {

    private final SanitizationService service = new SanitizationService();

    @Test
    void imageAttachment_isAlwaysSensitive() {
        assertTrue(service.isSensitive("image/png", "routine checkup, everything fine"));
        assertTrue(service.isSensitive("image/jpeg"));
    }

    @Test
    void graphicKeywordInText_isSensitive_evenWithoutImage() {
        assertTrue(service.isSensitive(null, "The surgery left a large wound with a lot of blood."));
        // Albanian keyword ("gjak" = blood) should also match.
        assertTrue(service.isSensitive(null, "Kishte shumë gjak pas operacionit."));
    }

    @Test
    void benignTextWithoutImage_isNotSensitive() {
        assertFalse(service.isSensitive(null, "Friendly staff, short waiting time, clear pricing."));
        assertFalse(service.isSensitive("application/pdf", "Lab result summary and cost breakdown."));
    }

    @Test
    void keywordMatchesOnlyOnWordBoundaries() {
        // "burn" is a keyword, but "sunburned sofa" style false positives should be avoided;
        // a plain unrelated word containing the letters must not trip it.
        assertFalse(service.isSensitive(null, "The reception area was clean and modern."));
    }
}
