from ..mysql_connector import get_db_connection

def get_news_by_idx(id: int):
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                query = "SELECT * FROM News WHERE id = %s"
                cursor.execute(query, (id,))
                result = cursor.fetchone()
                return result
    except Exception as e:
        print(f"Database error: {e}")
        return None
