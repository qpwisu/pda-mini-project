# main.py
from fastapi import FastAPI
from domain.comment import comment_api as comment_router
from domain.like import like_api as like_router
from domain.news import news_api as news_router
from domain.term import term_api as term_router
from domain.user import user_api as user_router
from domain.user import my_page_api as my_page_router  # my_page_api를 추가로 import

app = FastAPI()

# 각 도메인의 라우터를 등록
app.include_router(comment_router.router, prefix="/comments", tags=["comments"])
app.include_router(like_router.router, prefix="/likes", tags=["likes"])
app.include_router(news_router.router, prefix="/news", tags=["news"])
app.include_router(term_router.router, prefix="/terms", tags=["terms"])
app.include_router(user_router.router, prefix="/users", tags=["users"])
app.include_router(my_page_router.router, prefix="/mypage", tags=["mypage"])

@app.get("/")
async def root():
    return {"message": "Hello, FastAPI!"}

# swagger http://127.0.0.1:8000/docs
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}