from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
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
    option_text: Optional[str] = None
    text: Optional[str] = None
    is_correct: bool
    order_index: Optional[int] = 0

    class Config:
        from_attributes = True

class ExerciseResponse(BaseModel):
    id: int
    exercise_type: Optional[str] = "multiple_choice"
    type: Optional[str] = "multiple_choice"
    question_text: str
    prompt_translation: Optional[str] = None
    correct_answer: str
    explanation: Optional[str] = None
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    order_index: Optional[int] = 0
    options: List[ExerciseOptionResponse] = []

    class Config:
        from_attributes = True

class LessonResponse(BaseModel):
    id: int
    skill_id: int
    title: str
    xp_reward: int
    intro_explanation: Optional[str] = None
    vocabulary_notes: Optional[str] = None
    learning_intro_html: Optional[str] = None
    exercises: List[ExerciseResponse] = []

    class Config:
        from_attributes = True

LessonSchema = LessonResponse  # Alias

class SubmitExerciseAnswerRequest(BaseModel):
    exercise_id: int
    selected_answer: str
    is_correct: Optional[bool] = True

class ExerciseAnswerResult(BaseModel):
    is_correct: bool
    explanation: Optional[str] = None
    xp_gained: Optional[int] = 10
    hearts_remaining: Optional[int] = 5

class CompleteLessonRequest(BaseModel):
    lesson_id: int
    user_id: Optional[int] = 1
    score: Optional[int] = 100
    accuracy: Optional[float] = 100.0
    combo_max: Optional[int] = 8
    time_taken_seconds: Optional[int] = 120

class CompleteLessonResponse(BaseModel):
    success: bool
    xp_earned: int = 25
    total_xp: int = 1265
    hearts: int = 5
    streak: int = 5
    message: str = "Lesson completed successfully!"

class SkillSchema(BaseModel):
    id: int
    unit_id: int
    title: str
    icon: Optional[str] = "book"
    icon_name: Optional[str] = "book"
    description: Optional[str] = None
    order: Optional[int] = 1
    total_lessons: int
    completed_lessons: Optional[int] = 0
    is_unlocked: Optional[bool] = True
    is_completed: Optional[bool] = False
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True

SkillResponse = SkillSchema

class UnitSchema(BaseModel):
    id: int
    course_id: Optional[int] = 1
    language_id: Optional[int] = 1
    title: str
    description: Optional[str] = None
    color_hex: str
    order: Optional[int] = 1
    skills: List[SkillSchema] = []

    class Config:
        from_attributes = True

UnitResponse = UnitSchema

class CourseSchema(BaseModel):
    id: int
    title: str
    code: Optional[str] = "hi"
    flag: Optional[str] = "🇮🇳"
    flag_emoji: Optional[str] = "🇮🇳"
    description: Optional[str] = None
    icon_name: Optional[str] = "globe"
    is_active: Optional[bool] = True
    units: List[UnitSchema] = []

    class Config:
        from_attributes = True

LanguageResponse = CourseSchema

class DashboardResponse(BaseModel):
    user: UserResponse
    current_course: Optional[CourseSchema] = None
    units: List[UnitSchema] = []

    class Config:
        from_attributes = True

DashboardDataResponse = DashboardResponse

class LeaderboardEntryResponse(BaseModel):
    id: int
    username: str
    avatar_url: str
    city: Optional[str] = "Delhi"
    xp: int
    league: Optional[str] = "Gold"
    rank: int
    is_user: bool = False

    class Config:
        from_attributes = True

class LeaderboardResponse(BaseModel):
    league: str = "Gold League"
    days_left: int = 3
    entries: List[LeaderboardEntryResponse] = []

class AchievementResponse(BaseModel):
    id: int
    key: str
    title: str
    description: str
    category: str
    max_progress: int
    gem_reward: int
    current_progress: Optional[int] = 0
    is_unlocked: Optional[bool] = False
    claimed: Optional[bool] = False

    class Config:
        from_attributes = True

class ShopItemResponse(BaseModel):
    id: int
    key: str
    name: str
    description: str
    category: str
    price_gems: int
    icon_name: str

    class Config:
        from_attributes = True

ShopItemSchema = ShopItemResponse  # Alias

class PurchaseRequest(BaseModel):
    item_id: int

class StatisticsResponse(BaseModel):
    total_xp: int = 1240
    current_streak: int = 5
    accuracy_percentage: float = 94.5
    lessons_completed: int = 14
    words_learned: int = 120
    weekly_xp: List[dict] = [
        {"day": "Mon", "xp": 450},
        {"day": "Tue", "xp": 600},
        {"day": "Wed", "xp": 190}
    ]
