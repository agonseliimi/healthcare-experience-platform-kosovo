# HealthPath Kosovo — Healthcare Experience Platform

> A full-stack university MVP for **healthcare transparency** in Kosovo.
> Read and share **anonymous patient journeys** — costs, waiting times, tests, and steps.

> ⚠️ **Medical disclaimer:** This platform does not provide medical diagnosis or medical
> advice. It only helps users understand anonymous patient journeys. Always consult a
> qualified healthcare professional for medical decisions. This is **not** a production
> medical system.

---

## The problem

Patients in Kosovo often have no easy way to know what to expect before visiting a
healthcare institution: how much a visit or test approximately costs, how long the waiting
times are, and what steps a typical journey involves. This information is scattered and
mostly shared privately.

## Project goal

Build a clean, functional platform where people can **anonymously** share and browse
healthcare experiences to improve transparency around:

- approximate costs
- waiting times
- patient journey steps
- tests performed
- public vs private institution experience
- community trust

…while **strictly avoiding** diagnosis, treatment, emergency advice, or rating medical
correctness.

---

## Tech stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | React 18, Vite 5, JavaScript, React Router, i18next, plain CSS |
| Backend   | Java 17+, Spring Boot 3.4.5, Spring Web, Spring Data JPA, Spring Security |
| Auth      | JWT (jjwt) + BCrypt password hashing |
| Database  | SQLite (via `sqlite-jdbc` + Hibernate community SQLite dialect) |
| Docs      | Swagger UI (springdoc-openapi) at `/swagger-ui.html` |

---

## Main features

- Browse & filter anonymous experiences (city, category, institution, cost, waiting, verification)
- Register / login with JWT; roles: **guest**, **user**, **admin**
- Submit, edit, and hide experiences with server-side privacy sanitization
- Publish anonymously or use an optional display name (email addresses are never public)
- Add and display up to 10 reported symptoms per experience
- Attach a public supporting PDF or image; images can be redacted with the built-in blur tool
- Save journeys locally and receive similar-journey suggestions based on symptoms, category, and city
- Send privacy-conscious feedback through a backend SMTP integration
- Like / dislike with immediate vote feedback (one vote per user, changeable)
- Report content for moderation
- Optional, privacy-first verification workflow with separate admin-only documents
- Community **trust score** (credibility, not medical accuracy)
- Admin dashboard, report review, and verification review
- Limited guest access (5 free actions, tracked in localStorage)
- Albanian / English localization and accessibility preferences (text size, dark mode,
  high contrast, and reduced motion)

---

## Repository structure

```
healthcare-experience-platform-kosovo/
├── frontend/     # React + Vite app
├── backend/      # Java Spring Boot app
├── docs/         # Project documentation
└── README.md
```

---

## How to run

The frontend and backend run in **two separate terminals**.

### Prerequisites

- Java 17 or newer
- Node.js 18 or newer
- npm (bundled with Node.js)

Maven does not need to be installed globally because the repository includes the Maven
Wrapper.

### Windows: one-command launcher (recommended)

From the repository root, double-click `run-app.cmd` or run:

```bat
run-app.cmd
```

The launcher checks Java, Node.js, npm, and the required ports; installs frontend
dependencies when they are missing; then opens the backend and frontend in separate
terminals. It calls `npm.cmd` directly, so it also works when Windows PowerShell blocks
the `npm.ps1` script. Running the launcher again is safe because it does not start a
second process when ports 5000 or 5173 are already active.

### 1. Backend (Spring Boot, port 5000)

```bash
cd backend

# Using the Maven wrapper (recommended):
./mvnw spring-boot:run          # macOS / Linux
mvnw.cmd spring-boot:run        # Windows

# Or with a local Maven install:
mvn spring-boot:run
```

On first start the backend:
- creates `backend/data/healthcare_experience.db` automatically,
- generates the schema,
- seeds demo users and experiences (only if the database is empty).

API docs: <http://localhost:5000/swagger-ui.html>

### 2. Frontend (React + Vite, port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>.

