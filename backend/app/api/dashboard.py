from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Course, Unit, Skill, UserProgress
from app.schemas.schemas import DashboardResponse, UnitSchema, SkillSchema, UserResponse
from app.api.auth import get_user_from_req

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard(request: Request, user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_from_req(request, db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Load course matching current_course_id or language_to_learn
    course = None
    if user.current_course_id:
        course = db.query(Course).filter(Course.id == user.current_course_id).first()
    
    if not course and user.language_to_learn:
        course = db.query(Course).filter(
            (Course.title.ilike(f"%{user.language_to_learn}%")) | (Course.code.ilike(user.language_to_learn))
        ).first()

    if not course:
        course = db.query(Course).first()

    # Sync user's current_course_id and language_to_learn
    if course:
        if user.current_course_id != course.id or user.language_to_learn != course.title:
            user.current_course_id = course.id
            user.language_to_learn = course.title
            db.commit()
            db.refresh(user)

    units_data = []
    if course:
        units = db.query(Unit).filter(Unit.course_id == course.id).order_by(Unit.order).all()
        # Batch fetch user progress in 1 query for instant performance
        user_progress_map = {
            p.skill_id: p for p in db.query(UserProgress).filter(UserProgress.user_id == user.id).all()
        }
        
        for unit in units:
            skills = db.query(Skill).filter(Skill.unit_id == unit.id).order_by(Skill.order).all()
            skills_data = []
            
            for skill in skills:
                prog = user_progress_map.get(skill.id)
                
                completed_lessons = prog.completed_lessons if prog else 0
                is_completed = prog.is_completed if prog else False
                
                # ALL UNITS & SKILLS ARE UNLOCKED ACROSS ALL 5 UNITS!
                is_unlocked = True

                skills_data.append(SkillSchema(
                    id=skill.id,
                    unit_id=skill.unit_id,
                    title=skill.title,
                    icon=skill.icon,
                    description=skill.description,
                    order=skill.order,
                    total_lessons=skill.total_lessons,
                    completed_lessons=completed_lessons,
                    is_unlocked=is_unlocked,
                    is_completed=is_completed
                ))

            units_data.append(UnitSchema(
                id=unit.id,
                course_id=unit.course_id,
                title=unit.title,
                description=unit.description,
                color_hex=unit.color_hex,
                order=unit.order,
                skills=skills_data
            ))

    return DashboardResponse(
        user=UserResponse.from_orm(user),
        current_course={
            "id": course.id,
            "title": course.title,
            "code": getattr(course, "code", "hi"),
            "flag": course.flag_emoji,
            "flag_emoji": course.flag_emoji
        } if course else None,
        units=units_data
    )
