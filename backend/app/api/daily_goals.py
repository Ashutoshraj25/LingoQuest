from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import DailyQuest, UserQuest, User

router = APIRouter(prefix="/daily-goals", tags=["Daily Goals"])

@router.get("")
def get_daily_goals(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    quests = db.query(DailyQuest).all()

    res = []
    for q in quests:
        uq = db.query(UserQuest).filter(
            UserQuest.user_id == user_id,
            UserQuest.quest_id == q.id
        ).first()

        res.append({
            "id": q.id,
            "title": q.title,
            "description": q.description,
            "target_amount": q.target_amount,
            "current_progress": uq.current_progress if uq else 0,
            "reward_xp": q.reward_xp,
            "reward_gems": q.reward_gems,
            "completed": uq.completed if uq else False,
            "claimed": uq.claimed if uq else False
        })

    return {
        "daily_goal_xp": user.daily_xp_goal if user else 50,
        "current_today_xp": 35,
        "quests": res
    }

@router.post("/claim/{quest_id}")
def claim_quest_reward(quest_id: int, user_id: int = 1, db: Session = Depends(get_db)):
    uq = db.query(UserQuest).filter(
        UserQuest.user_id == user_id,
        UserQuest.quest_id == quest_id
    ).first()

    if not uq or not uq.completed or uq.claimed:
        raise HTTPException(status_code=400, detail="Cannot claim quest reward")

    q = db.query(DailyQuest).filter(DailyQuest.id == quest_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    user.xp += q.reward_xp
    user.gems += q.reward_gems
    uq.claimed = True
    db.commit()

    return {"message": "Quest reward claimed!", "new_xp": user.xp, "new_gems": user.gems}
