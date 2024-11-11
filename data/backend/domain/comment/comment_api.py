# domain/comment/comment_api.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_comments():
    return {"message": "Get all comments"}

@router.post("/")
async def create_comment():
    return {"message": "Create a comment"}
