from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_order=True, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    google_id = Column(String(255), nullable=True, index=True)
    provider = Column(String(50), default="email")
    refresh_token = Column(Text, nullable=True)
    avatar_url = Column(String(255), default="https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh")
    native_language = Column(String(50), default="English")
    language_to_learn = Column(String(50), default="Hindi")
    country = Column(String(100), default="India")
    is_verified = Column(Boolean, default=True)
    is_premium = Column(Boolean, default=False)
    xp = Column(Integer, default=1240)
    level = Column(Integer, default=12)
    streak_count = Column(Integer, default=5)
    gems = Column(Integer, default=450)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    daily_xp_goal = Column(Integer, default=50)
    dark_mode = Column(Boolean, default=False)
    sound_effects = Column(Boolean, default=True)
    haptic_feedback = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

    user_progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")

class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    code = Column(String(10), nullable=False)
    flag_emoji = Column(String(10), nullable=False)
    description = Column(String(255))
    is_active = Column(Boolean, default=True)

    units = relationship("Unit", back_populates="language", cascade="all, delete-orphan")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    language_id = Column(Integer, ForeignKey("languages.id"), nullable=False)
    unit_number = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255))
    color_hex = Column(String(20), default="#58CC02")

    language = relationship("Language", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    skill_number = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    icon_name = Column(String(50), default="book")
    total_lessons = Column(Integer, default=2)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    lesson_number = Column(Integer, nullable=False)
    title = Column(String(100), nullable=False)
    xp_reward = Column(Integer, default=20)
    learning_intro_html = Column(Text, nullable=True)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    exercise_type = Column(String(50), nullable=False)
    question_text = Column(String(255), nullable=False)
    prompt_translation = Column(String(255), nullable=True)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    audio_url = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    order_index = Column(Integer, default=0)

    lesson = relationship("Lesson", back_populates="exercises")
    options = relationship("ExerciseOption", back_populates="exercise", cascade="all, delete-orphan")

class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    option_text = Column(String(255), nullable=False)
    is_correct = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)

    exercise = relationship("Exercise", back_populates="options")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    completed = Column(Boolean, default=False)
    score_percentage = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="user_progress")
    lesson = relationship("Lesson")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    icon_name = Column(String(50), default="trophy")
    xp_reward = Column(Integer, default=50)

    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")

class XPHistory(Base):
    __tablename__ = "xp_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    xp_gained = Column(Integer, nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)

class HeartHistory(Base):
    __tablename__ = "heart_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    hearts_change = Column(Integer, nullable=False)
    reason = Column(String(100), default="lesson_mistake")
    timestamp = Column(DateTime, default=datetime.utcnow)
