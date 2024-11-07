// src/routes/newsDetailPage/newsDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function NewsDetail() {
  const { idx } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [tooltip, setTooltip] = useState({ text: '', x: 0, y: 0, show: false });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/news/detail/${idx}`);
        const data = await response.json();
        setArticleData(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    if (idx) {
      fetchData();
    }
  }, [idx]);

  if (!articleData) return <div>Loading...</div>;

  const contentToProcess = articleData.new_content || "";

  const processContent = (content) => {
    const parts = content.split(/<i>|<\/i>/);
    return parts.map((part, index) => {
      if (index % 2 === 0) {
        const words = part.split(/\s+/);
        const lastWord = words.pop();
        
        return (
          <span key={index}>
            {words.join(' ')}{' '}
            {lastWord && (
              <span
                className="cursor-help border-bottom border-dark"
                onMouseEnter={(e) => {
                  if (parts[index + 1]) {
                    setTooltip({
                      text: parts[index + 1],
                      x: e.clientX,
                      y: e.clientY,
                      show: true,
                    });
                  }
                }}
                onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
              >
                {lastWord}
              </span>
            )}
          </span>
        );
      }
      return null;
    });
  };

  return (
    <div className="container my-4 d-flex justify-content-center">
      <article className="w-50 d-flex flex-column gap-4 align-items-center px-3">
        
        {/* 제목 */}
        <h3 className="font-weight-bold text-center">
          {articleData.title}
        </h3>

        {/* 날짜 */}
        <div className="text-muted">
          {new Date(articleData.published_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })}
        </div>

        {/* 이미지 (전체 너비) */}
        {articleData.imageURL && (
          <img
            src={articleData.imageURL}
            alt="News article image"
            className="w-100 rounded"
          />
        )}

        {/* 본문 내용 */}
        <div className="text-start" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          {contentToProcess.includes("<i>")
            ? processContent(contentToProcess)
            : contentToProcess}
        </div>

        {/* 툴팁 */}
        {tooltip.show && (
          <div
            className="position-fixed bg-dark text-white p-2 rounded text-sm max-w-xs z-50"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y + 20}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {tooltip.text}
          </div>
        )}
      </article>
    </div>
  );
}
