from fastapi import APIRouter, Query
from domain.mysql_connector import get_db_connection
from typing import Optional

router = APIRouter()

# @router.get("/title")
# async def get_new_by_title(title: str,
#     page: int = Query(1, ge=1),  # 페이지 번호, 기본값은 1
#     page_size: int = Query(10, ge=1, le=100)  # 페이지 크기, 기본값은 10, 최대 100):
# ):
    
#     offset = (page - 1) * page_size  # OFFSET 계산

#     with get_db_connection() as connection:
#             with connection.cursor() as cursor:
#                 sql_query = """
#                     SELECT *
#                     FROM News
#                     WHERE title LIKE %s
#                     LIMIT %s OFFSET %s;
#                 """
#                 search_term = f"%{title}%"  # 검색어 포함 패턴 설정
#                 cursor.execute(sql_query, (search_term, page_size, offset))
                
#                 results = cursor.fetchall()

#                 return {
#                     "page": page,
#                     "page_size": page_size,
#                     "total_count": len(results),
#                     "results": results
#                 }
            
@router.get("/title")
async def get_new_by_title_again(
    first_keyword: str,
    second_keyword: Optional[str] = None,  # 결과 내 검색을 위한 두 번째 키워드
    page: int = Query(1, ge=1),  # 페이지 번호, 기본값은 1
    page_size: int = Query(10, ge=1, le=100)  # 페이지 크기, 기본값은 10, 최대 100
):
    offset = (page - 1) * page_size
    first_search_term = f"%{first_keyword}%"  # 첫 번째 키워드 검색 패턴
    second_search_term = f"%{second_keyword}%" if second_keyword else None  # 두 번째 키워드 검색 패턴

    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            # 두 단계 검색 쿼리
            sql_query = """
                SELECT *
                FROM (
                    SELECT *
                    FROM News
                    WHERE title LIKE %s
                ) AS A
                WHERE (%s IS NULL OR A.title LIKE %s OR A.preview LIKE %s)
                LIMIT %s OFFSET %s;
            """
            
            # 파라미터 설정
            if second_keyword:
                params = (first_search_term, second_search_term, second_search_term, second_search_term, page_size, offset)
            else:
                # second_keyword가 없으면 두 번째 조건 무시
                params = (first_search_term, None, None, None, page_size, offset)
            
            # 쿼리 실행
            cursor.execute(sql_query, params)
            results = cursor.fetchall()

            return {
                "page": page,
                "page_size": page_size,
                "total_count": len(results),
                "results": results
            }
