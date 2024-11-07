from fastapi import APIRouter, Depends, HTTPException, status, Cookie
from domain.mysql_connector import get_db_connection
from typing import Optional
import jwt
from jwt import DecodeError

router = APIRouter()

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"


def verify_user(access_token: str = Cookie(None)):
    print("Received token:", access_token)  # 디버깅용 로그
    if access_token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated")

    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        print("Decoded payload:", payload)  # 디버깅용 로그

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


@router.post("/news/{news_id}/like")
async def like_news(news_id: int, user_id: int = Depends(verify_user)):
    with get_db_connection() as db:
        cursor = db.cursor()

        # 중복 체크
        cursor.execute("SELECT * FROM news_like WHERE user_id = %s AND news_id = %s", (user_id, news_id))
        existing_like = cursor.fetchone()

        if existing_like:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already liked")

        # 좋아요 추가
        cursor.execute(
            "INSERT INTO news_like (user_id, news_id, created_at) VALUES (%s, %s, NOW())",
            (user_id, news_id)
        )
        db.commit()

    return {"message": "Liked successfully"}


@router.delete("/news/{news_id}/like")
async def unlike_news(news_id: int, user_id: int = Depends(verify_user)):
    with get_db_connection() as db:
        cursor = db.cursor()

        # 좋아요 여부 확인
        cursor.execute("SELECT * FROM news_like WHERE user_id = %s AND news_id = %s", (user_id, news_id))
        existing_like = cursor.fetchone()

        if not existing_like:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Like not found")

        # 좋아요 삭제
        cursor.execute("DELETE FROM news_like WHERE user_id = %s AND news_id = %s", (user_id, news_id))
        db.commit()

    return {"message": "Unliked successfully"}


@router.post("/terms/{term_id}/like")
async def like_term(term_id: int, user_id: int = Depends(verify_user)):
    with get_db_connection() as db:
        cursor = db.cursor()

        # 중복 체크
        cursor.execute("SELECT * FROM term_like WHERE user_id = %s AND term_id = %s", (user_id, term_id))
        existing_like = cursor.fetchone()

        if existing_like:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already liked")

        # 좋아요 추가
        cursor.execute(
            "INSERT INTO term_like (user_id, term_id, created_at) VALUES (%s, %s, NOW())",
            (user_id, term_id)
        )
        db.commit()

    return {"message": "Liked term successfully"}


@router.delete("/terms/{term_id}/like")
async def unlike_term(term_id: int, user_id: int = Depends(verify_user)):
    with get_db_connection() as db:
        cursor = db.cursor()

        # 좋아요 여부 확인
        cursor.execute("SELECT * FROM term_like WHERE user_id = %s AND term_id = %s", (user_id, term_id))
        existing_like = cursor.fetchone()

        if not existing_like:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Like not found")

        # 좋아요 삭제
        cursor.execute("DELETE FROM term_like WHERE user_id = %s AND term_id = %s", (user_id, term_id))
        db.commit()

    return {"message": "Unliked term successfully"}


@router.get("/user/liked/terms")
async def get_liked_terms(user_id: int = Depends(verify_user)):
    with get_db_connection() as db:
        cursor = db.cursor()
        # 유저가 좋아요 누른 term 리스트 조회
        cursor.execute("""
            SELECT t.idx, t.term, t.description
            FROM term_like tl
            JOIN term t ON tl.term_id = t.idx
            WHERE tl.user_id = %s
        """, (user_id,))
        liked_terms = cursor.fetchall()

    return {"liked_terms": liked_terms}


@router.get("/user/liked/news")
async def get_liked_news(user_id: int = Depends(verify_user)):
    print(1)

    with get_db_connection() as db:
        cursor = db.cursor()

        # 유저가 좋아요 누른 news 리스트 조회
        cursor.execute("""
            SELECT n.id, n.title, n.preview, n.url
            FROM news_like nl
            JOIN News n ON nl.news_id = n.id
            WHERE nl.user_id = %s
        """, (user_id,))
        liked_news = cursor.fetchall()
        print(liked_news)

    return {"liked_news": liked_news}