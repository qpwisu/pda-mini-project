from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from domain.mysql_connector import get_db_connection
from domain.response import success_response, error_response

router = APIRouter()

# Request model for creating/updating terms
class TermCreate(BaseModel):
    term: str
    description: str

@router.get("/")
async def read_terms():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                cursor.execute("SELECT idx, term, description FROM term")
                terms = cursor.fetchall()
        return success_response(data=terms)
    except Exception as e:
        return error_response(message="Failed to fetch terms", status_code=500)

@router.post("/")
async def create_term(term: TermCreate):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                sql = "INSERT INTO term (term, description) VALUES (%s, %s)"
                cursor.execute(sql, (term.term, term.description))
                conn.commit()
        return success_response(message="Term created successfully")
    except Exception as e:
        return error_response(message="Failed to create term", status_code=500)

@router.put("/{term_id}")
async def update_term(term_id: int, term: TermCreate):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                sql = "UPDATE term SET term = %s, description = %s WHERE idx = %s"
                cursor.execute(sql, (term.term, term.description, term_id))
                conn.commit()
        return success_response(message=f"Term with ID {term_id} updated successfully")
    except Exception as e:
        return error_response(message="Failed to update term", status_code=500)

@router.delete("/{term_id}")
async def delete_term(term_id: int):
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                sql = "DELETE FROM term WHERE idx = %s"
                cursor.execute(sql, (term_id,))
                conn.commit()
        return success_response(message=f"Term with ID {term_id} deleted successfully")
    except Exception as e:
        return error_response(message="Failed to delete term", status_code=500)

@router.get("/top-liked-terms")
async def get_top_liked_terms():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cursor:
                sql = """
                    SELECT t.*, COUNT(t.term) AS counts
                    FROM term t
                    JOIN term_like tl ON t.idx = tl.id
                    GROUP BY t.term
                    ORDER BY counts DESC, t.term
                    LIMIT 10;
                """
                cursor.execute(sql)
                top_liked_terms = cursor.fetchall()
        
        if not top_liked_terms:
            return success_response(data=[])

        return success_response(data=top_liked_terms)

    except Exception as e:
        return error_response(message="Failed to fetch top liked terms", status_code=500)
