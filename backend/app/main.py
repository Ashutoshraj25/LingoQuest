import os
import logging
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.database.session import Base, engine
from app.seed.seed_data import seed_database
from app.api import (
    auth, dashboard, lessons, leaderboard, achievements,
    statistics, shop, daily_goals, user
)

# Configure Production Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("lingoquest")

# Initialize Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LingoQuest Production API",
    description="Gamified Language Learning Backend API built for Duolingo Clone",
    version="1.0.0"
)

# CORS Configuration
allowed_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
if allowed_origins_env:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
else:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred."}
    )

# Health Check Endpoint
@app.get("/health")
def health_check():
    return {"status": "ok"}

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
    logger.info("Starting LingoQuest FastAPI Application...")
    try:
        from app.models.models import User, Exercise
        from app.database.session import SessionLocal
        db = SessionLocal()
        user_count = db.query(User).count()
        exercise_count = db.query(Exercise).count()
        db.close()
        if user_count == 0 or exercise_count < 1250:
            logger.info("Database empty or missing complete authentic exercises (< 1250). Running seed_database()...")
            seed_database()
    except Exception as e:
        logger.warning(f"Startup check/seed note: {e}")

@app.get("/")
def root():
    return {"message": "LingoQuest API is running smoothly!", "version": "1.0.0", "status": "ok"}
