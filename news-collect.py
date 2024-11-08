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

        date_tag = soup.select_one('.media_end_head_info_datestamp_time._ARTICLE_DATE_TIME')
        date = date_tag.get('data-date-time') if date_tag else None

        # 본문을 문자열로 변환
        content = str(soup.select_one('.newsct_article'))

        # 다양한 형태의 <br> 태그를 표준화된 '<br />'로 변환
        content = content.replace('<br>', '<br />').replace('<br/>', '<br />').replace('</br>', '<br />')

        # 모든 태그를 제거하되, <br /> 태그는 유지
        content = re.sub(r'<\s*/?\s*([^ >]+)[^>]*>', lambda m: '<br />' if m.group(1).lower() == 'br' else '', content)

        # 불필요한 공백 제거
        content = re.sub(r'[\n\r\t]+', '', content).strip()

        time.sleep(2)
        return {"date": date, "content": content}

    except Exception as e:
        print("에러 발생:", e)
        return None

def main():
    global id
    all_news = []
    page = 1

    while len(all_news) < 30:
        response = requests.get(f'https://news.naver.com/breakingnews/section/101/259?page={page}')
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        items = soup.select('ul.sa_list li')

        for i, item in enumerate(items):
            title_tag = item.select_one('strong.sa_text_strong')
            preview_tag = item.select_one('.sa_text_lede')
            url_tag = item.select_one('a')
            img_tag = item.select_one('img')

            title = title_tag.get_text(strip=True) if title_tag else ''
            preview = preview_tag.get_text(strip=True) if preview_tag else ''
            url = url_tag.get('href') if url_tag else ''
            img_url = img_tag.get('data-src') if img_tag else None

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
