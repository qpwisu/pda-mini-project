# domain/user/user_api.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_users():
    return {"message": "Get all users"}

