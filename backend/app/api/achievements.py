from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import Achievement, UserAchievement, User

router = APIRouter(prefix="/achievements", tags=["Achievements"])

@router.get("")
def get_achievements(user_id: int = 1, db: Session = Depends(get_db)):
    achievements = db.query(Achievement).all()
    res = []
    for a in achievements:
        user_ach = db.query(UserAchievement).filter(
            UserAchievement.user_id == user_id,
            UserAchievement.achievement_id == a.id
        ).first()

        res.append({
            "id": a.id,
            "key": a.key,
            "title": a.title,
            "description": a.description,
            "category": a.category,
            "badge_icon": a.badge_icon,
            "max_progress": a.max_progress,
            "current_progress": user_ach.current_progress if user_ach else 0,
            "is_unlocked": user_ach.is_unlocked if user_ach else False,
            "claimed": user_ach.claimed if user_ach else False,
            "gem_reward": a.gem_reward
        })
    return res

@router.post("/claim/{achievement_id}")
def claim_achievement_reward(achievement_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    user_ach = db.query(UserAchievement).filter(
        UserAchievement.user_id == user_id,
        UserAchievement.achievement_id == achievement_id
    ).first()
    
    if not user_ach or not user_ach.is_unlocked or user_ach.claimed:
        raise HTTPException(status_code=400, detail="Cannot claim reward")

    ach = db.query(Achievement).filter(Achievement.id == achievement_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    user.gems += ach.gem_reward
    user_ach.claimed = True
    db.commit()

    return {"message": "Reward claimed!", "new_gems": user.gems}
