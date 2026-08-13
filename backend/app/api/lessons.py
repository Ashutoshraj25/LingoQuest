import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Lesson, Exercise, ExerciseOption, UserProgress, LessonAttempt
from app.schemas.schemas import LessonSchema, SubmitExerciseAnswerRequest, ExerciseAnswerResult, CompleteLessonRequest, CompleteLessonResponse

router = APIRouter(prefix="/lessons", tags=["Lessons"])

@router.get("/{lesson_id}", response_model=LessonSchema)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        # Fallback to first lesson
        lesson = db.query(Lesson).first()
        if not lesson:
            raise HTTPException(status_code=404, detail="Lesson not found")

    return LessonSchema.from_orm(lesson)

@router.post("/check-answer", response_model=ExerciseAnswerResult)
def check_exercise_answer(req: SubmitExerciseAnswerRequest, user_id: int = 1, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == req.exercise_id).first()
    user = db.query(User).filter(User.id == user_id).first()

    if not exercise or not user:
        raise HTTPException(status_code=404, detail="Exercise or User not found")

    is_correct = False
    correct_text = exercise.correct_answer

    if exercise.type == "multiple_choice":
        # Check if selected option is marked correct
        selected_text = str(req.user_answer).strip().lower()
        correct_text = exercise.correct_answer.strip().lower()
        is_correct = (selected_text == correct_text)
    elif exercise.type == "word_bank":
        # Check string or array match
        user_list = req.user_answer if isinstance(req.user_answer, list) else [req.user_answer]
        target_list = json.loads(exercise.correct_answer) if exercise.correct_answer.startswith("[") else [exercise.correct_answer]
        is_correct = (" ".join(user_list).strip().lower() == " ".join(target_list).strip().lower())
    elif exercise.type == "match_pairs":
        # Compare dictionary mappings
        try:
            target_dict = json.loads(exercise.correct_answer)
            user_dict = req.user_answer if isinstance(req.user_answer, dict) else {}
            is_correct = (user_dict == target_dict)
        except Exception:
            is_correct = True
    elif exercise.type == "fill_blank" or exercise.type == "type_answer":
        user_str = str(req.user_answer).strip().lower()
        correct_str = str(exercise.correct_answer).strip().lower()
        is_correct = (user_str == correct_str)

    if not is_correct:
        if user.hearts > 0:
            user.hearts -= 1
            db.commit()

    return ExerciseAnswerResult(
        is_correct=is_correct,
        correct_answer=correct_text if isinstance(correct_text, str) else json.dumps(correct_text),
        explanation="Great job!" if is_correct else f"The correct answer is: {correct_text}",
        xp_earned=10 if is_correct else 0,
        hearts_remaining=user.hearts
    )

@router.post("/complete", response_model=CompleteLessonResponse)
def complete_lesson(req: CompleteLessonRequest, user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    lesson = db.query(Lesson).filter(Lesson.id == req.lesson_id).first()

    if not user or not lesson:
        raise HTTPException(status_code=404, detail="User or Lesson not found")

    xp_earned = lesson.xp_reward + (5 if req.accuracy >= 90 else 0)
    gems_earned = 20

    user.xp += xp_earned
    user.gems += gems_earned

    # Save Attempt
    attempt = LessonAttempt(
        user_id=user.id,
        lesson_id=lesson.id,
        xp_earned=xp_earned,
        accuracy=req.accuracy,
        combo_max=req.combo_max,
        time_taken_seconds=req.time_taken_seconds
    )
    db.add(attempt)

    # Update Skill Progress
    prog = db.query(UserProgress).filter(
        UserProgress.user_id == user.id,
        UserProgress.skill_id == lesson.skill_id
    ).first()

    if prog:
        prog.completed_lessons = min(prog.completed_lessons + 1, 4)
        if prog.completed_lessons >= 4:
            prog.is_completed = True
            # Unlock next skill
            next_prog = db.query(UserProgress).filter(
                UserProgress.user_id == user.id,
                UserProgress.skill_id == lesson.skill_id + 1
            ).first()
            if next_prog:
                next_prog.is_unlocked = True

    db.commit()

    return CompleteLessonResponse(
        xp_earned=xp_earned,
        total_xp=user.xp,
        streak=user.streak,
        new_hearts=user.hearts,
        gems_earned=gems_earned,
        unlocked_next_lesson=True,
        achievements_unlocked=["Wildfire", "Sage"]
    )
