# HealthPath Kosovo — Backend

Java **Spring Boot** REST API with **SQLite** persistence, **JWT** authentication, and
role-based access control.

> This service supports a healthcare *transparency* platform. It does not provide medical
> diagnosis or advice, and is a university MVP — not a production medical system.

---

## Stack

- Java 17+ (built/tested on JDK 24; compiled to Java 17 bytecode)
- Spring Boot 3.4 (Web, Data JPA, Security, Validation)
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
- `/api/experiences` — list/filter, get, create, update, delete, vote, mine
- `/api/reports` — create, list (admin), update status (admin)
- `/api/verification` — request, my, all (admin), update status (admin)
- `/api/users` — list (admin), get, trust
- `/api/admin` — dashboard, reports, verification-requests, experience status, user trust

---

## Privacy & production notes

- `SanitizationService` performs a **basic** check for emails, phone numbers, long ID-like
  numbers, and address-like phrases, and rejects such submissions. This is intentionally
  simple; production would need much stronger detection **plus human moderation**.
- Verification documents are **never public**. In this MVP only a file-name reference and
  a note are stored. Real document handling would require encryption, strict access control,
  a deletion/retention policy, audit logs, and legal/privacy review (see comments in
  `VerificationRequest.java`).
