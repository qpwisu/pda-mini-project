from ..mysql_connector import get_db_connection

def get_main_news():
    try:
        with get_db_connection() as connection:
            with connection.cursor() as cursor:
                query = "SELECT id, title, preview, imageURL, published_at FROM News ORDER BY published_at DESC LIMIT 12"
                cursor.execute(query)
                results = cursor.fetchall()
                print(f"Fetched news: {results}")
                return results
    except Exception as e:
        print(f"Database error: {e}")
        return []