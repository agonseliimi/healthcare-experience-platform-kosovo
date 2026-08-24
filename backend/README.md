# HealthPath Kosovo — Backend

Java **Spring Boot** REST API with **SQLite** persistence, **JWT** authentication, and
role-based access control.

> This service supports a healthcare *transparency* platform. It does not provide medical
> diagnosis or advice, and is a university MVP — not a production medical system.

---

## Stack

- Java 17+ (built/tested on JDK 24; compiled to Java 17 bytecode)
- Spring Boot 3.4.5 (Web, Data JPA, Security, Validation)
- Spring Mail (`JavaMailSender`) for backend-only feedback delivery
- SQLite via `org.xerial:sqlite-jdbc`
- Hibernate community **SQLite dialect** (`hibernate-community-dialects`)
- JWT via `io.jsonwebtoken:jjwt`
- BCrypt password hashing
- springdoc-openapi (Swagger UI)

---

## Run

```bash
cd backend

./mvnw spring-boot:run       # macOS / Linux
mvnw.cmd spring-boot:run     # Windows
# or:  mvn spring-boot:run   (if Maven is installed)

# Build a jar:
./mvnw clean install
```

The server starts on **http://localhost:5000**.
Swagger UI: **http://localhost:5000/swagger-ui.html**

---

## Layered architecture

```
backend/src/main/java/com/kosovo/healthcareexperience/
├── HealthcareExperienceApplication.java   # entry point (also ensures ./data exists)
├── config/          # SecurityConfig, CorsConfig, DataSeeder
├── controller/      # REST endpoints (Auth, User, Experience, Report, Verification, Admin)
├── dto/             # Request/response objects (auth, experience, report, verification)
├── entity/          # JPA entities (User, Experience, Vote, Report, VerificationRequest)
├── enums/           # Role, InstitutionType, VerificationLevel, ExperienceStatus, ...
├── exception/       # GlobalExceptionHandler + custom exceptions
├── repository/      # Spring Data JPA repositories
├── security/        # JwtService, JwtAuthenticationFilter, CustomUserDetailsService
└── service/         # Business logic (Auth, User, Experience, Report, Verification,
                     #                  Admin, TrustScore, Sanitization)
```

---

## SQLite database setup

- Configured in `src/main/resources/application.properties`.
- URL: `jdbc:sqlite:data/healthcare_experience.db` (relative to the backend folder).
- The `data/` directory is created automatically on startup.
- Dialect: `org.hibernate.community.dialect.SQLiteDialect`.
- `spring.jpa.hibernate.ddl-auto=update` auto-creates/updates tables.
- Connection pool is limited to 1 (`hikari.maximum-pool-size=1`) because SQLite is a
  single-writer file database — this avoids "database is locked" errors in the demo.
- Delete `data/*.db` to reset to a fresh, re-seeded database.

---

## Document storage model

The backend supports two separate document flows with different visibility rules.

### Public experience documents

- An optional PDF or image can be uploaded as part of `POST /api/experiences`.
- The document bytes, original name, and content type are stored on the `Experience` entity
  in SQLite.
- Published experience documents are returned through `GET /api/experiences/{id}/document`
  and are intentionally visible on the public details page.
- The frontend can blur/redact images before upload. PDFs are accepted as provided, so users
  must remove sensitive information themselves.

### Private verification documents

- An optional document can be uploaded through `POST /api/verification/request`.
- The file is stored under `backend/data/uploads` using a generated server-side name; only
  its metadata and storage reference are kept in the verification database row.
- Download is available only through the admin-protected
  `GET /api/verification/{id}/document` endpoint.
- Verification documents are never exposed through public experience responses or public
  file URLs.

---

## Authentication & roles

- `POST /api/auth/register` and `/login` return a **JWT** (subject = email).
- Passwords are hashed with **BCrypt**; plaintext is never stored or returned.
- `JwtAuthenticationFilter` reads `Authorization: Bearer <token>` on each request.
- Stateless sessions (no server session state).
- Method-level security via `@PreAuthorize`:
  - `isAuthenticated()` for user actions
  - `hasRole('ADMIN')` for admin actions
- CORS allows the frontend origin `http://localhost:5173` (see `CorsConfig`).

**JWT secret:** configured via `app.jwt.secret` in `application.properties`. The bundled
value is for **local development only**. For any real deployment, load a long random secret
from an environment variable and never commit it. See `application-example.properties`.

---

## Seeded demo accounts

Seeded once on first startup (only if the database is empty):

| Role  | Email                          | Password  |
|-------|--------------------------------|-----------|
| Admin | admin@healthcare-demo.local    | Admin123! |
| User  | user1@healthcare-demo.local    | User123!  |
| User  | user2@healthcare-demo.local    | User123!  |
| User  | user3@healthcare-demo.local    | User123!  |

Plus 10 fictional experiences across Kosovo cities, a couple of reports, and verification
requests. **All seed data is fictional** — no real people, patients, or doctors.

> These credentials are for local demo only.

---

## API routes

See [`../docs/api-routes.md`](../docs/api-routes.md) for the full list with request/response
examples. Summary:

- `/api/auth` — register, login, me
- `/api/feedback` — public feedback email submission (rate-limited)
- `/api/experiences` — list/filter, get, create, update, delete, vote, mine
- `/api/reports` — create, list (admin), update status (admin)
- `/api/verification` — request, my, all (admin), update status (admin)
- `/api/users` — list (admin), get, trust
- `/api/admin` — dashboard, reports, verification-requests, experience status, user trust

### SMTP configuration

Feedback delivery requires `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, and `MAIL_PASSWORD`
for a valid SMTP account/provider. Optional settings are `MAIL_SMTP_AUTH`, `MAIL_STARTTLS`,
`MAIL_STARTTLS_REQUIRED`, `APP_FEEDBACK_FROM`, and `APP_FEEDBACK_RECIPIENT`. The recipient
defaults to `aulon.miftari@student.uni-pr.edu`. See `application-example.properties` for
placeholders. Do not commit real credentials.

Automated tests mock `JavaMailSender` and never send real email. For a manual delivery test,
set the environment variables, start the backend, and submit the Contact Us form. A `200`
response confirms that the configured mail sender accepted the send call; confirm receipt
with the configured mailbox/provider logs.

---

## Privacy & production notes

- `SanitizationService` performs a **basic** check for emails, phone numbers, long ID-like
  numbers, and address-like phrases, and rejects such submissions. This is intentionally
  simple; production would need much stronger detection **plus human moderation**.
- Public experience documents are deliberately visible to visitors, so contributors must
  remove identifying information before upload. The frontend blur tool helps with images
  but does not inspect PDFs.
- Private verification documents are stored on disk and restricted to administrators.
  Production use would still require encryption at rest, malware scanning, strict retention
  and deletion policies, audit logs, backups, and a legal/privacy review.
