# Final Project Summary

**HealthPath Kosovo** — a full-stack university MVP for healthcare transparency. Users read
and share **anonymous** patient journeys (costs, waiting times, tests, steps). The platform
explicitly avoids medical diagnosis or advice.

---

## What was implemented

- Full **Spring Boot + SQLite** backend with JWT auth, roles, and REST API.
- Full **React + Vite** frontend with routing, auth context, and API integration.
- Register / login, role-based access (guest / user / admin).
- Browse & filter experiences; view details.
- Submit experiences with **server-side privacy sanitization**.
- Like / dislike (one vote per user, changeable/toggle).
- Report content; admin moderation workflow.
- Optional **privacy-first verification** (documents never public).
- Community **trust score** system.
- **Limited guest access** (localStorage-based).
- Admin dashboard, report review, verification review.
- Seeded demo data (fictional).
- Documentation + Swagger UI.

---

## Backend architecture

Layered Spring Boot app (`com.kosovo.healthcareexperience`):

- **controller/** — thin REST endpoints, validation, role checks (`@PreAuthorize`).
- **service/** — business logic (Auth, User, Experience, Report, Verification, Admin,
  TrustScore, Sanitization).
- **repository/** — Spring Data JPA interfaces (+ `JpaSpecificationExecutor` for dynamic
  experience filtering).
- **entity/** — JPA entities mapped to SQLite tables.
- **dto/** — request/response objects, decoupling the API from entities.
- **security/** — `JwtService`, `JwtAuthenticationFilter`, `CustomUserDetailsService`.
- **config/** — `SecurityConfig` (stateless JWT, route rules), `CorsConfig`, `DataSeeder`.
- **exception/** — `GlobalExceptionHandler` for consistent JSON errors.

Runs on port **5000**. Verified: compiles, boots, creates the SQLite schema, seeds data, and
serves authenticated + public endpoints.

---

## Database design

Five entities: `User`, `Experience`, `Vote`, `Report`, `VerificationRequest`.
Key rules:

- One user → many experiences / votes / reports / verification requests.
- One vote per (user, experience) via a unique constraint; changing vote updates the row.
- Enums stored as strings with SQLite `CHECK` constraints.
- Author identity hidden in responses when the experience is anonymous.

See [`database-schema.md`](database-schema.md).

---

## Main features (how they work)

### Authentication
`AuthService` hashes passwords with BCrypt and issues a JWT (subject = email).
`JwtAuthenticationFilter` validates the `Bearer` token per request and sets the security
context. Sessions are stateless. Admin endpoints use `hasRole('ADMIN')`.

### Limited guest access
Guests have **no backend account**. The frontend tracks "meaningful actions" (searches,
detail views) in `localStorage` (`healthcare_guest_usage`, limit **5**). After the limit a
modal prompts Register / Login / Continue Limited Preview. Backend public endpoints still
return published experiences, so the app degrades gracefully.

### Optional verification system
Verification is optional and privacy-first. A user submits a note + (demo) file reference and
must confirm a **redaction checklist**. Admins approve/reject; approval raises the
experience's verification level (`DOCUMENT_SUPPORTED` / `HIGH_CONFIDENCE`) and gives the
author a trust bonus. **Uploaded documents are never shown publicly** — only a reference name
is stored in this MVP.

### Trust score system
`TrustScoreService` computes a 0–100 score: base 50, `+` likes received, `-` dislikes
received, `-5` per report received, plus verification bonuses; clamped to [0, 100].
Labels: 80–100 High Trust, 50–79 Medium Trust, 0–49 New / Low Trust. **Trust is community
credibility, not medical correctness.**

### Reporting / moderation
Any logged-in user can report an experience/user with a reason + optional explanation.
Reports start `PENDING`, increment the reported user's counter, and lower their trust.
Admins mark reports `REVIEWED` / `DISMISSED` / `ACTION_TAKEN` and can hide experiences.

### Privacy protections
- `SanitizationService` rejects submissions with obvious emails, phone numbers, long ID-like
  numbers, or address-like phrases.
- Anonymous submissions hide the author everywhere in the API.
- Documents are never public; only admins see a reference name.
- The medical disclaimer appears in the hero, footer, details page, and privacy page.

---

## Frontend structure

- `api/api.js` — all backend calls, JWT auto-attach, friendly offline handling.
- `context/AuthContext.jsx` — restores session via `/auth/me`, exposes login/register/logout.
- `components/` — reusable UI (cards, filters, modals, badges, route guards, states).
- `pages/` — one per route (Home, Search, ExperienceDetails, SubmitExperience, Privacy,
  Login, Register, Dashboard, AdminDashboard, AdminReports, AdminVerification).
- `styles/global.css` — a single calm, healthcare-style design system.

Runs on port **5173**. Verified: production build succeeds.

---

## Limitations

- Privacy sanitization is basic (regex) — not a real guarantee; needs human moderation.
- No real file upload/storage; verification stores a reference name only.
- No pagination or sorting yet; filtering is server-side but returns full result sets.
- SQLite single-writer; pool size 1 (fine for a demo, not for scale).
- No email verification, password reset, or rate limiting.
- Trust formula is simple and tunable, not statistically validated.

---

## Future improvements

- Encrypted document storage, admin-only viewer, deletion policy, audit logs.
- Stronger PII detection (NER) + moderation queue.
- Pagination, sorting, semantic search.
- Email verification, password reset, rate limiting, refresh tokens.
- GDPR alignment (right to erasure, retention policy).
- i18n (Albanian / Serbian).
- Docker deployment; managed database (e.g. PostgreSQL) for production.
