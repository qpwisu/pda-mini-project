import { useState, useEffect } from 'react';
import { Button, Card, Form, InputGroup, Modal } from 'react-bootstrap';
import './searchbar.css';

export default function SearchBar({ show, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // 자동완성 추천 단어 목록
  const allSuggestions = [
    '인플레이션',
    '금리',
    'GDP',
    '주식',
    '채권',
    '환율',
    '경제성장률',
    '실업률',
    '물가상승률',
    '기준금리',
    '원/달러 환율',
    '코스피',
    '코스닥',
  ];

  useEffect(() => {
    if (searchTerm) {
      const filtered = allSuggestions.filter((suggestion) =>
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearch = () => {
    setSearchResults([
      {
        id: 1,
        title: `${searchTerm}에 관한 최신 경제 동향`,
        date: '2023-05-15',
      },
      {
        id: 2,
        title: `${searchTerm}이 경제에 미치는 영향`,
        date: '2023-05-14',
      },
      {
        id: 3,
        title: `전문가들이 전망하는 ${searchTerm}의 미래`,
        date: '2023-05-13',
      },
    ]);
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdropClassName="custom-backdrop" // 커스텀 CSS 클래스 추가
    >
      <Modal.Header closeButton>
        <Modal.Title>검색</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="search-container">
          <InputGroup className="search-input-group mb-3">
            <InputGroup.Text className="icon-left">
              <i className="bi bi-search" />
            </InputGroup.Text>
            <Form.Control
              type="search"
              placeholder="경제 뉴스 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          {suggestions.length > 0 && (
            <Card className="suggestions-card mb-3">
              <Card.Body>
                <h3 className="suggestions-title">추천 검색어</h3>
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline-secondary"
                      size="sm"
                      className="suggestion-button"
                      onClick={() => setSearchTerm(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          <Button
            onClick={handleSearch}
            className="search-button w-100 mb-3"
            variant="info"
          >
            검색
          </Button>

          {searchResults.length > 0 && (
            <div className="search-results">
              <h2 className="results-title">검색 결과</h2>
              {searchResults.map((result) => (
                <Card key={result.id} className="result-card mb-2">
                  <Card.Body>
                    <h3 className="result-title">{result.title}</h3>
                    <p className="result-date">{result.date}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
}
