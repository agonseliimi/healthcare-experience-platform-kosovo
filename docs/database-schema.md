# Database Schema

SQLite database managed by Spring Data JPA / Hibernate.
File: `backend/data/healthcare_experience.db`.

## Entities & tables

### `users`
| Field            | Type          | Notes                                  |
|------------------|---------------|----------------------------------------|
| id               | Long (PK)     | auto-increment                         |
| displayName      | String        | not null                               |
| email            | String        | not null, **unique**                   |
| passwordHash     | String        | BCrypt hash (never plaintext)          |
| role             | enum          | `USER`, `ADMIN`                        |
| trustScore       | Integer       | 0–100, community credibility           |
| likesReceived    | Integer       | aggregate counter                      |
| dislikesReceived | Integer       | aggregate counter                      |
| reportsReceived  | Integer       | aggregate counter                      |
| createdAt        | LocalDateTime | set on insert                          |
| updatedAt        | LocalDateTime | set on update                          |

### `experiences`
| Field             | Type          | Notes                                             |
|-------------------|---------------|---------------------------------------------------|
| id                | Long (PK)     |                                                   |
| author_id         | FK → users    | not null (many experiences → one user)            |
| category          | String        | e.g. Cardiology                                   |
| institutionType   | enum          | `PUBLIC_HOSPITAL`, `PRIVATE_CLINIC`               |
| city              | String        |                                                   |
| stepsTaken        | String(4000)  | journey steps                                     |
| testsPerformed    | String(2000)  |                                                   |
| approximateCost   | Double        | in EUR                                            |
| waitingTime       | String        | free text (e.g. "2 weeks")                        |
| resultTime        | String        | free text                                         |
| summary           | String(4000)  |                                                   |
| verificationLevel | enum          | `SELF_REPORTED`, `DOCUMENT_SUPPORTED`, `HIGH_CONFIDENCE` |
| status            | enum          | `PUBLISHED`, `UNDER_REVIEW`, `HIDDEN`             |
| isAnonymous       | Boolean       | hides author when true                            |
| likes             | Integer       |                                                   |
| dislikes          | Integer       |                                                   |
| createdAt/updatedAt | LocalDateTime |                                                 |

### `experience_symptoms`
| Field         | Type       | Notes                                      |
|---------------|------------|--------------------------------------------|
| experience_id | FK → experiences | owning experience                   |
| position      | Integer    | preserves user-entered order               |
| symptom       | String(80) | trimmed symptom value; maximum 10 per post |

This element-collection table is created non-destructively by Hibernate `ddl-auto=update`.
Experiences created before the feature simply have no related rows and are returned through
the API with an empty `symptoms` list.

### `votes`
| Field         | Type        | Notes                                        |
|---------------|-------------|----------------------------------------------|
| id            | Long (PK)   |                                              |
| user_id       | FK → users  | not null                                     |
| experience_id | FK → exps   | not null                                     |
| type          | enum        | `LIKE`, `DISLIKE`                            |
| createdAt     | LocalDateTime |                                            |

**Unique constraint** on `(user_id, experience_id)` → one vote per user per experience.

### `reports`
| Field            | Type          | Notes                                        |
|------------------|---------------|----------------------------------------------|
| id               | Long (PK)     |                                              |
| reporter_id      | FK → users    | not null                                     |
| experience_id    | FK → exps     | nullable                                     |
| reported_user_id | FK → users    | nullable                                     |
| reason           | enum          | `PERSONAL_INFO_EXPOSED`, `MEDICAL_ADVICE`, `OFFENSIVE_CONTENT`, `FAKE_OR_MISLEADING`, `SPAM`, `OTHER` |
| explanation      | String(2000)  |                                              |
| status           | enum          | `PENDING`, `REVIEWED`, `DISMISSED`, `ACTION_TAKEN` |
| createdAt/updatedAt | LocalDateTime |                                           |

### `verification_requests`
| Field              | Type          | Notes                                        |
|--------------------|---------------|----------------------------------------------|
| id                 | Long (PK)     |                                              |
| user_id            | FK → users    | not null                                     |
| experience_id      | FK → exps     | not null                                     |
| documentNote       | String(2000)  |                                              |
| fileName           | String        | nullable — **demo reference only, never public** |
| redactionConfirmed | Boolean       |                                              |
| status             | enum          | `NOT_REQUESTED`, `PENDING`, `APPROVED`, `REJECTED` |
| adminNote          | String(2000)  | nullable                                     |
| createdAt/updatedAt | LocalDateTime |                                           |

## Relationships

```
User 1 ────< Experience        (author)
User 1 ────< Vote
User 1 ────< Report            (as reporter)
User 1 ────< Report            (as reported user, nullable)
User 1 ────< VerificationRequest
Experience 1 ────< Vote
Experience 1 ────< Report      (nullable)
Experience 1 ────< VerificationRequest
```

## Notes

- Enums are stored as strings (`@Enumerated(STRING)`) with SQLite `CHECK` constraints.
- Timestamps are populated via JPA lifecycle callbacks (`@PrePersist` / `@PreUpdate`).
- Author identity is hidden in API responses when `isAnonymous = true`; the trust score is
  still exposed because it reflects credibility, not identity.
