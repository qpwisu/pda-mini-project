import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './myNews.css';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyNews() {
  const [news, setNews] = useState([]); // 좋아요 누른 뉴스 목록
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 라우팅 관리

  // 좋아요 누른 뉴스 목록 가져오기
  useEffect(() => {
    const fetchLikedNews = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/likes/news`, {
          withCredentials: true,
        });
        console.log("Rendering news item with id:", response.data);
        setNews(response.data.liked_news || []); // 데이터가 없으면 빈 배열로 설정
      } catch (error) { 
        console.error("Failed to fetch liked news:", error);
      }
    };
    fetchLikedNews();
  }, []);

  // 뉴스 좋아요 취소 함수
  const handleDelete = async (newsId) => {
    try {
      await axios.delete(`${API_BASE_URL}/likes/news/${newsId}`, { // 새로운 엔드포인트 사용
        withCredentials: true,
      });
      setNews(news.filter(item => item.news_id !== newsId));
    } catch (error) {
      console.error("Failed to delete liked news:", error);
    }
  };

  // 뉴스 카드 클릭 시 상세 페이지로 이동
  const handleCardClick = (newsId) => {
    navigate(`/detail/${newsId}`); // news_id를 포함한 URL로 이동
  };

  return (
    <div className="n-container">
      <h3 className="sub-title">
        좋아요 누른 <span style={{ color: "#E34348" }}>뉴스</span>
      </h3>
      <div className="news-container">
        {news.length === 0 ? (
          <p className="no-news-message">좋아요 누른 뉴스가 없습니다.</p>
        ) : (
          news.map((item) => (
            <div 
              className="news-card" 
              key={item.news_id}
              onClick={() => handleCardClick(item.news_id)} // 카드 클릭 시 handleCardClick 호출
              style={{ cursor: 'pointer' }} // 클릭 가능하도록 커서 스타일 추가
            >
              <button 
                className="delete-button" 
                onClick={(e) => { 
                  e.stopPropagation(); // 이벤트 전파 중지하여 클릭이 카드 전체에 영향을 미치지 않게 함
                  handleDelete(item.news_id); 
                }}
              >
                ×
              </button>
              <img 
                src={item.imageURL || 'https://via.placeholder.com/150'} 
                alt={item.title} 
                className="news-image"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // 이미지 로드 실패 시 기본 이미지로 대체
              />
              <h2>{item.title}</h2>
              <hr className="separator" />
              <div className="news-contents">
                <p>{item.preview}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
