from fastapi import FastAPI, Query, Response
import json
from flashtext import KeywordProcessor

app = FastAPI()

# JSON 파일 경로
JSON_FILE_PATH = "filtered_terms.json"

# 서버 시작 시 JSON 파일 로드 및 용어 매핑 생성
with open(JSON_FILE_PATH, "r", encoding="utf-8") as file:
    data = json.load(file)  # data는 리스트입니다.
    # 리스트의 각 항목에서 "용어"와 "설명"을 추출하여 딕셔너리 생성
    term_map = {item["용어"]: item["설명"] for item in data}

# flashtext의 KeywordProcessor 생성 및 키워드 추가
keyword_processor = KeywordProcessor()
for key, value in term_map.items():
    keyword_processor.add_keyword(key, value)

# 대체 함수 정의
def replace_terms(content: str) -> str:
    return keyword_processor.replace_keywords(content)

# FastAPI 엔드포인트
@app.get("/replace-article/")
async def replace_article_content(article_content: str = Query(...)):
    replaced_content = replace_terms(article_content)
    return Response(content=replaced_content, media_type="text/plain")


test_content = """
[서울=뉴시스] 고승민 기자 = 이재명 더불어민주당 대표가 4일 서울 여의도 국회에서 열린 최고위원회의에서 발언하고 있다. 
2024.11.04. kkssmm99@newsis.com [서울=뉴시스]신재현 기자 = 이재명 더불어민주당 대표가 4일 장고 끝에 금융투자소득세(금투세) 
폐지를 결정한 가운데 당내에서는 이 대표 결정을 환영한다는 목소리가 나왔다. 조국혁신당, 진보당 등 일부 진보 진영 측에서는 
'주식시장 선진화에 역행하는 결정', '핑계 대지 말고 그대로 시행해야 한다'고 반발했다. 이 대표는 이날 국회에서 열린 최고위원회의에서 
'정부와 여당이 밀어붙이는 금투세 폐지에 동의하기로 했다'며 '주식시장의 구조적인 어려움을 개선하기 위해 불가피하게 
정부·여당에 동의한다는 말씀을 드린다'고 밝혔다. 지난 2020년 도입된 금투세는 금융투자로 얻은 이익이 일정 수준(주식 5000만원 등)을 
넘으면 과세하는 제도로, 시행 시기를 두 차례 늦춘 끝에 2025년 1월 1일 시행을 앞두고 있다. 하지만 정부·여당과 민주당이 '금투세 폐지'를 
결정한 만큼 내년 1월 시행은 무산될 것으로 보인다. 이를 두고 민주당에서는 환영한다는 목소리가 나왔다. 대표적인 금투세 시행론자였던 
일부 의원들도 지도부 결단을 따르겠다는 입장을 밝혔다. 그간 금투세를 도입해야 한다고 주장했던 진성준 정책위의장은 이날 페이스북에 
'의원총회에서 당 지도부에 결정을 위임했고, 지도부가 결단한 만큼 저 역시 당인으로서 따르지 않을 수 없다'고 적었다. 진 의장은 
'지도부가 천명한 것처럼 '코리아 부스트업 프로젝트' 등 우리 금융시장의 정상화와 활성화를 위한 정책 수립에 노력하고, 소득 있는 곳에 
세금 있다는 조세 원칙과 부의 공정한 분배를 위한 누진 과세의 원칙을 하루속히 확립할 수 있도록 최선을 다하겠다'고 말했다.
"""

@app.get("/test-replace/")
async def test_replace():
    replaced_content = replace_terms(test_content)
    return Response(content=replaced_content, media_type="text/plain")