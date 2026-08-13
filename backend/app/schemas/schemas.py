from pydantic import BaseModel, field_validator
from typing import List, Optional, Any
from datetime import datetime

# Auth & User
class UserLogin(BaseModel):
    email: str
    password: str
    remember_me: Optional[bool] = False

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if "@" not in value or "." not in value.split("@")[-1]:
            raise ValueError("Please enter a valid email address")
        return value

class UserRegister(BaseModel):
    full_name: str
    username: str
    email: str
    password: str
    confirm_password: str
    native_language: Optional[str] = "English"
    language_to_learn: Optional[str] = "Hindi"
    country: Optional[str] = "India"

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if "@" not in value or "." not in value.split("@")[-1]:
            raise ValueError("Please enter a valid email address")
        return value

class ForgotPasswordRequest(BaseModel):
    email: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        value = value.strip().lower()
        if "@" not in value or "." not in value.split("@")[-1]:
            raise ValueError("Please enter a valid email address")
        return value

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Any

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    username: str
    avatar_url: str
    native_language: str
    language_to_learn: str
    country: str
    xp: int
    streak: int
    hearts: int
    max_hearts: int
    gems: int
    level: int
    daily_xp_goal: int
    dark_mode: bool
    sound_enabled: bool
    notifications_enabled: bool
    current_course_id: Optional[int] = None

    class Config:
        from_attributes = True

# Exercise Options
class ExerciseOptionSchema(BaseModel):
    id: int
    text: str
    translation: Optional[str] = None
    image_url: Optional[str] = None
    match_pair: Optional[str] = None

    class Config:
        from_attributes = True

# Exercise
class ExerciseSchema(BaseModel):
    id: int
    lesson_id: int
    type: str
    prompt: str
    question_text: str
    translation_hint: Optional[str] = None
    explanation: Optional[str] = None
    audio_url: Optional[str] = None
    options: List[ExerciseOptionSchema] = []

    class Config:
        from_attributes = True

# Submit Exercise Answer
class SubmitExerciseAnswerRequest(BaseModel):
    exercise_id: int
    user_answer: Any

class ExerciseAnswerResult(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: Optional[str] = None
    xp_earned: int = 0
    hearts_remaining: int

# Lesson
class LessonSchema(BaseModel):
    id: int
    skill_id: int
    title: str
    intro_explanation: Optional[str] = None
    vocabulary_notes: Optional[str] = None
    xp_reward: int
    order: int
    completed: bool = False
    exercises: List[ExerciseSchema] = []

    class Config:
        from_attributes = True

# Skill
class SkillSchema(BaseModel):
    id: int
    unit_id: int
    title: str
    icon: str
    description: Optional[str] = None
    order: int
    total_lessons: int
    completed_lessons: int = 0
    is_unlocked: bool = True
    is_completed: bool = False

    class Config:
        from_attributes = True

# Unit
class UnitSchema(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str] = None
    color_hex: str
    order: int
    skills: List[SkillSchema] = []

    class Config:
        from_attributes = True

# Course Dashboard
class DashboardResponse(BaseModel):
    user: UserResponse
    current_course: Optional[Any] = None
    available_courses: List[Any] = []
    units: List[UnitSchema] = []

# Lesson Complete Request
class CompleteLessonRequest(BaseModel):
    lesson_id: int
    accuracy: float
    combo_max: int
    time_taken_seconds: int

class CompleteLessonResponse(BaseModel):
    xp_earned: int
    total_xp: int
    streak: int
    new_hearts: int
    gems_earned: int
    unlocked_next_lesson: bool
    achievements_unlocked: List[str] = []

# Leaderboard
class LeaderboardResponse(BaseModel):
    rankings: List[Any]
    current_user_rank: int
    league: str

# Shop
class ShopItemSchema(BaseModel):
    id: int
    key: str
    name: str
    description: str
    category: str
    price_gems: int
    icon_name: str

    class Config:
        from_attributes = True

class PurchaseRequest(BaseModel):
    shop_item_id: int

# Quests
class QuestSchema(BaseModel):
    id: int
    title: str
    description: str
    target_amount: int
    current_progress: int
    reward_xp: int
    reward_gems: int
    completed: bool
    claimed: bool

# Stats
class StatisticsResponse(BaseModel):
    weekly_xp: List[dict]
    monthly_xp: List[dict]
    total_xp: int
    current_streak: int
    completed_lessons: int
    accuracy_percentage: float
    learning_time_minutes: int
    heatmap: List[dict]
