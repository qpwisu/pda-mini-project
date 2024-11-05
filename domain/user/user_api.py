# domain/user/user_api.py
from fastapi import FastAPI, APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal
from models import User
from pydantic import BaseModel
from datetime import datetime
from datetime import timedelta

# 실행 : uvicorn user_api:router --reload  
router = APIRouter()

router = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Pydantic 모델
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# 데이터베이스 세션을 생성하는 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/api/v1/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    # 이메일 중복 체크
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 비밀번호 해시화
    hashed_password = pwd_context.hash(user.password)

    # 사용자 생성
    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        created_at=datetime.now(),
        updated_at=datetime.now()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully"}

@router.post("/api/v1/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # 사용자 조회
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user is None or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {"message": "Login successful", "user_id": db_user.id}
