import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import fetchNewsBytitle from '~/lib/apis/news';
import 'bootstrap/dist/css/bootstrap.min.css';
import './search.css';
import SearchBar from '~/components/search/searchbar';

export default function Search() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [results, setResults] = useState([]);
  const [currentResults, setCurrentResults] = useState([]);
  const resultsPerPage = 3;
  const location = useLocation();

  useEffect(() => {
    (async () => {
      const title = location.state.query;
      await fetchNewsBytitle(title, 1, 100).then((r) => {
        setResults([...r.results]);
        return r.results;
      });
    })();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(results.length / resultsPerPage));
    setCurrentResults(
      results.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
      )
    );
  }, [results, currentPage]);

  return (
    <>
      <SearchBar />
      <div className="container search-results-container">
        <div className="col-lg-8 mx-auto">
          <h1 className="search-results-title display-5">검색 결과</h1>

          <div className="mb-5">
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

          <div className="d-flex justify-content-between align-items-center">
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
            <div className="next-buttons">
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
        </div>
      </div>
    </>
  );
}
