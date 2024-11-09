import { useState } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import './searchbar.css';
import { fetchAutocompleteSuggestions } from '~/lib/apis/search'; // Import your autocomplete API function

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const searchButton = () => {
    if (query.trim()) {
      navigate(`/search`, { state: { query } });
      setQuery('');
      setShowSuggestions(false);
      console.log(query);
    } else {
      alert('검색어를 입력하세요.');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchButton();
      setSuggestions([]);
    }
  };

  const fetchSuggestions = debounce(async (input) => {
    if (input.trim()) {
      const response = await fetchAutocompleteSuggestions(input);
      const results = response?.terms || []; // terms가 undefined일 경우 빈 배열로 처리
      setSuggestions(results.slice(0, 10)); // Limit suggestions to 10 items
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, 800);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    searchButton();
  };

  return (
    <Form className="search-bar-form">
      <div className="search-bar-container container">
        <InputGroup>
          <FormControl
            placeholder="검색어를 입력해주세요."
            aria-label="Search"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            type="search"
            className="search-bar-input"
          />
          <Button
            variant="outline-secondary"
            onClick={() => searchButton()}
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
