from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, LessonAttempt
from app.schemas.schemas import StatisticsResponse

router = APIRouter(prefix="/statistics", tags=["Statistics"])

@router.get("", response_model=StatisticsResponse)
def get_statistics(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    weekly = [
        {"day": "Mon", "xp": 450},
        {"day": "Tue", "xp": 600},
        {"day": "Wed", "xp": 520},
        {"day": "Thu", "xp": 800},
        {"day": "Fri", "xp": 650},
        {"day": "Sat", "xp": 720},
        {"day": "Sun", "xp": 510},
    ]

    monthly = [
        {"week": "Week 1", "xp": 2800},
        {"week": "Week 2", "xp": 3400},
        {"week": "Week 3", "xp": 4100},
        {"week": "Week 4", "xp": 4250},
    ]

    heatmap = [
        {"date": f"2026-08-{i:02d}", "count": (i * 35) % 150} for i in range(1, 31)
    ]

    return StatisticsResponse(
        weekly_xp=weekly,
        monthly_xp=monthly,
        total_xp=user.xp if user else 1240,
        current_streak=user.streak if user else 5,
        completed_lessons=14,
        accuracy_percentage=96.4,
        learning_time_minutes=185,
        heatmap=heatmap
    )
