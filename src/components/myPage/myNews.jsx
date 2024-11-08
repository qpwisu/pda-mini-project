import React, { useState, useEffect } from 'react';
import './myNews.css';
import axios from 'axios';

export default function MyNews() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchLikedNews = async () => {
      try {
        const response = await axios.get('/api/likes/news', {
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

  const handleDelete = async (newsId) => {
    try {
      await axios.delete(`/api/likes/news/${newsId}`);
      setNews(news.filter(item => item.news_id !== newsId));
    } catch (error) {
      console.error("Failed to delete liked news:", error);
    }
  };

  return (
    <div className="n-container">
      <h3 className="sub-title">
      좋아요 누른 <span style={{ color: "#E34348" }}> 뉴스</span>
      </h3>
      <div className="news-container">
        {news.length === 0 ? (
          <p className="no-news-message">좋아요 누른 뉴스가 없습니다.</p>
        ) : (
          news.map((item) => (
            <div className="news-card" key={item.news_id}>
              <button className="delete-button" onClick={() => handleDelete(item.news_id)}>×</button>
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
