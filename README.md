# LingoQuest - Gamified Language Learning Platform

**LingoQuest** is a production-quality, full-stack language learning web application clone inspired by Duolingo. It features an interactive learning path, interactive exercise player (supporting 5 exercise types), real-time gamification mechanics (XP, daily streak counters, heart management, gem rewards), leaderboards, achievements showcase, daily goals, practice hub, statistics graphs, shop, and dark mode.

---

## Technical Stack

### Frontend
- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom 3D Depth Utilities
- **Animations:** Framer Motion + Canvas Confetti
- **Icons:** Lucide React Icons
- **Data Visualization:** Recharts

### Backend
- **Framework:** Python FastAPI
- **Database:** SQLite (ORM via SQLAlchemy 2.0)
- **Validation:** Pydantic v2
- **Data Seeding:** Seed script populating French & Spanish courses, 20+ exercises across all 5 types, leaderboard entries, achievements, daily quests, and shop items.

---

## Project Folder Structure

```
d:/scaler assigment/
├── backend/
│   ├── app/
│   │   ├── api/          # REST Endpoints (auth, dashboard, lessons, leaderboard, etc.)
│   │   ├── crud/         # DB CRUD operations & progress calculation logic
│   │   ├── database/     # SQLAlchemy SQLite session engine
│   │   ├── models/       # Database ORM models (User, Course, Unit, Exercise, etc.)
│   │   ├── schemas/      # Pydantic schemas for request/response validation
│   │   ├── seed/         # Database seeding script (seed_data.py)
│   │   └── main.py       # FastAPI application entry point
│   └── requirements.txt
│
├── frontend/
│   ├── app/              # Next.js 15 App router pages (dashboard, lesson player, practice, etc.)
│   ├── components/       # Reusable UI primitives (Button, Card, ProgressBar, Mascot, Sidebar, Navbar)
│   ├── features/         # Domain components (learning-path, lesson-player, lesson-complete)
│   ├── lib/              # API client service layer (api.ts)
│   └── package.json
│
└── README.md
```

---

## Features & Supported Screens

1. **Dashboard & Learning Path (`/`)**
   - Unit Header Card banner (French Section 1)
   - Interactive curved / zigzag Lesson Path Nodes with SVG Progress Rings, Crown icons, active pulse glow, and popover detail menus.
   - Right sidebar displaying Daily Goal widget, Practice Hub card, and Gold League leaderboard preview.

2. **Interactive Lesson Player (`/lesson/[id]`)**
   - Sequential exercise loop across 5 exercise types:
     1. `Multiple Choice` (Grid option selection with translation hints)
     2. `Word Bank` (Tap-to-select word chips to construct sentence)
     3. `Match Pairs` (Two-column pair matching with visual feedback)
     4. `Fill in the Blank` (Inline option selection into context sentence)
     5. `Type Answer` (Free-form text answer validation)
   - Progress bar, Hearts deduction on error, and sticky bottom Feedback Bar (Success / Error states).

3. **Lesson Complete Screen**
   - Canvas confetti celebration burst, Total XP earned counter, Accuracy percentage indicator, and Combo meter.

4. **Practice Hub (`/practice`)**
   - Practice modes: Weak Skills (+20 XP), Mistakes Review (+15 XP), Timed Challenge (+40 XP), Heart Refill Practice.

5. **Leaderboard (`/leaderboard`)**
   - Top 3 Podium (1st, 2nd, 3rd place with crowns & XP badges) + full Gold League rankings table highlighting current user.

6. **Learner Profile (`/profile`)**
   - Avatar header, Level & Join date, overview stats cards (Streak, XP, League, Hearts), Add Friend & Share buttons.

7. **Gold Trophy Showcase (`/achievements`)**
   - Achievement cards grid with category badges, progress bars, and claim gem reward buttons.

8. **Your Statistics (`/statistics`)**
   - Recharts Weekly XP activity bar chart, learning speed metrics, and GitHub-style daily activity heatmap grid.

9. **LingoQuest Shop (`/shop`)**
   - Gem packs, Heart Refills, Streak Freeze, 2x XP Double Boost, and LingoQuest Plus subscription card.

10. **Daily Goals & Quests (`/daily-goals`)**
    - Daily XP target bar (Earn 50 XP) and active quest list with claim reward actions.

11. **Hearts Hub (`/hearts`)**
    - Heart status counter, refill with gems, practice to earn heart, and auto-regen timer.

12. **Settings (`/settings`)**
    - Dark Mode toggle, Sound FX, Streak Reminders, and Session logout.

---

## Getting Started Locally

### 1. Run the Backend API

```bash
cd backend
python -m app.seed.seed_data   # Seeds the SQLite database
uvicorn app.main:app --reload  # Starts API at http://localhost:8000
```

### 2. Run the Next.js Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev                    # Starts frontend at http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
