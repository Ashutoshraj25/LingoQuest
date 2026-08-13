from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User
from app.schemas.schemas import UserResponse
from pydantic import BaseModel

router = APIRouter(prefix="/user", tags=["User"])

class UpdateSettingsRequest(BaseModel):
    dark_mode: bool
    sound_enabled: bool
    notifications_enabled: bool
    daily_xp_goal: int

@router.get("/me", response_model=UserResponse)
def get_user_profile(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/settings")
def update_settings(req: UpdateSettingsRequest, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.dark_mode = req.dark_mode
    user.sound_enabled = req.sound_enabled
    user.notifications_enabled = req.notifications_enabled
    user.daily_xp_goal = req.daily_xp_goal
    db.commit()

    return {"message": "Settings updated successfully", "user": UserResponse.from_orm(user)}

@router.post("/refill-hearts")
def refill_hearts(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hearts = user.max_hearts
    db.commit()

    return {"message": "Hearts refilled!", "hearts": user.hearts}
