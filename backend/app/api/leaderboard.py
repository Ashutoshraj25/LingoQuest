from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import LeaderboardEntry, User
from app.schemas.schemas import LeaderboardResponse

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(db: Session = Depends(get_db)):
    entries = db.query(LeaderboardEntry).order_by(LeaderboardEntry.xp.desc()).all()
    user_entry = db.query(LeaderboardEntry).filter(LeaderboardEntry.is_user == True).first()
    user_rank = user_entry.rank if user_entry else 2

    data = []
    for idx, e in enumerate(entries, 1):
        e.rank = idx
        data.append({
            "id": e.id,
            "rank": idx,
            "username": e.username,
            "avatar_url": e.avatar_url,
            "xp": e.xp,
            "league": e.league,
            "is_user": e.is_user
        })

    return LeaderboardResponse(
        rankings=data,
        current_user_rank=user_rank,
        league="Gold League"
    )
