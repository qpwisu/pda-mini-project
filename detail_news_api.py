import pymysql
import json
from flashtext import KeywordProcessor
from datetime import datetime
import os,re
from dotenv import load_dotenv

load_dotenv()

# MySQL 데이터베이스 연결 설정 함수
def connect_to_db():
    try:
        db = pymysql.connect(
            host=os.getenv("DB_HOST"),  # .env에서 가져온 DB 호스트
            user=os.getenv("DB_USER"),  # .env에서 가져온 사용자 이름
            password=os.getenv("DB_PASSWORD"),  # .env에서 가져온 비밀번호
            database=os.getenv("DB_NAME"),  # .env에서 가져온 데이터베이스 이름
            charset=os.getenv("DB_CHARSET")  # .env에서 가져온 캐릭터셋
        )
        print("DB 연결 성공")
        return db
    except pymysql.MySQLError as e:
        print("DB 연결 실패:", e)
        return None


# MySQL에서 term-description 데이터 가져오기
def fetch_terms(db):
    try:
        cursor = db.cursor()
        cursor.execute("SELECT term, description FROM term")
        terms = {term: description for term, description in cursor.fetchall()}
        cursor.close()
        print("데이터셋 가져오기 성공")
        return terms
    except pymysql.MySQLError as e:
        print("데이터셋 가져오기 실패:", e)
        return None


# flashtext를 사용하여 content 텍스트에 설명을 추가하는 함수
def enrich_content(content, terms):
    keyword_processor = KeywordProcessor()

    # 각 term에 대해 키워드를 설정하고 설명을 i 태그로 감쌉니다.
    for term, description in terms.items():
        keyword_processor.add_keyword(term, f"{term}<i>{description}</i>")

    # content 텍스트에서 키워드 매칭 및 대체
    return keyword_processor.replace_keywords(content)

# def enrich_content(content, terms):
#     keyword_processor = KeywordProcessor()
#
#     # 키워드를 추가 (이때 설명은 필요하지 않으므로 생략)
#     for term in terms:
#         keyword_processor.add_keyword(term)
#
#     # content에서 키워드 추출 (중복 방지를 위해 set 사용)
#     extracted_keywords = list(dict.fromkeys(keyword_processor.extract_keywords(content)))
#
#     # 각 키워드의 첫 번째 등장 위치만 변경
#     for term in extracted_keywords:
#         description = terms[term]
#         # 첫 번째 등장 위치만 찾기
#         matches = list(re.finditer(rf'\b({re.escape(term)})\b', content))
#         if matches:
#             # 첫 번째 일치 항목의 위치에만 <i> 태그를 추가
#             first_match = matches[0]
#             start, end = first_match.span()
#             content = f"{content[:start]}{term}<i>{description}</i>{content[end:]}"
#
#     return content

# news.json 파일에서 데이터읽기
def load_news():
    json_file_path = './news.json'
    try:
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        print("news.json 파일을 찾을 수 없습니다.")
        return []


# News 테이블에 데이터 삽입
def insert_news(db, title, preview, url, imageUrl, published_at, content, new_content):
    try:
        cursor = db.cursor()
        sql = """
        INSERT INTO News (title, preview, url, imageUrl, published_at, content, new_content)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            preview = VALUES(preview),
            imageUrl = VALUES(imageUrl),
            published_at = VALUES(published_at),
            content = VALUES(content),
            new_content = VALUES(new_content)
        """
        rows_affected = cursor.execute(sql, (title, preview, url, imageUrl, published_at, content, new_content))
        db.commit()

        if rows_affected == 1:
            print(f"데이터 삽입 성공: {title}")
        else:
            print(f"중복 데이터로 업데이트: {title}")
    except pymysql.MySQLError as e:
        print(f"데이터 삽입 실패: {e}")
        db.rollback()

# def insert_news(db, title, preview, url, imageUrl, published_at, content, new_content):
#     try:
#         cursor = db.cursor()
#         sql = """
#         INSERT INTO News (title, preview, url, imageUrl, published_at, content, new_content)
#         VALUES (%s, %s, %s, %s, %s, %s, %s)
#         """
#         cursor.execute(sql, (title, preview, url, imageUrl, published_at, content, new_content))
#         db.commit()
#         print(f"데이터 삽입 성공: {title}")
#     except pymysql.MySQLError as e:
#         print(f"데이터 삽입 실패: {e}")
#         db.rollback()


# main 함수
def main():
    # 데이터베이스 연결
    db = connect_to_db()
    if not db:
        print("DB 연결 실패")
        return

    # MySQL에서 term-description 데이터를 가져옵니다.
    terms = fetch_terms(db)
    if terms is None:
        print("데이터 가져오기 실패")
        return

    # news.json에서 뉴스 데이터를 가져옵니다.
    news_data = load_news()
    if not news_data:
        print("news.json 파일을 읽을 수 없습니다.")
        return

    # news 데이터에서 content를 수정하고 DB에 삽입
    for item in news_data:
        title = item["title"]
        preview = item["preview"]
        url = item["url"]
        imgUrl = item["imgUrl"]
        published_at = datetime.strptime(item["date"], "%Y-%m-%d %H:%M:%S")  # JSON에서 date를 가져와서 변환
        content = item["content"]

        # content 필드에 설명이 추가된 new_content 생성
        new_content = enrich_content(content, terms)

        # News 테이블에 삽입
        insert_news(db, title, preview, url, imgUrl, published_at, content, new_content)

    # 연결 닫기
    db.close()


if __name__ == "__main__":
    main()
