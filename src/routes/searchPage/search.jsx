import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import './search.css';

// 더미 데이터 - 실제 구현시 API로 대체
const dummyResults = [
  {
    id: 1,
    title: '중앙은행, 기준금리 동결 결정',
    summary:
      '중앙은행은 현재의 경제 상황을 고려하여 기준금리를 현 수준에서 동결하기로 결정했습니다.',
    date: '2023-05-15',
    category: '금융',
  },
  {
    id: 2,
    title: '2분기 GDP 성장률 예상치 상회',
    summary:
      '올해 2분기 GDP 성장률이 전문가들의 예상을 뛰어넘었습니다. 이는 수출 증가와 내수 회복에 힘입은 것으로 분석됩니다.',
    date: '2023-05-14',
    category: '경제',
  },
  {
    id: 3,
    title: '물가상승률 둔화세 지속',
    summary:
      '최근 발표된 통계에 따르면, 물가상승률이 지난달에 이어 이번 달에도 둔화세를 보이고 있습니다.',
    date: '2023-05-13',
    category: '경제',
  },
  {
    id: 4,
    title: '주요 기업 실적 발표, 전반적으로 호조',
    summary:
      '주요 기업들의 1분기 실적이 발표되었습니다. 대부분의 기업이 예상을 웃도는 실적을 기록했습니다.',
    date: '2023-05-12',
    category: '경제',
  },
  {
    id: 5,
    title: '새로운 무역 협정 체결, 수출 증가 기대',
    summary:
      '정부는 새로운 무역 협정을 체결했다고 발표했습니다. 이를 통해 수출 증가가 기대됩니다.',
    date: '2023-05-11',
    category: '경제',
  },
];

export default function Search() {
  // const [searchTerm, setSearchTerm] = useState('');
  // const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 4;

  // const filteredResults = dummyResults.filter(
  //   (result) =>
  //     (filter === 'all' || result.category === filter) &&
  //     (result.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       result.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  // );

  // const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  // const currentResults = filteredResults.slice(
  //   (currentPage - 1) * resultsPerPage,
  //   currentPage * resultsPerPage
  // );

  const totalPages = Math.ceil(dummyResults.length / resultsPerPage);
  const currentResults = dummyResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="container search-results-container">
      <div className="col-lg-8 mx-auto">
        <h1 className="search-results-title display-5">검색 결과</h1>

        {/* <div className="d-flex mb-5 gap-3">
          <InputGroup className="search-input-group">
            <Form.Control
              type="search"
              placeholder="결과 내 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" />
          </InputGroup>
          <Form.Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
            aria-label="카테고리 선택"
          >
            <option value="all">전체</option>
            <option value="경제">경제</option>
            <option value="금융">금융</option>
            <option value="기업">기업</option>
            <option value="무역">무역</option>
          </Form.Select>
        </div> */}

        <div className="mb-5">
          {currentResults.map((result) => (
            <Card key={result.id} className="result-card">
              <Card.Body className="result-card-body">
                <Card.Title className="result-card-title">
                  {result.title}
                </Card.Title>
                <Card.Text className="result-card-summary">
                  {result.summary}
                </Card.Text>
                <div className="result-card-footer">
                  <span>{result.date}</span>
                  <span>{result.category}</span>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline-primary"
            className="pagination-button"
          >
            <ChevronLeft className="me-2" /> 이전
          </Button>
          <span className="pagination-info">
            페이지 {currentPage} / {totalPages}
          </span>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            variant="outline-primary"
            className="pagination-button"
          >
            다음 <ChevronRight className="ms-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