> The frontend expects the backend at `http://localhost:5000/api`. If the backend is not
> running, the UI shows a friendly error instead of crashing.

### Public evidence vs private verification documents

The project intentionally supports two different document flows:

- **Public supporting evidence:** an optional PDF or image attached while creating an
  experience. It is displayed on the public experience-details page. Images can be
  redacted with the built-in blur tool before upload; PDFs are published exactly as sent.
- **Private verification evidence:** an optional document submitted through the backend
  verification workflow. It is stored under `backend/data/uploads` and can only be
  downloaded by an authenticated administrator. It is never exposed by a public endpoint.

Users must remove names, identifiers, addresses, and other sensitive information before
uploading either type of document. The MVP does not provide automatic PII guarantees.

### Feedback email configuration

The public **Contact Us** page calls `POST /api/feedback`; the React app
never receives SMTP credentials. Configure the backend with environment variables before
starting it:

| Variable | Purpose | Default |
|----------|---------|---------|
| `MAIL_HOST` | SMTP hostname | `localhost` |
| `MAIL_PORT` | SMTP port | `587` |
| `MAIL_USERNAME` | SMTP username | empty |
| `MAIL_PASSWORD` | SMTP password | empty |
| `MAIL_SMTP_AUTH` | Enable SMTP authentication | `true` |
| `MAIL_STARTTLS` | Enable STARTTLS | `true` |
| `MAIL_STARTTLS_REQUIRED` | Require STARTTLS | `false` |
| `APP_FEEDBACK_FROM` | Sender address | `MAIL_USERNAME` or local placeholder |
| `APP_FEEDBACK_RECIPIENT` | Feedback destination | `aulon.miftari@student.uni-pr.edu` |

Example PowerShell setup with fake values:

```powershell
$env:MAIL_HOST = "smtp.example.test"
$env:MAIL_USERNAME = "smtp-user@example.test"
$env:MAIL_PASSWORD = "replace-with-a-local-secret"
$env:APP_FEEDBACK_FROM = "noreply@example.test"
```

Use valid SMTP credentials or an approved transactional email provider to test delivery.
Never commit secrets to properties files, `.env` files, frontend variables, or source code.

---

## SQLite database

- The database is a single file: `backend/data/healthcare_experience.db`.
- It is created automatically at startup; the `backend/data/` folder is created if missing.
- Managed by Spring Data JPA / Hibernate using the community **SQLite dialect**.
- `spring.jpa.hibernate.ddl-auto=update` keeps the schema in sync during development.
- Symptoms are stored in the `experience_symptoms` table and linked to `experiences`.
- Existing rows without symptoms remain valid and are returned with `symptoms: []`.
- The `.db` file is **git-ignored** — delete it any time to get a fresh seeded database.

---

## Seed demo accounts

> **These credentials are for local demo only.**

| Role  | Email                          | Password    |
|-------|--------------------------------|-------------|
| Admin | admin@healthcare-demo.local    | Admin123!   |
| User  | user1@healthcare-demo.local    | User123!    |
| User  | user2@healthcare-demo.local    | User123!    |
| User  | user3@healthcare-demo.local    | User123!    |

---

## Future roadmap

- Encrypt private verification documents and add retention/deletion policies and audit logs
- Stronger privacy filtering (NER models) + human moderation queue
- Pagination, sorting, and semantic search
- Email verification and password reset
- GDPR-aligned data policy, right-to-erasure, audit logs
- Serbian localization and broader internationalization coverage
- Deployment (Docker) and a managed database (e.g. PostgreSQL) for production

---

## Documentation

- [`docs/permbledhje-projekti-sq.md`](docs/permbledhje-projekti-sq.md) - detailed functional and structural project summary in Albanian
- [`docs/final-project-summary.md`](docs/final-project-summary.md)
- [`docs/database-schema.md`](docs/database-schema.md)
- [`docs/api-routes.md`](docs/api-routes.md)
- [`frontend/README.md`](frontend/README.md)
- [`backend/README.md`](backend/README.md)
