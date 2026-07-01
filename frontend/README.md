# HealthPath Kosovo — Frontend

React + Vite single-page app for the healthcare transparency platform.

> This app does not provide medical advice. It shows anonymous patient journeys only.

---

## Stack

- **React 18** + **Vite 5**
- **React Router 6** for routing
- **Context API** for authentication state
- Plain **CSS** (single `src/styles/global.css` design system)
- Native `fetch` for API calls (no axios)

---

## Run

```bash
cd frontend
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

The backend must be running at `http://localhost:5000` (see `backend/README.md`).

---

## Pages & routes

| Route                  | Page                | Access        |
|------------------------|---------------------|---------------|
| `/`                    | Home                | Public        |
| `/search`              | Search / browse     | Public (guest-limited) |
| `/experiences/:id`     | Experience details  | Public (guest-limited) |
| `/privacy`             | Privacy & Trust     | Public        |
| `/login`               | Login               | Public        |
| `/register`            | Register            | Public        |
| `/submit`              | Submit experience   | User          |
| `/dashboard`           | User dashboard      | User          |
| `/admin`               | Admin dashboard     | Admin         |
| `/admin/reports`       | Report moderation   | Admin         |
| `/admin/verification`  | Verification review | Admin         |

Route protection is handled by `components/ProtectedRoute.jsx` (auth) and
`components/AdminRoute.jsx` (admin).

---

## Structure

```
frontend/src/
├── api/api.js            # All backend calls; attaches JWT automatically
├── context/AuthContext.jsx  # Current user + login/register/logout
├── components/           # Reusable UI (Navbar, Footer, ExperienceCard, modals, badges, ...)
├── pages/                # One component per route
├── utils/
│   ├── constants.js      # Cities, categories, enums for dropdowns
│   └── guestUsage.js     # Guest limit tracking (localStorage)
└── styles/global.css     # Design tokens + all component styles
```

### Key components

- `Navbar`, `Footer`, `Hero`
- `ExperienceCard` — one experience with like/dislike/report/view actions
- `SearchFilters` — city, category, institution, cost range, waiting, verification
- `SubmitExperienceForm` — posts a new experience (+ optional verification)
- `PrivacySection` — trust & privacy content
- `GuestLimitBanner`, `ReportModal`, `TrustBadge`, `VerificationBox`
- `ProtectedRoute`, `AdminRoute`, `LoadingState`, `ErrorState`

---

## API connection

`src/api/api.js`:

- base URL `http://localhost:5000/api`
- automatically adds `Authorization: Bearer <token>` from `localStorage`
- every call is wrapped in try/catch and throws a readable `Error`
- if the backend is offline, a friendly message is shown (the UI never crashes)

---

## Guest access

Guests (not logged in) can browse the home page and a limited number of searches /
detail views. Usage is tracked in `localStorage` under `healthcare_guest_usage`
(limit **5** meaningful actions). After the limit a modal prompts the guest to
**Register**, **Login**, or **Continue Limited Preview**.

Guests cannot submit experiences, vote, report, request verification, or open the
dashboard — those actions trigger a login/register prompt.
