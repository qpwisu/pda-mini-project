import requests
from bs4 import BeautifulSoup
import json
import re

def get_detail(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        date = soup.select_one('.media_end_head_info_datestamp_time._ARTICLE_DATE_TIME').get('data-date-time')
        content = soup.select_one('.newsct_article').get_text(strip=True)
        content = re.sub(r'[\n\t\r]+', '', content)

        return {"date": date, "content": content}
    
    except Exception as e:
        print("에러 발생:", e)
        return None

def main():
    news = []
    
    response = requests.get('https://news.naver.com/breakingnews/section/101/259')
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    items = soup.select('ul.sa_list li')
    
    for i, item in enumerate(items):
        title = item.select_one('strong.sa_text_strong').get_text(strip=True)
        preview = item.select_one('.sa_text_lede').get_text(strip=True)
        url = item.select_one('a').get('href')
        img_url = item.select_one('img').get('data-src') if item.select_one('img') else None
        
        details = get_detail(url)
        
        if details:
            news.append({
                "id": i + 1,
                "title": title,
                "preview": preview,
                "url": url,
                "imgUrl": img_url,
                "date": details['date'],
                "content": details['content'],
            })

    with open('news.json', 'w', encoding='utf-8') as f:
        json.dump(news, f, ensure_ascii=False, indent=2)
        print("파일이 성공적으로 저장되었습니다")

if __name__ == "__main__":
    main()
