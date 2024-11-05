# domain/user/user_api.py
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import SessionLocal
from models import User
from pydantic import BaseModel
from datetime import datetime, timedelta
from datetime import timedelta
import jwt


# 실행 : uvicorn user_api:router --reload  
router = APIRouter()
router = FastAPI()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # 비밀번호 캐싱.

# JWT 설정
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


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

# JWT 토큰 생성 함수
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 이메일 중복 체크
@router.get("/api/v1/verify-email/{email}")
def check_email(email: str, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == email).first()
    
    if existing_user:
        return {"message":"Email already exists"}  # 이메일이 이미 사용 중인 경우
    else:
        return { "message":"Email verified successfully" }   # 이메일이 사용 가능


# user_id로 데이터베이스에서 사용자 조회
@router.get("/api/v1/user/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    
    db_user = db.query(User).filter(User.id == user_id).first()
    
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    
    return {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "created_at": db_user.created_at,
        "updated_at": db_user.updated_at
    }
# 모든 사용자 조회
@router.get("/api/v1/users")
def get_all_users(db: Session = Depends(get_db)):
   
    users = db.query(User).all()
    
    # 사용자 정보 리스트로 반환
    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
        for user in users
    ]

# 이메일 중복 체크
@router.post("/api/v1/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    
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
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user is None or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # JWT 토큰 생성
    access_token = create_access_token(data={"sub": db_user.email})

    # 토큰을 쿠키에 저장 (response header로 보냄.)
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
    )

    return {"message": "Login successful"}

# 쿠키에서 JWT 토큰 삭제
@router.post("/api/v1/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return { "message": "User logged out successfully" }