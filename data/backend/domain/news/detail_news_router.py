# domain/news/news_router.py
from fastapi import APIRouter, HTTPException
from .detail_news_crud import get_news_by_idx  # crud에서 데이터베이스 함수 가져오기

router = APIRouter()

@router.get("/detail/{idx}", response_model=dict)
async def get_news_detail(idx: int):
    result = get_news_by_idx(idx)
    if result is None:
        raise HTTPException(status_code=404, detail="News not found")
    return result
