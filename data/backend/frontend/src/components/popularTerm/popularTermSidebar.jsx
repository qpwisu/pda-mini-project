import './popularTermsSidebar.css';
import { useState, useEffect } from 'react';
import fetchPopularTerms from '~/lib/apis/term';

export default function PopularTermsSidebar() {
  const [result, setResult] = useState([]);

  const getTopTerms = async () => {
    await fetchPopularTerms().then((r) => setResult(r.data));
  };

  useEffect(() => {
    getTopTerms();
  }, []);
  return (
    <div className="popular-terms-sidebar">
      <h3 className="sidebar-title">인기 경제 용어</h3>
      <ul className="terms-list">
        {result.map((ele, idx) => (
          <li key={idx}>
            {idx + 1}. {ele.term}
          </li>
        ))}
      </ul>
    </div>
  );
}
