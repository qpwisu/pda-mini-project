# domain/term/term_api.py
from fastapi import APIRouter
from domain.mysql_connector import get_db_connection
from service.trie_service import Trie

router = APIRouter()

# 전역으로 Trie 초기화
trie = Trie()

# 서버 시작 시 데이터베이스에서 단어를 불러와 Trie를 초기화
def initialize_trie():
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            query = "SELECT term FROM term;"
            cursor.execute(query)
            terms_collection = cursor.fetchall()
            for term in terms_collection:
                trie.insert(term["term"])

initialize_trie()  # 서버 시작 시 Trie 초기화

@router.get("/autocomplete")
async def get_word_by_prefix(prefix: str):
    return {"terms": trie.search_prefix(prefix)}


@router.get("/")
async def read_terms():
    return {"message": "Get all terms"}

@router.post("/")
async def create_term():
    return {"message": "Create a term"}

@router.put("/{term_id}")
async def update_telsrm(term_id: int):
    return {"message": f"Updated term with ID {term_id}"}

@router.delete("/{term_id}")
async def delete_term(term_id: int):
    return {"message": f"Deleted term with ID {term_id}"}
