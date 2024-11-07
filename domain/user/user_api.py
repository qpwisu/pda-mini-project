from fastapi import APIRouter, HTTPException, Response, Body
from datetime import datetime, timedelta
from passlib.context import CryptContext
from domain.mysql_connector import get_db_connection
import jwt
from domain.response import success_response, error_response

# JWT 설정
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 비밀번호 해시화
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

router = APIRouter()

# JWT 토큰 생성 함수
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 이메일 중복 체크
@router.get("/api/v1/verify-email/{email}")
def check_email(email: str):
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if user:
            return error_response(message="Email already exists")
        else:
            return success_response(data=None)


# 회원가입
@router.post("/api/v1/signup")
def signup(username: str = Body(...), email: str = Body(...), password: str = Body(...)):
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            return error_response("Email already registered", status_code=400)
        
        hashed_password = pwd_context.hash(password)
        cursor.execute(
            "INSERT INTO User (username, email, password, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)", 
            (username, email, hashed_password, datetime.now(), datetime.now())
        )
        db.commit()

    return success_response(data={'username': username, 'email': email, 'password': hashed_password})

# 로그인
@router.post("/api/v1/login")
def login(email: str = Body(...), password: str = Body(...), response: Response=Response):
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM User WHERE email = %s", (email,))
        db_user = cursor.fetchone()
        
        if db_user is None or not pwd_context.verify(password, db_user['password']):
            return error_response("Invalid credentials", status_code=400)

        # JWT 토큰 생성
        access_token = create_access_token(data={"sub": db_user['email']})

        # 쿠키에 토큰 저장
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            samesite="lax",
        )

    return success_response(data="Login successful")

# 로그아웃
@router.post("/api/v1/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token")
    return success_response(data=None)
