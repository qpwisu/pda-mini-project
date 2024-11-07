import requests
from bs4 import BeautifulSoup
import json
import re
import time

id = 1

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def get_detail(url):
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        date = soup.select_one('.media_end_head_info_datestamp_time._ARTICLE_DATE_TIME').get('data-date-time')

        # 본문을 개행 포함 상태로 가져오기
        # 개행 문자를 <br> 태그로 유지
        content = str(soup.select_one('.newsct_article')).replace('<br/>', '<br>').replace('</br>', '<br>')  # '<br>' 태그만 남겨둠

        # 불필요한 태그를 제거하고 텍스트만 남겨둠
        content = re.sub(r'<(/?[^>]+)>', lambda m: '<br>' if m.group(1) == 'br' else '', content)  # <br> 태그를 제외한 나머지 태그 제거
        content = re.sub(r'[\n\r\t]+', '', content)

        time.sleep(2)
        return {"date": date, "content": content}

    except Exception as e:
        print("에러 발생:", e)
        return None

def main():
    global id
    all_news = []
    page = 1

    while len(all_news) < 5:
        response = requests.get(f'https://news.naver.com/breakingnews/section/101/259?page={page}')
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
                all_news.append({
                    "id": id,
                    "title": title,
                    "preview": preview,
                    "url": url,
                    "imgUrl": img_url,
                    "date": details['date'],
                    "content": details['content'],
                })
                id += 1

            if len(all_news) >= 30:
                break

        page += 1
        if len(items) == 0:
            break

    with open('news.json', 'w', encoding='utf-8') as f:
        json.dump(all_news, f, ensure_ascii=False, indent=2)
        print("파일이 성공적으로 저장되었습니다")

if __name__ == "__main__":
    main()
