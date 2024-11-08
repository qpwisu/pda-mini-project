import { useState, useNavigate } from 'react';
import { Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

function NewSearchBar() {
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

  return (
    <Form style={{ width: '100%', maxWidth: '700px', margin: 'auto' }}>
      <InputGroup>
        <FormControl
          placeholder="검색어를 입력해주세요."
          aria-label="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          style={{
            borderRadius: '30px',
            padding: '10px 20px',
            fontWeight: 'bold',
            color: '#E34348',
          }}
        />
        <Button
          variant="outline-secondary"
          onClick={searchButton}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: '#E34348',
            borderRadius: '30px',
          }}
        >
          <FaSearch />
        </Button>
      </InputGroup>
    </Form>
  );
}
