# domain/news/news_api.py
from fastapi import APIRouter
from .detail_news_router import router as detail_router

router = APIRouter()

router.include_router(detail_router, tags=["news"])

# @router.get("/")
# async def read_news():
#     return {"message": "Get all news"}
#
# @router.post("/")
# async def create_news():
#     return {"message": "Create a news post"}
#
# @router.put("/{news_id}")
# async def update_news(news_id: int):
#     return {"message": f"Updated news post with ID {news_id}"}
#
# @router.delete("/{news_id}")
# async def delete_news(news_id: int):
#     return {"message": f"Deleted news post with ID {news_id}"}
