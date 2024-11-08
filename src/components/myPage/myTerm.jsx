import React, { useState, useEffect } from 'react';
import './myTerm.css';
import axios from 'axios';

export default function MyTerm() {
  const [terms, setTerms] = useState([]); // 초기 상태를 빈 배열로 설정

  useEffect(() => {
    const fetchLikedTerms = async () => {
      try {
        const response = await axios.get('/api/likes/term', {
          withCredentials: true, // 쿠키를 요청에 자동으로 포함
        });
        setTerms(response.data.liked_terms || []); // 데이터가 없으면 빈 배열로 설정
      } catch (error) {
        console.error("Failed to fetch liked terms:", error);
      }
    };
    
    fetchLikedTerms();
  }, []);

  const handleDelete = async (termId) => {
    try {
      await axios.delete(`/api/likes/term/${termId}`);
      setTerms(terms.filter(term => term.idx !== termId));
    } catch (error) {
      console.error("Failed to delete liked term:", error);
    }
  };

  return (
    <div className="t-container">
      <h3 className="sub-title">
        좋아요 누른 <span style={{ color: "#E34348" }}>경제용어</span>
      </h3>
      <div className="terms-container">
        {terms.length === 0 ? (
          <p className="no-news-message">좋아요 누른 용어가 없습니다.</p>
        ) : (
          terms.map((item) => (
            <div className="term-card" key={item.idx}>
              <button className="delete-button" onClick={() => handleDelete(item.idx)}>×</button>
              <h2>{item.term}</h2>
              <hr className="separator" />
              <p>{item.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
