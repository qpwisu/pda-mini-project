# domain/user/user_api.py
from fastapi import APIRouter, HTTPException
from domain.mysql_connector import get_db_connection
from domain.response import success_response, error_response

router = APIRouter()

@router.get("/user/{user_id}/likes")
async def get_user_likes(user_id: int):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                sql = "SELECT * FROM news_like WHERE user_id = %s"
                cursor.execute(sql, (user_id,))
                likes = cursor.fetchall()

        if not likes:
            return success_response(data=[])

        return success_response(data=likes)

    except Exception as e:
        return error_response(message="Internal Server Error", status_code=500)