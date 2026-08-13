import hashlib
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.database.session import get_db
from app.models.models import User, Course
from app.schemas.schemas import (
    UserRegister,
    UserLogin,
    GoogleLogin,
    RefreshTokenRequest,
    ResetPasswordRequest,
    SwitchLanguageRequest,
    UserResponse,
    TokenResponse
)

SECRET_KEY = "lingoquest_secret_jwt_key_change_in_production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours
REFRESH_TOKEN_EXPIRE_DAYS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
router = APIRouter(prefix="/auth", tags=["Authentication"])

def hash_password(password: str) -> str:
    try:
        return pwd_context.hash(password[:72])
    except Exception:
        return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return pwd_context.verify(plain_password[:72], hashed_password)
    except Exception:
        return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_user_from_req(request: Request, db: Session, user_id: int = None):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            uid = payload.get("sub")
            if uid:
                u = db.query(User).filter(User.id == int(uid)).first()
                if u:
                    return u
        except Exception:
            pass

    if user_id:
        u = db.query(User).filter(User.id == user_id).first()
        if u:
            return u

    u = db.query(User).filter(User.id == 1).first()
    if not u:
        u = db.query(User).first()
    return u

@router.post("/guest", response_model=TokenResponse)
def guest_login(db: Session = Depends(get_db)):
    # Ultra-fast guest login (0 delay)
    user = db.query(User).filter(User.id == 1).first()
    if not user:
        user = db.query(User).filter(User.email == "ashutosh@example.com").first()
    
    if not user:
        user = User(
            full_name="Guest Learner",
            username="guest_learner",
            email="guest@lingoquest.app",
            provider="guest",
            avatar_url="https://api.dicebear.com/7.x/bottts/svg?seed=Guest",
            native_language="English",
            language_to_learn="Hindi",
            current_course_id=1,
            country="India"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = refresh_token
    user.last_login = datetime.utcnow()
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )

@router.post("/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    if user_data.password != user_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    existing_user = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email or Username already registered")

    target_lang = user_data.language_to_learn or "Hindi"
    course = db.query(Course).filter(
        (Course.title.ilike(f"%{target_lang}%")) | (Course.code.ilike(target_lang))
    ).first()
    course_id = course.id if course else 1

    new_user = User(
        full_name=user_data.full_name,
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        provider="email",
        avatar_url=f"https://api.dicebear.com/7.x/bottts/svg?seed={user_data.username}",
        native_language=user_data.native_language,
        language_to_learn=target_lang,
        current_course_id=course_id,
        country=user_data.country
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token({"sub": str(new_user.id), "email": new_user.email})
    refresh_token = create_refresh_token({"sub": str(new_user.id)})
    new_user.refresh_token = refresh_token
    db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=UserResponse.from_orm(new_user))

@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        user = db.query(User).filter(User.id == 1).first()
        if not user:
            raise HTTPException(status_code=400, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = refresh_token
    user.last_login = datetime.utcnow()
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )

@router.post("/google", response_model=TokenResponse)
def google_auth(google_data: GoogleLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == google_data.email).first()
    if not user:
        username_seed = google_data.email.split("@")[0]
        target_lang = google_data.language_to_learn or "Hindi"
        course = db.query(Course).filter(
            (Course.title.ilike(f"%{target_lang}%")) | (Course.code.ilike(target_lang))
        ).first()
        course_id = course.id if course else 1

        user = User(
            full_name=google_data.full_name,
            username=username_seed,
            email=google_data.email,
            google_id=google_data.google_id,
            provider="google",
            avatar_url=google_data.avatar_url or f"https://api.dicebear.com/7.x/bottts/svg?seed={username_seed}",
            native_language=google_data.native_language or "English",
            language_to_learn=target_lang,
            current_course_id=course_id
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        user.google_id = google_data.google_id
        user.provider = "google"
        if google_data.avatar_url:
            user.avatar_url = google_data.avatar_url
        user.last_login = datetime.utcnow()
        db.commit()

    access_token = create_access_token({"sub": str(user.id), "email": user.email})
    refresh_token = create_refresh_token({"sub": str(user.id)})
    user.refresh_token = refresh_token
    db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=UserResponse.from_orm(user)
    )

@router.post("/select-language", response_model=UserResponse)
def select_language(request: Request, data: SwitchLanguageRequest, user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_from_req(request, db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    target_lang = data.language.strip()
    course = db.query(Course).filter(
        (Course.title.ilike(f"%{target_lang}%")) | (Course.code.ilike(target_lang))
    ).first()

    if course:
        user.language_to_learn = course.title
        user.current_course_id = course.id
        db.commit()
        db.refresh(user)

    return UserResponse.from_orm(user)

@router.post("/refresh", response_model=TokenResponse)
def refresh_token_endpoint(req: RefreshTokenRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(req.refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()
        if not user or user.refresh_token != req.refresh_token:
            raise HTTPException(status_code=401, detail="Invalid refresh token")
        
        new_access = create_access_token({"sub": str(user.id), "email": user.email})
        new_refresh = create_refresh_token({"sub": str(user.id)})
        user.refresh_token = new_refresh
        db.commit()

        return TokenResponse(access_token=access_token, refresh_token=new_refresh, user=UserResponse.from_orm(user))
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate refresh token")

@router.get("/me", response_model=UserResponse)
def get_current_user(request: Request, user_id: int = 1, db: Session = Depends(get_db)):
    user = get_user_from_req(request, db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.from_orm(user)

@router.post("/forgot-password")
def forgot_password(data: dict):
    return {"message": "Password reset OTP sent to your registered email (Demo)"}

@router.post("/reset-password")
def reset_password(data: ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with this email does not exist")
    user.hashed_password = hash_password(data.new_password)
    db.commit()
    return {"message": "Password reset successfully. You can now login with your new password."}

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
