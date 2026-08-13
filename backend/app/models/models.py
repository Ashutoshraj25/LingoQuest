from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.session import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
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
    streak = Column(Integer, default=5)
    gems = Column(Integer, default=450)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    daily_xp_goal = Column(Integer, default=50)
    dark_mode = Column(Boolean, default=False)
    sound_effects = Column(Boolean, default=True)
    haptic_feedback = Column(Boolean, default=True)
    current_course_id = Column(Integer, nullable=True, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, default=datetime.utcnow)

    user_progress = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(50), nullable=False)
    code = Column(String(10), nullable=False)
    flag_emoji = Column(String(10), nullable=False)
    description = Column(String(255))
    icon_name = Column(String(50), default="globe")
    is_active = Column(Boolean, default=True)

    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan")

Language = Course  # Alias

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    order = Column(Integer, default=1)
    title = Column(String(100), nullable=False)
    description = Column(String(255))
    color_hex = Column(String(20), default="#58CC02")

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    order = Column(Integer, default=1)
    title = Column(String(100), nullable=False)
    icon = Column(String(50), default="book")
    description = Column(String(255), nullable=True)
    total_lessons = Column(Integer, default=2)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    order = Column(Integer, default=1)
    title = Column(String(100), nullable=False)
    xp_reward = Column(Integer, default=20)
    intro_explanation = Column(Text, nullable=True)
    vocabulary_notes = Column(Text, nullable=True)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(String(50), nullable=False)
    prompt = Column(String(255), nullable=True)
    question_text = Column(String(255), nullable=False)
    translation_hint = Column(String(255), nullable=True)
    correct_answer = Column(Text, nullable=False)
    explanation = Column(Text, nullable=True)
    order = Column(Integer, default=1)

    lesson = relationship("Lesson", back_populates="exercises")
    options = relationship("ExerciseOption", back_populates="exercise", cascade="all, delete-orphan")

class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    text = Column(String(255), nullable=False)
    translation = Column(String(255), nullable=True)
    is_correct = Column(Boolean, default=False)

    exercise = relationship("Exercise", back_populates="options")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    completed_lessons = Column(Integer, default=0)
    is_unlocked = Column(Boolean, default=True)
    is_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="user_progress")
    skill = relationship("Skill")

class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    score = Column(Integer, default=100)
    completed_at = Column(DateTime, default=datetime.utcnow)

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    category = Column(String(50), default="xp")
    max_progress = Column(Integer, default=100)
    gem_reward = Column(Integer, default=50)

    user_achievements = relationship("UserAchievement", back_populates="achievement", cascade="all, delete-orphan")

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    current_progress = Column(Integer, default=0)
    is_unlocked = Column(Boolean, default=False)
    claimed = Column(Boolean, default=False)

    user = relationship("User", back_populates="achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")

class DailyQuest(Base):
    __tablename__ = "daily_quests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    target_amount = Column(Integer, default=50)
    reward_xp = Column(Integer, default=30)
    reward_gems = Column(Integer, default=20)
    quest_type = Column(String(50), default="xp")

class UserQuest(Base):
    __tablename__ = "user_quests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quest_id = Column(Integer, ForeignKey("daily_quests.id"), nullable=False)
    current_progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    claimed = Column(Boolean, default=False)

class LeaderboardEntry(Base):
    __tablename__ = "leaderboard_entries"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False)
    avatar_url = Column(String(255), nullable=False)
    city = Column(String(100), default="Delhi")
    xp = Column(Integer, default=1000)
    league = Column(String(50), default="Gold")
    rank = Column(Integer, default=1)
    is_user = Column(Boolean, default=False)

class ShopItem(Base):
    __tablename__ = "shop_items"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    category = Column(String(50), default="item")
    price_gems = Column(Integer, default=100)
    icon_name = Column(String(50), default="star")

class UserInventory(Base):
    __tablename__ = "user_inventories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    item_id = Column(Integer, ForeignKey("shop_items.id"), nullable=False)
    quantity = Column(Integer, default=1)
    purchased_at = Column(DateTime, default=datetime.utcnow)

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
