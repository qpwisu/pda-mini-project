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
        t = term["term"]
        # 대소문자 변환 후 삽입
        if t.islower():
            trie.insert(t.upper())  # 소문자일 경우 대문자 버전 추가
        elif t.isupper():
            trie.insert(t.lower())  # 대문자일 경우 소문자 버전 추가
        else:
            # 혼합된 경우 대문자와 소문자 모두 추가
            trie.insert(t.lower())
            trie.insert(t.upper())

initialize_trie()  # 서버 시작 시 Trie 초기화

@router.get("/autocomplete")
async def get_word_by_prefix(prefix: str):
    return {"terms": trie.search_prefix(prefix)}