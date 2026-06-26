# HealthPath Kosovo — Frontend

> **MVP Prototype** | University Mentorship Project — Week 3 Implementation

This is the React frontend for the **HealthPath Kosovo** healthcare transparency platform. It allows users to read and share anonymous healthcare experiences. It does **not** provide medical advice.

---

## How to Run

```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at: **http://localhost:5173**

---

## Project Structure

```
frontend/
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── package.json                   # Dependencies
├── public/
│   └── favicon.svg                # App favicon
└── src/
    ├── main.jsx                   # React root entry point
    ├── App.jsx                    # Routing setup
    │
    ├── components/                # Reusable UI components
    │   ├── Navbar.jsx             # Navigation bar (all pages)
    │   ├── Footer.jsx             # Footer with disclaimer (all pages)
    │   ├── Hero.jsx               # Hero section (Home page)
    │   ├── HowItWorks.jsx         # 3-step explainer (Home page)
    │   ├── ExperienceCard.jsx     # Single experience card
    │   ├── SearchFilters.jsx      # Sidebar filter panel
    │   ├── SubmitExperienceForm.jsx  # Anonymous submission form
    │   └── PrivacySection.jsx     # Trust & privacy content
    │
    ├── pages/                     # Page components (one per route)
    │   ├── HomePage.jsx           # / — Landing page
    │   ├── SearchPage.jsx         # /search — Browse experiences
    │   ├── SubmitPage.jsx         # /submit — Share an experience
    │   └── PrivacyPage.jsx        # /privacy — Privacy & Trust
    │
    ├── data/
    │   └── mockExperiences.js     # Static mock data (replaces backend for MVP)
    │
    └── styles/                    # CSS files (one per component + global)
        ├── global.css             # Design tokens, reset, utilities, buttons
        ├── Navbar.css
        ├── Footer.css
        ├── Hero.css
        ├── HowItWorks.css
        ├── ExperienceCard.css
        ├── SearchFilters.css
        ├── SubmitExperienceForm.css
        ├── PrivacySection.css
        ├── HomePage.css
        ├── SearchPage.css
        ├── SubmitPage.css
        └── PrivacyPage.css
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, how it works, recent experiences |
| `/search` | Browse all experiences with search + filters |
| `/submit` | Submit an anonymous healthcare journey |
| `/privacy` | Trust & Privacy explanation |

---

## Mock Data

All experience data is in `src/data/mockExperiences.js`. It contains:

- `mockExperiences` — 6 sample anonymous patient journeys
- `verificationLevels` — definitions for self-reported / document-supported / high-confidence
- `kosovoCities` — city list for filters and form
- `medicalCategories` — category list for filters and form

**Important:** This file will be replaced by real API calls once the backend is connected.

---

## What Should Be Implemented Next

### Backend (Phase 2)
- [ ] Express.js or FastAPI backend with REST endpoints
- [ ] `GET /api/experiences` — fetch experiences with filters
- [ ] `POST /api/experiences` — submit new experience
- [ ] `GET /api/stats` — platform statistics
- [ ] PostgreSQL database schema for experiences

### Authentication (Phase 3)
- [ ] Optional user accounts (JWT-based)
- [ ] Users can track their own submissions
- [ ] Admin panel for verification review

### Document Verification (Phase 4)
- [ ] Secure encrypted document upload
- [ ] Documents stored privately — only metadata shown publicly
- [ ] Admin review workflow for document-supported verification

### ML Features (Phase 5)
- [ ] Cost/waiting-time estimation based on category + city + institution
- [ ] Semantic search ("knee injury after sport" finds orthopaedics results)
- [ ] Anomaly detection for clearly inaccurate submissions

### Other
- [ ] GDPR-aligned privacy policy page
- [ ] Right-to-erasure for submitted experiences
- [ ] Albanian / Serbian language support

---

## Design System

All CSS variables (colours, spacing, typography, shadows) are in `src/styles/global.css` under `:root`. Change these to retheme the entire platform.

Key colours:
- **Primary:** `#0EA5E9` (sky blue — calm, trustworthy)
- **Accent:** `#10B981` (emerald — verified / success)
- **Warning:** `#F59E0B` (amber — self-reported / disclaimers)

---

## Disclaimer

> This platform does not provide medical diagnosis or medical advice.
> All content represents anonymous patient experiences shared voluntarily.
> Always consult a qualified healthcare professional for medical decisions.
