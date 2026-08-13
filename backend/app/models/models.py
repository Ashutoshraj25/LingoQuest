from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, Enum
from sqlalchemy.orm import relationship
from app.database.session import Base
import enum

class ExerciseType(str, enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRANSLATE_SENTENCE = "translate_sentence"
    TRANSLATE_WORD = "translate_word"
    WORD_BANK = "word_bank"
    LISTENING = "listening"
    SPEAKING = "speaking"
    FILL_BLANK = "fill_blank"
    MATCH_PAIRS = "match_pairs"
    TYPE_ANSWER = "type_answer"
    ARRANGE_SENTENCE = "arrange_sentence"
    IMAGE_ID = "image_id"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False, default="Ashutosh Raj")
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, default="https://api.dicebear.com/7.x/bottts/svg?seed=Ashutosh")
    
    native_language = Column(String, default="English")
    language_to_learn = Column(String, default="Hindi")
    country = Column(String, default="India")
    
    xp = Column(Integer, default=1240)
    streak = Column(Integer, default=5)
    hearts = Column(Integer, default=5)
    max_hearts = Column(Integer, default=5)
    gems = Column(Integer, default=450)
    level = Column(Integer, default=12)
    
    current_course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    daily_xp_goal = Column(Integer, default=50)
    dark_mode = Column(Boolean, default=False)
    sound_enabled = Column(Boolean, default=True)
    notifications_enabled = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    
    last_active_date = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    progresses = relationship("UserProgress", back_populates="user", cascade="all, delete-orphan")
    lesson_attempts = relationship("LessonAttempt", back_populates="user", cascade="all, delete-orphan")
    user_achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    user_quests = relationship("UserQuest", back_populates="user", cascade="all, delete-orphan")
    user_inventory = relationship("UserInventory", back_populates="user", cascade="all, delete-orphan")
    xp_history = relationship("XPHistory", back_populates="user", cascade="all, delete-orphan")
    heart_history = relationship("HeartHistory", back_populates="user", cascade="all, delete-orphan")

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)  # e.g., 'Hindi', 'English', 'Bengali'
    code = Column(String, unique=True, nullable=False)  # e.g., 'hi', 'en', 'bn', 'ta', 'te'
    flag_emoji = Column(String, nullable=False)
    description = Column(String)
    icon_name = Column(String, default="globe")

    units = relationship("Unit", back_populates="course", cascade="all, delete-orphan", order_by="Unit.order")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    color_hex = Column(String, default="#58CC02")
    order = Column(Integer, default=1)

    course = relationship("Course", back_populates="units")
    skills = relationship("Skill", back_populates="unit", cascade="all, delete-orphan", order_by="Skill.order")

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    title = Column(String, nullable=False)
    icon = Column(String, default="star")
    description = Column(String)
    order = Column(Integer, default=1)
    total_lessons = Column(Integer, default=4)

    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", cascade="all, delete-orphan", order_by="Lesson.order")

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    title = Column(String, nullable=False)
    intro_explanation = Column(Text, nullable=True)  # Teaching intro & grammar rules
    vocabulary_notes = Column(Text, nullable=True)     # Vocab list & tips
    xp_reward = Column(Integer, default=25)
    order = Column(Integer, default=1)

    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", cascade="all, delete-orphan", order_by="Exercise.order")

class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    type = Column(String, nullable=False)
    prompt = Column(String, nullable=False)
    question_text = Column(String, nullable=False)
    translation_hint = Column(String, nullable=True)
    explanation = Column(Text, nullable=True)  # Educational explanation of correct answer
    correct_answer = Column(Text, nullable=False)
    audio_url = Column(String, nullable=True)
    order = Column(Integer, default=1)

    lesson = relationship("Lesson", back_populates="exercises")
    options = relationship("ExerciseOption", back_populates="exercise", cascade="all, delete-orphan")

class ExerciseOption(Base):
    __tablename__ = "exercise_options"

    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    text = Column(String, nullable=False)
    translation = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    is_correct = Column(Boolean, default=False)
    match_pair = Column(String, nullable=True)

    exercise = relationship("Exercise", back_populates="options")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    completed_lessons = Column(Integer, default=0)
    is_unlocked = Column(Boolean, default=False)
    is_completed = Column(Boolean, default=False)

    user = relationship("User", back_populates="progresses")
    skill = relationship("Skill")

class LessonAttempt(Base):
    __tablename__ = "lesson_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    xp_earned = Column(Integer, default=0)
    accuracy = Column(Float, default=100.0)
    combo_max = Column(Integer, default=0)
    time_taken_seconds = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="lesson_attempts")
    lesson = relationship("Lesson")

class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, default="general")
    badge_icon = Column(String, default="trophy")
    max_progress = Column(Integer, default=1)
    gem_reward = Column(Integer, default=50)

class UserAchievement(Base):
    __tablename__ = "user_achievements"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    current_progress = Column(Integer, default=0)
    is_unlocked = Column(Boolean, default=False)
    claimed = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement")

class DailyQuest(Base):
    __tablename__ = "daily_quests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    target_amount = Column(Integer, default=50)
    reward_xp = Column(Integer, default=30)
    reward_gems = Column(Integer, default=20)
    quest_type = Column(String, default="xp")

class UserQuest(Base):
    __tablename__ = "user_quests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quest_id = Column(Integer, ForeignKey("daily_quests.id"), nullable=False)
    current_progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    claimed = Column(Boolean, default=False)
    date = Column(String, default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))

    user = relationship("User", back_populates="user_quests")
    quest = relationship("DailyQuest")

class ShopItem(Base):
    __tablename__ = "shop_items"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, default="boost")
    price_gems = Column(Integer, default=100)
    icon_name = Column(String, default="package")

class UserInventory(Base):
    __tablename__ = "user_inventory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shop_item_id = Column(Integer, ForeignKey("shop_items.id"), nullable=False)
    quantity = Column(Integer, default=1)

    user = relationship("User", back_populates="user_inventory")
    shop_item = relationship("ShopItem")

class LeaderboardEntry(Base):
    __tablename__ = "leaderboard_entries"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    avatar_url = Column(String, nullable=False)
    city = Column(String, default="Delhi")
    xp = Column(Integer, default=0)
    league = Column(String, default="Gold")
    rank = Column(Integer, default=1)
    is_user = Column(Boolean, default=False)

class XPHistory(Base):
    __tablename__ = "xp_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    xp_amount = Column(Integer, nullable=False)
    source = Column(String, default="lesson")  # 'lesson', 'practice', 'quest'
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="xp_history")

class HeartHistory(Base):
    __tablename__ = "heart_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    change = Column(Integer, nullable=False)  # -1 or +5
    reason = Column(String, default="mistake")  # 'mistake', 'refill', 'practice'
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="heart_history")
