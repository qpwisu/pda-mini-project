# domain/like/like_api.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_likes():
    return {"message": "Get all likes"}

@router.post("/")
async def create_like():
    return {"message": "Like a post"}

@router.delete("/{like_id}")
async def delete_like(like_id: int):
    return {"message": f"Deleted like with ID {like_id}"}
