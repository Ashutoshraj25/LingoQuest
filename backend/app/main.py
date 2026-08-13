from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import Base, engine
from app.seed.seed_data import seed_database
from app.api import (
    auth, dashboard, lessons, leaderboard, achievements,
    statistics, shop, daily_goals, user
)

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LingoQuest API",
    description="Gamified Language Learning Backend API built for Duolingo Clone",
    version="1.0.0"
)

# Allow CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(lessons.router)
app.include_router(leaderboard.router)
app.include_router(achievements.router)
app.include_router(statistics.router)
app.include_router(shop.router)
app.include_router(daily_goals.router)
app.include_router(user.router)

@app.on_event("startup")
def startup_event():
    # Automatically seed database on first startup if empty
    try:
        from app.models.models import User
        from app.database.session import SessionLocal
        db = SessionLocal()
        user_count = db.query(User).count()
        db.close()
        if user_count == 0:
            seed_database()
    except Exception as e:
        print(f"Startup check/seed note: {e}")

@app.get("/")
def root():
    return {"message": "LingoQuest API is running smoothly!", "version": "1.0.0"}
