# PDA News Project

이 프로젝트는 경제 뉴스에서 경제 용어를 검색하지 않고 바로 알려주는 웹 프로젝트입니다. 이 프로젝트는 최신 경제 뉴스에서 경제 용어에 마우스를 대면 토글로 설명을 보여줍니다. 

## 주요 페이지 스크린샷

### Main Page
<img src="https://github.com/user-attachments/assets/e948f842-1913-4cf6-90da-31e1a9762965" alt="Main Page" width="700">

### Search Page
<img src="https://github.com/user-attachments/assets/22d007c4-caf6-4875-9809-c19603607896" alt="Search Page" width="700">

### Login Page
<img src="https://github.com/user-attachments/assets/5b1627f0-6a69-4c8a-813b-6b0ce8b35396" alt="Login Page" width="700">

### My Page
<img src="https://github.com/user-attachments/assets/208f7534-8782-48c0-ac8a-5bb5e42fd526" alt="My Page" width="700">

### Detail Page
<img src="https://github.com/user-attachments/assets/cf483a68-8a55-47df-8602-e3d345127a7f" alt="Detail Page" width="700">


## 목차
- [팀원 소개](#팀원-소개)
- [기술 스택](#기술-스택)
- [설치 방법](#설치-방법)
- [환경 변수 설정](#환경-변수-설정)
- [배포](#배포)
- [구조](#구조)
- [기여](#기여)

---
## 팀원 소개

| 이름   | 주요 기여 내용                                  |
|--------|-----------------------------------------------|
| 장한영 |  마이페이지 구현(백,프론트), github action ci/cd, nginx proxy 설정, 프로젝트 구조 설계 |
| 홍정훈 | 디테일 페이지 구현(백,프론트) , Ec2 인프라 설계 구축, 뉴스 데이터 전처리 |
| 신정인 | 메인 페이지 구현(백,프론트) ,뉴스 크롤링, 디테일 페이지 좋아요 구현 |
| 이민호 | 로그인페이지 개발(백,프론트), 유저 정보 관리|
| 박준기 | Search페이지 개발(백,프론트), slack 알림 구현|


---

## 기술 스택

- **프론트엔드**: React, Vite
- **백엔드**: FastAPI (Python)
- **배포**: AWS EC2, GitHub Actions
- **서버 관리**: Nginx, PM2 (백엔드 프로세스 관리)
- **데이터베이스**: mysql
    ![image](https://github.com/user-attachments/assets/104d1454-2560-473b-8081-267b1f386244)

    ![image (1)](https://github.com/user-attachments/assets/4a225ddb-0f37-4459-ba00-3ea44f195a3a)


## 설치 방법

1. **레포지토리 클론**
    ```bash
    git clone https://github.com/qpwisu/pda-mini-project.git
    cd pda-mini-project
    ```
2. **프론트엔드 의존성 설치**
    ```bash
    cd frontend
    npm install
    ```
3. **백엔드 의존성 설치**
    ```bash
    cd ../backend
    pip install -r requirements.txt
    ```
4. **백엔드 의존성 설치**
    ```bash
    cd ../backend
    pip install -r requirements.txt
    ```

## 환경 변수 설정

AWS EC2에 배포할 때 필요한 환경 변수 설정:

1. **GitHub Secrets 설정**  
   GitHub Actions로 배포를 자동화하기 위해 아래의 Secrets를 설정합니다.
   - `VITE_API_BASE_URL`: API 서버의 기본 URL
   - `EC2_HOST`: EC2 인스턴스 IP 주소
   - `EC2_USER`: EC2 인스턴스 사용자명
   - `EC2_KEY`: EC2에 접속할 SSH 프라이빗 키 (GitHub Secrets에 안전하게 저장)

2. **환경 변수 파일(.env) 설정**

   - 프론트엔드 (`frontend/.env`)
     ```plaintext
     VITE_API_BASE_URL=http://<backend-server-ip>:8000
     ```

   - 백엔드 (`backend/.env`)
     ```plaintext
     DATABASE_URL=postgresql://<username>:<password>@<db-host>:<db-port>/<db-name>
     ```
3. **프록시 설정 /etc/nginx/sites-available**
    - 
    ```
    server {
    listen 80;
    server_name ec2 public-ip;

    # React 빌드 파일이 위치한 경로 설정
    root /home/ubuntu/pda_data/pda-news-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 백엔드 API 서버로의 프록시 설정
    location /api/ {
        proxy_pass http://127.0.0.1:8000;  # 백엔드 서버의 IP 주소
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
    ```

## 배포

이 프로젝트는 GitHub Actions를 사용하여 EC2로 자동 배포됩니다. `main` 브랜치에 변경 사항이 있을 때마다 자동으로 빌드되고 EC2 서버에 배포됩니다.

- **Nginx 설정**: EC2 서버의 Nginx가 프론트엔드 정적 파일을 제공하며, `/api` 경로로 들어오는 요청은 백엔드 FastAPI 서버로 프록시합니다.
- **디렉터리 구조**: 빌드된 `dist` 파일은 `/home/ubuntu/pda_data/pda-news-frontend`에 위치합니다.

## 구조

```plaintext
pda-mini-project/
├── frontend/               # 프론트엔드 React 코드
│   ├── src/                # React 소스 코드
│   ├── public/             # 정적 파일
│   ├── .env                # 프론트엔드 환경 변수
│   └── vite.config.js      # Vite 설정 파일
├── backend/                # 백엔드 FastAPI 코드
│   ├── app/                # FastAPI 애플리케이션 코드
│   ├── .env                # 백엔드 환경 변수
│   └── requirements.txt    # 백엔드 의존성 파일
└── data/                   # 데이터 및 추가 스크립트 (필요 시)
```


## 기여

1. **Fork** 레포지토리를 만들고 새 브랜치를 생성합니다.
2. 수정 사항을 커밋하고 **Pull Request**를 생성합니다.
3. PR이 승인되면 프로젝트에 반영됩니다.

