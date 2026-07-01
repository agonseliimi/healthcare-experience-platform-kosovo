package com.kosovo.healthcareexperience.config;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.kosovo.healthcareexperience.entity.Experience;
import com.kosovo.healthcareexperience.entity.Report;
import com.kosovo.healthcareexperience.entity.User;
import com.kosovo.healthcareexperience.entity.VerificationRequest;
import com.kosovo.healthcareexperience.enums.ExperienceStatus;
import com.kosovo.healthcareexperience.enums.InstitutionType;
import com.kosovo.healthcareexperience.enums.ReportReason;
import com.kosovo.healthcareexperience.enums.ReportStatus;
import com.kosovo.healthcareexperience.enums.Role;
import com.kosovo.healthcareexperience.enums.VerificationLevel;
import com.kosovo.healthcareexperience.enums.VerificationStatus;
import com.kosovo.healthcareexperience.repository.ExperienceRepository;
import com.kosovo.healthcareexperience.repository.ReportRepository;
import com.kosovo.healthcareexperience.repository.UserRepository;
import com.kosovo.healthcareexperience.repository.VerificationRequestRepository;

/**
 * Seeds the database with demo data on startup, but ONLY if it is empty.
 *
 * All data below is FICTIONAL. No real people, patients, doctors, or specific
 * hospital accusations are included.
 *
 * Demo accounts (LOCAL DEMO ONLY):
 *   admin@healthcare-demo.local / Admin123!
 *   user1@healthcare-demo.local / User123!
 *   user2@healthcare-demo.local / User123!
 *   user3@healthcare-demo.local / User123!
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ExperienceRepository experienceRepository;
    private final ReportRepository reportRepository;
    private final VerificationRequestRepository verificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      ExperienceRepository experienceRepository,
                      ReportRepository reportRepository,
                      VerificationRequestRepository verificationRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.experienceRepository = experienceRepository;
        this.reportRepository = reportRepository;
        this.verificationRepository = verificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // Only seed once: skip if any users already exist.
        if (userRepository.count() > 0) {
            return;
        }

        User admin = createUser("Platform Admin", "admin@healthcare-demo.local", "Admin123!", Role.ADMIN, 90);
        User user1 = createUser("Blerina K.", "user1@healthcare-demo.local", "User123!", Role.USER, 72);
        User user2 = createUser("Arben M.", "user2@healthcare-demo.local", "User123!", Role.USER, 58);
        User user3 = createUser("Elira H.", "user3@healthcare-demo.local", "User123!", Role.USER, 44);

        userRepository.saveAll(List.of(admin, user1, user2, user3));

        // ---- Experiences (fictional, realistic) ----
        Experience e1 = exp(user1, "Cardiology", InstitutionType.PUBLIC_HOSPITAL, "Prishtina",
                "GP referral -> cardiology department -> ECG and blood tests -> echocardiogram scheduled -> follow-up.",
                "ECG, Full blood panel, Echocardiogram",
                0.0, "3 weeks for specialist appointment", "2-5 days for lab results",
                "Public cardiology pathway. Longer wait but no direct cost.",
                VerificationLevel.DOCUMENT_SUPPORTED, 14, 1);

        Experience e2 = exp(user2, "Dermatology", InstitutionType.PRIVATE_CLINIC, "Prizren",
                "Direct appointment (no referral) -> visual exam -> patch test -> prescription cream.",
                "Visual dermatology exam, Patch allergy test",
                45.0, "2 days for appointment", "Same day",
                "Fast private dermatology visit, moderate cost.",
                VerificationLevel.SELF_REPORTED, 6, 0);

        Experience e3 = exp(user3, "Orthopaedics", InstitutionType.PUBLIC_HOSPITAL, "Peja",
                "Emergency visit -> knee X-ray -> referred to specialist -> MRI recommended -> physiotherapy while waiting.",
                "X-ray, MRI",
                80.0, "6 weeks for MRI at public hospital; 3 days private", "1 week for MRI report",
                "Mixed public/private path due to long MRI waiting time.",
                VerificationLevel.HIGH_CONFIDENCE, 21, 2);

        Experience e4 = exp(user1, "General Practice", InstitutionType.PUBLIC_HOSPITAL, "Ferizaj",
                "Family doctor visit -> blood tests (thyroid, iron, vitamin D) -> iron supplementation -> follow-up after 6 weeks.",
                "Thyroid panel, CBC, Ferritin, Vitamin D",
                5.0, "1 day for appointment", "3-4 days for blood results",
                "Routine GP workup for fatigue, low cost.",
                VerificationLevel.SELF_REPORTED, 9, 0);

        Experience e5 = exp(user2, "Ophthalmology", InstitutionType.PRIVATE_CLINIC, "Prishtina",
                "Walk-in appointment -> full eye examination -> prescription for glasses.",
                "Visual acuity test, Refraction test, Fundus examination",
                30.0, "Same day / next day", "Immediate",
                "Quick private eye check, glasses prescription issued.",
                VerificationLevel.SELF_REPORTED, 4, 0);

        Experience e6 = exp(user3, "Gynaecology", InstitutionType.PUBLIC_HOSPITAL, "Gjilan",
                "GP referral -> routine gynaecological exam -> Pap smear -> results after 3 weeks.",
                "Pap smear, Pelvic ultrasound",
                0.0, "4-6 weeks for routine appointment", "3 weeks for Pap result",
                "Routine public gynaecology check-up.",
                VerificationLevel.DOCUMENT_SUPPORTED, 11, 1);

        Experience e7 = exp(user1, "Gastroenterology", InstitutionType.PRIVATE_CLINIC, "Gjakova",
                "Private consultation -> ultrasound of abdomen -> dietary advice -> follow-up in 1 month.",
                "Abdominal ultrasound, Blood tests",
                60.0, "3 days", "Same day for ultrasound",
                "Private GI consultation for recurring stomach discomfort.",
                VerificationLevel.SELF_REPORTED, 5, 0);

        Experience e8 = exp(user2, "Pulmonology", InstitutionType.PUBLIC_HOSPITAL, "Mitrovica",
                "GP referral -> chest X-ray -> spirometry -> inhaler prescribed -> review after 2 months.",
                "Chest X-ray, Spirometry",
                0.0, "2 weeks", "2 days for X-ray report",
                "Public pulmonology pathway for persistent cough.",
                VerificationLevel.SELF_REPORTED, 7, 1);

        Experience e9 = exp(user3, "Endocrinology", InstitutionType.PRIVATE_CLINIC, "Prishtina",
                "Private endocrinologist -> thyroid ultrasound -> blood hormone panel -> medication started.",
                "Thyroid ultrasound, Hormone panel",
                75.0, "4 days", "3 days for hormone results",
                "Private endocrinology visit for thyroid concern.",
                VerificationLevel.HIGH_CONFIDENCE, 16, 0);

        Experience e10 = exp(user1, "Dentistry", InstitutionType.PRIVATE_CLINIC, "Prizren",
                "Private dental clinic -> panoramic X-ray -> filling -> cleaning appointment scheduled.",
                "Panoramic dental X-ray",
                40.0, "Next day", "Immediate",
                "Routine private dental treatment.",
                VerificationLevel.SELF_REPORTED, 3, 0);

        experienceRepository.saveAll(List.of(e1, e2, e3, e4, e5, e6, e7, e8, e9, e10));

        // ---- A couple of demo reports ----
        Report r1 = new Report();
        r1.setReporter(user2);
        r1.setExperience(e3);
        r1.setReportedUser(e3.getAuthor());
        r1.setReason(ReportReason.FAKE_OR_MISLEADING);
        r1.setExplanation("Waiting time seems inconsistent with my own experience.");
        r1.setStatus(ReportStatus.PENDING);

        Report r2 = new Report();
        r2.setReporter(user3);
        r2.setExperience(e8);
        r2.setReportedUser(e8.getAuthor());
        r2.setReason(ReportReason.SPAM);
        r2.setExplanation("Looks like a duplicate post.");
        r2.setStatus(ReportStatus.PENDING);

        reportRepository.saveAll(List.of(r1, r2));

        // ---- A couple of demo verification requests ----
        VerificationRequest v1 = new VerificationRequest();
        v1.setUser(user1);
        v1.setExperience(e1);
        v1.setDocumentNote("Lab result supports the approximate cost and timeline.");
        v1.setFileName("redacted-demo-file.pdf");
        v1.setRedactionConfirmed(true);
        v1.setStatus(VerificationStatus.PENDING);

        VerificationRequest v2 = new VerificationRequest();
        v2.setUser(user3);
        v2.setExperience(e3);
        v2.setDocumentNote("MRI report (redacted) supports the waiting time described.");
        v2.setFileName("redacted-mri-note.pdf");
        v2.setRedactionConfirmed(true);
        v2.setStatus(VerificationStatus.APPROVED);
        v2.setAdminNote("Redaction confirmed. Evidence accepted.");

        verificationRepository.saveAll(List.of(v1, v2));

        System.out.println("[DataSeeder] Seeded demo users, experiences, reports and verification requests.");
    }

    private User createUser(String name, String email, String rawPassword, Role role, int trustScore) {
        User u = new User();
        u.setDisplayName(name);
        u.setEmail(email);
        u.setPasswordHash(passwordEncoder.encode(rawPassword));
        u.setRole(role);
        u.setTrustScore(trustScore);
        u.setLikesReceived(0);
        u.setDislikesReceived(0);
        u.setReportsReceived(0);
        return u;
    }

    private Experience exp(User author, String category, InstitutionType type, String city,
                           String steps, String tests, Double cost, String waiting, String resultTime,
                           String summary, VerificationLevel level, int likes, int dislikes) {
        Experience e = new Experience();
        e.setAuthor(author);
        e.setCategory(category);
        e.setInstitutionType(type);
        e.setCity(city);
        e.setStepsTaken(steps);
        e.setTestsPerformed(tests);
        e.setApproximateCost(cost);
        e.setWaitingTime(waiting);
        e.setResultTime(resultTime);
        e.setSummary(summary);
        e.setVerificationLevel(level);
        e.setStatus(ExperienceStatus.PUBLISHED);
        e.setIsAnonymous(true);
        e.setLikes(likes);
        e.setDislikes(dislikes);
        // Reflect likes/dislikes on the author's counters so trust looks consistent.
        author.setLikesReceived(author.getLikesReceived() + likes);
        author.setDislikesReceived(author.getDislikesReceived() + dislikes);
        return e;
    }
}
