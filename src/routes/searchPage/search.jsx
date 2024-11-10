// search.jsx

import { useState, useEffect, useCallback } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import { fetchNewsBytitle } from '~/lib/apis/search';
import 'bootstrap/dist/css/bootstrap.min.css';
import './search.css';
import SearchBar from '~/components/search/searchbar';
import PopularTermsSidebar from '~/components/popularTerm/popularTermSidebar';

export default function Search() {
  const location = useLocation();
  const initialKeyword = location.state?.query || '';

  const [firstKeyword, setFirstKeyword] = useState(initialKeyword);
  const [secondKeyword, setSecondKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [results, setResults] = useState([]);
  const [currentResults, setCurrentResults] = useState([]);

  // 첫 검색: `firstKeyword`로만 수행
  const fetchInitialResults = useCallback(async () => {
    const response = await fetchNewsBytitle(firstKeyword, '', 1, 100);
    setResults(response.results || []);
    setCurrentPage(1);
  }, [firstKeyword]);

  // 결과 내 검색: `firstKeyword`와 `secondKeyword`를 모두 사용
  const fetchFilteredResults = useCallback(async () => {
    const response = await fetchNewsBytitle(
      firstKeyword,
      secondKeyword,
      1,
      100
    );
    setResults(response.results || []);
    setCurrentPage(1);
  }, [firstKeyword, secondKeyword]);

  // 컴포넌트 초기 로드 시 첫 검색 수행
  useEffect(() => {
    if (!secondKeyword) {
      fetchInitialResults();
    } else {
      fetchFilteredResults();
    }
  }, [fetchInitialResults, fetchFilteredResults, secondKeyword]);

  // 검색 결과에 따른 페이지 설정
  useEffect(() => {
    const total_page = Math.ceil(results.length / 3);
    setTotalPages(total_page === 0 ? 1 : total_page);
    setCurrentResults(results.slice((currentPage - 1) * 3, currentPage * 3));
  }, [results, currentPage]);

  // `SearchBar`에서 검색 시 `secondKeyword`로만 업데이트
  const handleSecondarySearch = useCallback((keyword) => {
    setSecondKeyword(keyword);
  }, []);

  return (
    <>
      <div className="container-wrapper">
        <div className="search-results-container">
          <div className="search-results-content">
            <h1 className="search-results-title display-5">검색 결과</h1>

            <SearchBar
              onSecondarySearch={handleSecondarySearch} // 결과 내 검색어 설정
              onSearch={() => fetchFilteredResults()} // 결과 내 검색 실행
              isSecondarySearch={!!firstKeyword} // firstKeyword가 있을 때만 결과 내 검색 모드로 설정
            />

            <div className="results-section mb-5 mt-5">
              {currentResults.length > 0 ? (
                <div>
                  {currentResults.map((result) => (
                    <Link
                      to={`/detail/${result.id}`}
                      key={result.id}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <Card key={result.id} className="result-card">
                        <Card.Body className="result-card-body">
                          <Card.Title className="result-card-title">
                            {result.title}
                          </Card.Title>
                          <Card.Text className="result-card-summary">
                            {result.preview.length > 0
                              ? result.preview
                              : result.content}
                          </Card.Text>
                          <div className="result-card-footer">
                            <span>{result.published_at.substring(0, 10)}</span>
                            <span className="news-category">경제</span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="fw-bold fs-2">결과 없음!!</div>
              )}
            </div>

            <div className="pagination-container">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
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
                variant="outline"
                className="pagination-button"
              >
                다음 <ChevronRight className="ms-2" />
              </Button>
            </div>
          </div>

          <div className="sidebar">
            <PopularTermsSidebar />
          </div>
        </div>
      </div>
    </>
  );
}
