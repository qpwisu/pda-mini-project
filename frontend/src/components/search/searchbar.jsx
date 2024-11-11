// searchbar.jsx

import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import './searchbar.css';
import { fetchAutocompleteSuggestions } from '~/lib/apis/search';

export default function SearchBar({
  onSecondarySearch,
  onSearch,
  isSecondarySearch,
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSearchButton = useCallback(() => {
    if (query.trim()) {
      navigate('/search', { state: { query } }); // 검색어와 함께 /search 페이지로 이동
      if (onSecondarySearch) onSecondarySearch(query); // 검색어 업데이트
      if (onSearch) onSearch(); // 검색 실행
      setShowSuggestions(false); // 자동완성 제안 감추기
    } else {
      alert('검색어를 입력하세요.');
    }
  }, [query, onSecondarySearch, onSearch, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchButton();
    }
  };

  const fetchSuggestionsDebounced = debounce(async (input) => {
    if (input.trim()) {
      const response = await fetchAutocompleteSuggestions(input);
      const results = response?.terms || [];
      setSuggestions(results.slice(0, 10));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, 800);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestionsDebounced(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearchButton();
  };

  return (
    <Form className="search-bar-form">
      <div className="search-bar-container container">
        <InputGroup>
          <FormControl
            placeholder={
              isSecondarySearch ? '결과 내 검색' : '검색어를 입력해주세요.'
            }
            aria-label="Search"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="search"
            className="search-bar-input"
          />
          <Button
            variant="outline-secondary"
            onClick={handleSearchButton}
            className="search-bar-button"
          >
            <FaSearch className="search-icon" />
          </Button>
        </InputGroup>
      </div>

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </Form>
  );
}

SearchBar.propTypes = {
  onSecondarySearch: PropTypes.func,
  onSearch: PropTypes.func,
  isSecondarySearch: PropTypes.bool, // 결과 내 검색 모드 여부를 위한 prop
};
