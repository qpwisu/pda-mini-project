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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [results, setResults] = useState([]);
  const [currentResults, setCurrentResults] = useState([]);
  const [secondKeyword, setSecondKeyword] = useState('');
  const resultsPerPage = 3;
  const location = useLocation();

  const fetchInitialResults = useCallback(async (title) => {
    const response = await fetchNewsBytitle(title, 1, 100);
    setResults([...response.results]);
  }, []);

  const fetchFilteredResults = useCallback(
    async (firstKeyword, secondKeyword) => {
      const response = await fetchNewsBytitle(
        firstKeyword,
        secondKeyword,
        1,
        100
      );
      setResults([...response.results]);
    },
    []
  );

  useEffect(() => {
    const title = location.state.query;
    fetchInitialResults(title, secondKeyword);
  }, [location.state.query, fetchInitialResults]);

  useEffect(() => {
    setTotalPages(Math.ceil(results.length / resultsPerPage));
    setCurrentResults(
      results.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
      )
    );
  }, [results, currentPage]);

  const handleSecondarySearch = useCallback(() => {
    const title = location.state.query;
    fetchFilteredResults(title, secondKeyword);
    setCurrentPage(1); // 새로운 검색 시 페이지를 초기화
  }, [location.state.query, secondKeyword, fetchFilteredResults]);

  return (
    <>
      <div className="container-wrapper">
        <div className="search-results-container">
          {/* 검색 결과 영역 */}
          <div className="search-results-content">
            <h1 className="search-results-title display-5">검색 결과</h1>

            <SearchBar
              onSecondarySearch={(keyword) => setSecondKeyword(keyword)}
              onSearch={handleSecondarySearch}
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

          {/* 사이드바 영역 */}
          <div className="sidebar">
            <PopularTermsSidebar />
          </div>
        </div>
      </div>
    </>
  );
}
