# API Routes

Base URL: `http://localhost:5000/api`

Authenticated requests must send: `Authorization: Bearer <JWT>`.

Access legend: **Public** · **User** (any logged-in user) · **Admin**.

---

## Auth

### POST `/auth/register` — Public
```json
{ "displayName": "Student User", "email": "student@example.com", "password": "Password123!" }
```
Response:
```json
{ "token": "eyJ...", "id": 5, "displayName": "Student User", "email": "student@example.com", "role": "USER", "trustScore": 50 }
```

### POST `/auth/login` — Public
```json
{ "email": "student@example.com", "password": "Password123!" }
```
Response: same shape as register.

### GET `/auth/me` — User
```json
{ "id": 5, "displayName": "Student User", "email": "student@example.com", "role": "USER",
  "trustScore": 50, "trustLabel": "Medium Trust", "likesReceived": 0, "dislikesReceived": 0, "reportsReceived": 0 }
```

---

## Experiences

### GET `/experiences` — Public
Query params (all optional): `search`, `city`, `category`, `institutionType`
(`PUBLIC_HOSPITAL`|`PRIVATE_CLINIC`), `verificationLevel`
(`SELF_REPORTED`|`DOCUMENT_SUPPORTED`|`HIGH_CONFIDENCE`), `minCost`, `maxCost`, `waitingTime`.

Example: `/experiences?city=Prishtina&institutionType=PUBLIC_HOSPITAL&maxCost=50`

Response (array):
```json
[{
  "id": 1, "category": "Cardiology", "institutionType": "PUBLIC_HOSPITAL", "city": "Prishtina",
  "stepsTaken": "GP referral -> ...", "testsPerformed": "ECG, ...", "approximateCost": 0.0,
  "waitingTime": "3 weeks", "resultTime": "2-5 days", "summary": "...",
  "verificationLevel": "DOCUMENT_SUPPORTED", "status": "PUBLISHED", "isAnonymous": true,
  "likes": 14, "dislikes": 1, "authorId": null, "authorDisplayName": "Anonymous",
  "authorTrustScore": 72, "authorTrustLabel": "Medium Trust", "createdAt": "2026-..."
}]
```

### GET `/experiences/{id}` — Public
Single experience (same shape as above).

### GET `/experiences/mine` — User
All experiences authored by the current user (any status).

### POST `/experiences` — User
```json
{ "category": "Neurology", "institutionType": "PUBLIC_HOSPITAL", "city": "Peja",
  "stepsTaken": "GP visit -> referral -> MRI", "testsPerformed": "MRI",
  "approximateCost": 0, "waitingTime": "2 weeks", "resultTime": "1 week",
  "summary": "Public neurology pathway", "isAnonymous": true }
```
Rejected with **400** if the text appears to contain personal identifiers.

### PUT `/experiences/{id}` — Owner or Admin
Same body as create.

### DELETE `/experiences/{id}` — Owner or Admin
Owner → soft-hide (status `HIDDEN`). Admin → hard delete. Returns **204**.

### POST `/experiences/{id}/vote` — User
```json
{ "type": "LIKE" }   // or { "type": "DISLIKE" }
```
Voting the same type again removes the vote (toggle). Returns the updated experience.

---

## Reports

### POST `/reports` — User
```json
{ "experienceId": 1, "reportedUserId": 2, "reason": "PERSONAL_INFO_EXPOSED",
  "explanation": "This post appears to include private details." }
```

### GET `/reports` — Admin
Array of reports.

### PATCH `/reports/{id}/status` — Admin
```json
{ "status": "REVIEWED" }   // PENDING | REVIEWED | DISMISSED | ACTION_TAKEN
```

---

## Verification

### POST `/verification/request` — User
```json
{ "experienceId": 1, "documentNote": "Supports the approximate cost and waiting time.",
  "fileName": "redacted-demo-file.pdf", "redactionConfirmed": true }
```
`redactionConfirmed` must be `true`.

### GET `/verification/my` — User
The current user's verification requests.

### GET `/verification/all` — Admin
All verification requests.

### PATCH `/verification/{id}/status` — Admin
```json
{ "status": "APPROVED", "adminNote": "Redaction confirmed. Cost evidence accepted.",
  "newVerificationLevel": "DOCUMENT_SUPPORTED" }
```
On `APPROVED`, the experience's verification level is raised and the author gets a trust bonus.

---

## Users

### GET `/users` — Admin
List of all users (with trust info).

### GET `/users/{id}` — User
A single user profile.

### GET `/users/{id}/trust` — Public
```json
{ "userId": 2, "trustScore": 72, "trustLabel": "Medium Trust" }
```

---

## Admin

### GET `/admin/dashboard` — Admin
```json
{ "totalUsers": 4, "totalExperiences": 10, "pendingReports": 2,
  "pendingVerificationRequests": 1, "hiddenExperiences": 0, "averageTrustScore": 66 }
```

### GET `/admin/reports` — Admin
Array of reports (same as `/reports`).

### GET `/admin/verification-requests` — Admin
Array of verification requests.

### PATCH `/admin/experiences/{id}/status` — Admin
```json
{ "status": "HIDDEN" }   // PUBLISHED | UNDER_REVIEW | HIDDEN
```

### PATCH `/admin/users/{id}/trust` — Admin
```json
{ "trustScore": 65 }
```

---

## Error format

All errors return a consistent JSON body:
```json
{ "timestamp": "2026-07-02T00:00:00", "status": 400, "error": "Bad Request",
  "message": "Your submission may contain personal information. Please remove identifiers before submitting." }
```
