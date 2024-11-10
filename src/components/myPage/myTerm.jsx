import React, { useState, useEffect } from 'react';
import './myTerm.css';
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyTerm() {
  const [terms, setTerms] = useState([]); // 좋아요 누른 용어 목록
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 입력 값
  const [suggestions, setSuggestions] = useState([]); // 자동완성 용어 목록
  const [selectedTerm, setSelectedTerm] = useState(null); // 선택한 용어
  
  // 좋아요 누른 용어 목록 가져오기 (초기 렌더링 시 한 번만 실행)
  useEffect(() => {
    const fetchLikedTerms = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/likes/terms`, {
          withCredentials: true,
        });
        setTerms(response.data.liked_terms || []);
      } catch (error) {
        console.error("Failed to fetch liked terms:", error);
      }
    };
    
    fetchLikedTerms();
  }, []); // 빈 배열로 설정하여 초기 렌더링 시에만 실행

  // 자동완성 API 호출
  const handleSearchChange = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/search/autocomplete?prefix=${e.target.value}`);
        setSuggestions(response.data.terms || []);
      } catch (error) {
        console.error("Failed to fetch autocomplete suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  // 자동완성 목록에서 용어 클릭 시 검색창에 용어 표시
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSelectedTerm({ term: suggestion });
    setSuggestions([]);
  };

// 용어 추가 함수
const handleAddTerm = async (selectedTerm) => {
  if (selectedTerm) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/likes/terms`,
        { term: selectedTerm.term },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // 서버에서 성공적으로 추가된 경우 terms 상태에 새 용어 추가
      if (response.status === 200) {
        const newTerm = {
          idx: response.data.term_id,       // 서버에서 반환한 term_id 사용
          term: response.data.term,          // 서버에서 반환한 term 사용
          description: response.data.description, // 서버에서 반환한 description 사용
        };
        setTerms([...terms, newTerm]);  // 새 용어를 terms에 즉시 추가
        setSearchTerm('');
        setSuggestions([]);
        setSelectedTerm(null);
      }
    } catch (error) {
      console.error("Failed to add term:", error);
    }
  }
};


  // 용어 삭제
  const handleDelete = async (termId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/likes/terms/${termId}`, {
        withCredentials: true,
      });
      setTerms(terms.filter(term => term.idx !== termId));
    } catch (error) {
      console.error("Failed to delete liked term:", error);
    }
  };

  return (
    <div className="t-container">
      <div className='flex-tt'>
        <h3 className="sub-title">
          좋아요 누른 <span style={{ color: "#E34348" }}>경제용어</span>
        </h3>
        
        {/* 검색창 */}
        <div className="search-container">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="용어를 검색하세요..."
            className="search-input"
          />
          <button onClick={() => handleAddTerm(selectedTerm)} disabled={!selectedTerm} className="add-button">추가</button>
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li 
                key={`${suggestion}-${index}`} 
                onClick={() => handleSuggestionClick(suggestion)}
                className="suggestion-item"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 좋아요 목록 */}
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
