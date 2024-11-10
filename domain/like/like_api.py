from fastapi import APIRouter, Depends, HTTPException, status, Cookie, Body
from domain.mysql_connector import get_db_connection
from typing import Optional
import jwt
from jwt import DecodeError
from pydantic import BaseModel
"""
/likes                        - 기본 경로 (좋아요 관련 API의 공통 루트)
├── /news                     - 뉴스에 대한 좋아요 API
│   ├── GET    /news                - 사용자가 좋아요한 모든 뉴스 항목 조회
│   ├── POST   /news/{news_id}      - 뉴스에 좋아요 추가
│   ├── DELETE /news/{news_id}      - 뉴스 좋아요 취소
│   ├── GET    /news/{news_id}/status - 특정 뉴스에 대한 좋아요 여부 확인
│
└── /terms                    - 경제 용어에 대한 좋아요 API
    ├── GET    /terms               - 사용자가 좋아요한 모든 용어 조회
    ├── POST   /terms    - 용어 이름으로 좋아요 추가 
    ├── POST   /terms/{term_id}     - 용어Id 좋아요 추가
    ├── DELETE /terms/{term_id}     - 용어 좋아요 취소
    ├── GET    /terms/{term}/status - 특정 용어에 대한 좋아요 여부 확인
"""
# /likes로 기본 경로 설정
router = APIRouter()

# Secret Key 및 알고리즘
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"

# 요청 바디 모델 정의
class Data(BaseModel):
    term: str

# 유저 인증 함수
def verify_user(access_token: str = Cookie(None)):
    print(access_token)
    if access_token is None or not access_token.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")
    token = access_token[len("Bearer "):]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email = payload.get("sub")
        if user_email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")

        # 이메일로 유저 ID 조회
        with get_db_connection() as db:
            cursor = db.cursor()
            cursor.execute("SELECT id FROM User WHERE email = %s", (user_email,))
            user = cursor.fetchone()
            if user is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
            return user['id']
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except DecodeError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

### 뉴스 관련 좋아요 API ###

@router.get("/news")
async def get_liked_news(user_id: int = Depends(verify_user)):
    """사용자가 좋아요한 모든 뉴스 항목 조회"""
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("""
            SELECT *
            FROM news_like nl
            JOIN News n ON nl.news_id = n.id
            WHERE nl.user_id = %s
        """, (user_id,))
        liked_news = cursor.fetchall()
    return {"liked_news": liked_news}

@router.post("/news/{news_id}")
async def like_news(news_id: int, user_id: int = Depends(verify_user)):
    """뉴스에 좋아요 추가"""
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM news_like WHERE user_id = %s AND news_id = %s", (user_id, news_id))
        if cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already liked")
        cursor.execute("INSERT INTO news_like (user_id, news_id, created_at) VALUES (%s, %s, NOW())", (user_id, news_id))
        db.commit()
    return {"message": "Liked successfully"}

@router.delete("/news/{news_id}")
async def unlike_news(news_id: int, user_id: int = Depends(verify_user)):
    """뉴스 좋아요 취소"""
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM news_like WHERE user_id = %s AND news_id = %s", (user_id, news_id))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Like not found")
        cursor.execute("DELETE FROM news_like WHERE user_id = %s AND news_id = %s", (user_id, news_id))
        db.commit()
    return {"message": "Unliked successfully"}

@router.get("/news/{news_id}/status")
async def check_news_like(news_id: int, user_id: int = Depends(verify_user)):
    """특정 뉴스에 대한 좋아요 여부 확인"""
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM news_like WHERE user_id = %s AND news_id = %s", (user_id, news_id))
        like = cursor.fetchone()
    return {"liked": bool(like)}

### 경제 용어 관련 좋아요 API ###

@router.get("/terms")
async def get_liked_terms(user_id: int = Depends(verify_user)):
    """사용자가 좋아요한 모든 용어 조회"""
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("""
            SELECT *
            FROM term_like tl
            JOIN term t ON tl.term_id = t.idx
            WHERE tl.user_id = %s
        """, (user_id,))
        liked_terms = cursor.fetchall()
    return {"liked_terms": liked_terms}

@router.post("/terms/{term_id}")
async def like_term(term_id: int, user_id: int = Depends(verify_user)):
    """용어에 좋아요 추가"""
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM term_like WHERE user_id = %s AND term_id = %s", (user_id, term_id))
        if cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already liked")
        cursor.execute("INSERT INTO term_like (user_id, term_id, created_at) VALUES (%s, %s, NOW())", (user_id, term_id))
        db.commit()
    return {"message": "Liked term successfully"}

@router.delete("/terms/{term_id}")
async def unlike_term(term_id: int, user_id: int = Depends(verify_user)):
    """용어 좋아요 취소"""
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM term_like WHERE user_id = %s AND term_id = %s", (user_id, term_id))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Like not found")
        cursor.execute("DELETE FROM term_like WHERE user_id = %s AND term_id = %s", (user_id, term_id))
        db.commit()
    return {"message": "Unliked term successfully"}

@router.get("/terms/{term}/status")
async def check_term_like(term: str, user_id: int = Depends(verify_user)):
    """특정 용어에 대한 좋아요 여부 확인"""
    with get_db_connection() as db:
        cursor = db.cursor()
        cursor.execute("SELECT idx FROM term WHERE term = %s", (term,))
        term_data = cursor.fetchone()
        if not term_data:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Term not found")
        term_id = term_data['idx']
        cursor.execute("SELECT * FROM term_like WHERE user_id = %s AND term_id = %s", (user_id, term_id))
        like = cursor.fetchone()
    return {"liked": bool(like)}


@router.post("/terms")
async def like_term_by_name(data: Data, user_id: int = Depends(verify_user)):
    """용어 이름으로 좋아요 추가"""
    term = data.term  # 요청 바디에서 용어 이름 추출

    with get_db_connection() as db:
        cursor = db.cursor()

        # term 테이블에서 term의 idx와 description을 찾기
        cursor.execute("SELECT idx, description FROM term WHERE term = %s", (term,))
        term_record = cursor.fetchone()
        if not term_record:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Term not found")

        term_id = term_record['idx']
        term_description = term_record['description']  # description 필드 추출

        # 중복 체크
        cursor.execute("SELECT * FROM term_like WHERE user_id = %s AND term_id = %s", (user_id, term_id))
        existing_like = cursor.fetchone()
        if existing_like:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already liked")

        # 좋아요 추가
        cursor.execute("INSERT INTO term_like (user_id, term_id, created_at) VALUES (%s, %s, NOW())", (user_id, term_id))
        db.commit()

    # 용어 ID, 이름, 설명을 함께 반환
    return {"message": "Liked term successfully", "term_id": term_id, "term": term, "description": term_description}
