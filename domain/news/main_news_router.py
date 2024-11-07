from fastapi import APIRouter, HTTPException
from .main_news_crud import get_main_news

router = APIRouter()

@router.get('/main', response_model=list[dict])
async def get_main_news_list():
    results = get_main_news()
    if not results:
        raise HTTPException(status_code=404, detail="No news available")
    return results