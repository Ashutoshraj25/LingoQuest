# LingoQuest - Deployment Ready Gamified Language Platform

**LingoQuest** is a production-ready, full-stack language learning web application clone inspired by Duolingo. It is built using Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion, FastAPI, SQLAlchemy, and SQLite.

---

## 📋 Deployment Audit & Fixes Completed

- [x] **Configurable API Endpoint**: Removed hardcoded URLs; uses `process.env.NEXT_PUBLIC_API_URL`.
- [x] **CORS & Environment Variables**: Configured CORS middleware in FastAPI to accept allowed origins from `ALLOWED_ORIGINS` environment variable.
- [x] **Health Check Endpoint**: Added `GET /health` returning `{"status": "ok"}` for load balancers.
- [x] **Error & Loading Boundaries**: Added `app/error.tsx` (Global Error), `app/not-found.tsx` (404 Page), and `app/loading.tsx` (Global Skeleton).
- [x] **Database Initialization**: SQLite database (`sqlite:///./lingoquest.db`) automatically creates tables and seeds realistic Indian language courses if empty.
- [x] **Deployment Specs**: Added `frontend/vercel.json`, `backend/render.yaml`, `backend/Dockerfile`, `.env.example`.

---

## 🛠️ Tech Stack & Folder Structure

```text
d:/scaler assigment/
├── backend/
│   ├── app/
│   │   ├── api/          # REST API endpoints (auth, dashboard, lessons, etc.)
│   │   ├── database/     # SQLite SQLAlchemy engine (sqlite:///./lingoquest.db)
│   │   ├── models/       # Database ORM models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── seed/         # Indian languages seed script (seed_data.py)
│   │   └── main.py       # FastAPI application entry point
│   ├── alembic/          # Alembic migrations directory
│   ├── Dockerfile        # Docker container spec
│   ├── render.yaml       # Render deployment spec
│   ├── requirements.txt  # Python backend dependencies
│   └── .env.example
│
├── frontend/
│   ├── app/              # Next.js 15 App Router pages, loading, error, not-found
│   ├── components/       # Duolingo 3D depth components (Button, Card, Mascot, Navbar, Sidebar)
│   ├── features/         # Domain components (learning-path, lesson-player, lesson-complete)
│   ├── lib/              # API client service layer (api.ts)
│   ├── vercel.json       # Vercel deployment spec
│   └── .env.example
│
├── package.json          # Root monorepo script launcher
└── .env.example          # Root environment variable template
```

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`:

```env
DATABASE_URL=sqlite:///./lingoquest.db
SECRET_KEY=CHANGE_ME_PRODUCTION_SECRET
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
NEXT_PUBLIC_API_URL=http://localhost:8000
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🚀 Running Locally

Launch both the **FastAPI backend** and **Next.js frontend** concurrently with a single command from the root directory:

```bash
npm run dev
```

- **Backend API & Swagger**: `http://localhost:8000/docs`
- **Backend Health Check**: `http://localhost:8000/health`
- **Frontend Web App**: `http://localhost:3000`

---

## 🌐 Deploying to Production

### 1. Frontend (Vercel)
1. Push repository to GitHub.
2. Import `frontend/` directory into Vercel.
3. Set environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-api.onrender.com`.

### 2. Backend (Render / Railway / Docker)
1. Import `backend/` repository into Render or Railway.
2. Build command: `pip install -r requirements.txt && python -m app.seed.seed_data`.
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. Set environment variable: `ALLOWED_ORIGINS=https://your-frontend.vercel.app`.
