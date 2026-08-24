# HealthPath Kosovo - Frontend

React + Vite single-page application for the HealthPath Kosovo healthcare transparency
platform.

> This application does not provide medical advice. It presents community-reported patient
> journeys for practical orientation only.

---

## Stack

- **React 18** + **Vite 5**
- **React Router 6** for client-side routing
- **i18next** + **react-i18next** for Albanian / English localization
- **Context API** for authentication and accessibility state
- Plain **CSS** in `src/styles/global.css`
- Native `fetch` for API calls (no axios)

---

## Prerequisites

- Node.js 18 or newer
- npm
- The backend running on port `5000`

---

## Run

```bash
cd frontend
npm install
npm run dev      # development server at http://localhost:5173
npm run build    # production build into dist/
npm run preview  # preview the production build
```

During development, Vite proxies `/api` to `http://localhost:5000`. Set
`VITE_API_BASE_URL` when the backend is hosted on a different origin.

---

## Pages and routes

| Route | Page | Access |
|---|---|---|
| `/` | Home | Public |
| `/search` | Search / browse | Public (guest-limited) |
| `/experiences/:id` | Experience details | Public (guest-limited) |
| `/privacy` | Privacy & Trust | Public |
| `/contact` | Contact / feedback | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/submit` | Submit experience | User |
| `/experiences/:id/edit` | Edit experience | Author / Admin |
| `/dashboard` | User dashboard and saved journeys | User |
| `/admin` | Admin dashboard | Admin |
| `/admin/reports` | Report moderation | Admin |
| `/admin/verification` | Verification review | Admin |

`ProtectedRoute` enforces authenticated frontend routes and `AdminRoute` enforces admin
routes. The backend independently enforces authorization for protected API operations.

---

## Structure

```text
frontend/src/
|-- api/api.js              # API client, JWT attachment, multipart uploads
|-- components/             # Shared UI, forms, modals, badges, accessibility tools
|-- context/                # Authentication and accessibility state
|-- locales/                # Albanian and English translation files
|-- pages/                  # Route-level pages
|-- styles/global.css       # Design tokens and component styles
|-- utils/
|   |-- constants.js        # Cities, categories, and enum values
|   |-- guestUsage.js       # Guest action limit in localStorage
|   |-- savedJourneys.js    # Per-browser saved-journey list
|   `-- similarJourneys.js  # Related-journey scoring
`-- i18n.js                 # Localization initialization
```

### Key components

- `Navbar`, `Footer`, and `Hero`
- `ExperienceCard` - save, like/dislike, report, and view actions
- `SearchFilters` - city, category, institution, cost, waiting, and verification filters
- `SubmitExperienceForm` - creates/edits experiences with symptoms, optional display name,
  and an optional public supporting document
- `ImageBlurTool` - manually redacts sensitive areas in images before upload
- `AccessibilityMenu` - text size, dark mode, high contrast, and reduced motion
- `VerificationLabel` and `TrustBadge` - explain evidence and community trust signals
- `GuestLimitBanner`, `ReportModal`, `ProtectedRoute`, `AdminRoute`, `LoadingState`, and
  `ErrorState`

---

## API connection

`src/api/api.js`:

- uses the Vite `/api` proxy by default
- supports `VITE_API_BASE_URL` for a separately hosted backend
- automatically attaches `Authorization: Bearer <token>` from `localStorage`
- supports JSON and multipart requests
- turns failed network/API responses into readable application errors

---

## Experience and document behavior

- Experiences can be anonymous or signed with an optional display name. Email addresses are
  never displayed publicly.
- Users can record up to 10 symptoms plus journey steps, tests, cost, waiting time, and
  result time.
- A supporting PDF or image attached during submission is **public** on the experience
  details page.
- Images can be redacted with the built-in blur tool before upload. PDFs are uploaded and
  published exactly as provided, so the user must remove sensitive information first.
- The backend also exposes a separate private verification workflow. Verification documents
  are not public and are available only to administrators through protected endpoints.

---

## Saved and similar journeys

- Saved journey IDs are stored in `localStorage` under `healthpath_saved_journeys`.
- The saved list is specific to the current browser/device and is cleared with browser data.
- Similar journeys are ranked by shared symptoms, then category and city, with likes used as
  a tie-breaker.

---

## Localization and accessibility

- The interface supports Albanian and English and remembers the selected language.
- Accessibility preferences include default/large/extra-large text, dark mode, high
  contrast, and reduced motion.
- A skip link and semantic labels support keyboard and assistive-technology navigation.
- Preferences are stored locally in the browser.

---

## Guest access

Guests can browse the home page and a limited number of searches/detail views. Usage is
tracked in `localStorage` under `healthcare_guest_usage` with a limit of five meaningful
actions. After the limit, the interface prompts the visitor to register, log in, or continue
with a limited preview.

Guests cannot submit experiences, vote, report content, or open user/admin dashboards.
