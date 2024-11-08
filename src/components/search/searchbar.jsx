import { useState } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './searchbar.css';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const searchButton = () => {
    if (query.trim()) {
      navigate(`/search`, { state: { query } });
      setQuery('');
      console.log(query);
    } else {
      alert('검색어를 입력하세요.');
    }
  };

  // Enter 키 이벤트 처리 함수
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      searchButton();
    }
  };

  return (
    <Form className="search-bar-form">
      <InputGroup>
        <FormControl
          placeholder="검색어를 입력해주세요."
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          className="search-bar-input"
        />
        <Button
          variant="outline-secondary"
          onClick={() => searchButton}
          onKeyDown={(e) => {
            handleKeyDown(e);
          }}
          className="search-bar-button"
        >
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
}
