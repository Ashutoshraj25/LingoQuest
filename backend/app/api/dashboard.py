from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Course, Unit, Skill, UserProgress
from app.schemas.schemas import DashboardResponse, UnitSchema, SkillSchema, UserResponse

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardResponse)
def get_dashboard(user_id: int = 1, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    course_id = user.current_course_id or 1
    course = db.query(Course).filter(Course.id == course_id).first()

    units_data = []
    if course:
        units = db.query(Unit).filter(Unit.course_id == course.id).order_by(Unit.order).all()
        for unit in units:
            skills = db.query(Skill).filter(Skill.unit_id == unit.id).order_by(Skill.order).all()
            skills_data = []
            for skill in skills:
                prog = db.query(UserProgress).filter(
                    UserProgress.user_id == user.id,
                    UserProgress.skill_id == skill.id
                ).first()
                
                completed_lessons = prog.completed_lessons if prog else 0
                is_unlocked = prog.is_unlocked if prog else (skill.order == 1 and unit.order == 1)
                is_completed = prog.is_completed if prog else False

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
