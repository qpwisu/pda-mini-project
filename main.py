# main.py
from fastapi import FastAPI
from domain.comment import comment_api as comment_router
from domain.like import like_api as like_router
from domain.news import news_api as news_router
from domain.term import term_api as term_router
from domain.user import user_api as user_router
from domain.user import my_page_api as my_page_router  # my_page_api를 추가로 import
from domain.search import search_api as search_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 허용할 도메인 (프론트엔드 주소)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# 각 도메인의 라우터를 등록
app.include_router(comment_router.router, prefix="/comments", tags=["comments"])
app.include_router(like_router.router, prefix="/likes", tags=["likes"])
app.include_router(news_router.router, prefix="/news", tags=["news"])
app.include_router(term_router.router, prefix="/terms", tags=["terms"])
app.include_router(user_router.router, prefix="/users", tags=["users"])
app.include_router(my_page_router.router, prefix="/mypage", tags=["mypage"])
app.include_router(search_router.router, prefix="/search", tags=["search"])


@app.get("/")
async def root():
    return {"message": "Hello, FastAPI!"}

# swagger http://127.0.0.1:8000/docs
@app.get("/items/{item_id}")
async def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}