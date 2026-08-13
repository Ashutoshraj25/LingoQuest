from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    native_language: Optional[str] = "English"
    language_to_learn: Optional[str] = "Hindi"
    country: Optional[str] = "India"

class UserRegister(UserBase):
    password: str
    confirm_password: str

class UserLogin(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = True

class GoogleLogin(BaseModel):
    email: str
    full_name: str
    google_id: str
    avatar_url: Optional[str] = None
    native_language: Optional[str] = "English"
    language_to_learn: Optional[str] = "Hindi"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ResetPasswordRequest(BaseModel):
    email: str
    otp_code: Optional[str] = None
    new_password: str

class UserResponse(UserBase):
    id: int
    avatar_url: str
    provider: Optional[str] = "email"
    google_id: Optional[str] = None
    is_verified: bool
    is_premium: bool
    xp: int
    level: int
    streak_count: int
    gems: int
    hearts: int
    max_hearts: int
    daily_xp_goal: int
    dark_mode: bool
    sound_effects: bool
    haptic_feedback: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: UserResponse

class ExerciseOptionResponse(BaseModel):
    id: int
    option_text: str
    is_correct: bool
    order_index: int

    class Config:
        from_attributes = True

class ExerciseResponse(BaseModel):
    id: int
    exercise_type: str
    question_text: str
    prompt_translation: Optional[str] = None
    correct_answer: str
    explanation: Optional[str] = None
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    order_index: int
    options: List[ExerciseOptionResponse] = []

    class Config:
        from_attributes = True

class LessonResponse(BaseModel):
    id: int
    skill_id: int
    lesson_number: int
    title: str
    xp_reward: int
    learning_intro_html: Optional[str] = None
    exercises: List[ExerciseResponse] = []

    class Config:
        from_attributes = True

class SkillResponse(BaseModel):
    id: int
    unit_id: int
    skill_number: int
    title: str
    icon_name: str
    total_lessons: int
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True

class UnitResponse(BaseModel):
    id: int
    language_id: int
    unit_number: int
    title: str
    description: Optional[str] = None
    color_hex: str
    skills: List[SkillResponse] = []

    class Config:
        from_attributes = True

class LanguageResponse(BaseModel):
    id: int
    name: str
    code: str
    flag_emoji: str
    description: Optional[str] = None
    is_active: bool
    units: List[UnitResponse] = []

    class Config:
        from_attributes = True

class DashboardDataResponse(BaseModel):
    user: UserResponse
    current_language: LanguageResponse
    total_languages_learning: int = 1
    xp_today: int = 40
    recent_lessons_completed: int = 4
