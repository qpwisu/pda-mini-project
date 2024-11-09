// src/routes/newsDetailPage/newsDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';
import { Fragment } from 'react';



export default function NewsDetail() {
  const { idx } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [tooltip, setTooltip] = useState({ text: '', x: 0, y: 0, show: false }); 

  const apiUrl = process.env.REACT_APP_API_URL || ''; //  .env.production 때문에 사용하는데 잘 안됨

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://3.36.99.137:8000/news/detail/${idx}`);
        // const response = await fetch(`${apiUrl}/news/detail/${idx}`); .env.production 사용시 사용
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

  // DOMPurify 설정: 필요한 태그를 허용
  const DOMPurifyOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'title', 'class', 'data-tooltip'],
  };

  // 콘텐츠를 정화하여 안전하게 만듭니다.
  const sanitizedContent = DOMPurify.sanitize(contentToProcess, DOMPurifyOptions);

  // 콘텐츠를 파싱하고, 커스텀 replace 함수를 사용하여 툴팁 로직 적용
  const parsedContent = parse(sanitizedContent, {
    replace: (domNode) => {
      if (domNode.name === 'i' && domNode.children && domNode.children.length > 0) {
        // <i> 태그 내부의 툴팁 텍스트를 가져옵니다.
        const tooltipText = domNode.children[0].data;
        

        // 이전 노드가 텍스트 노드인지 확인합니다.
        const previousSibling = domNode.prev;
        console.log(previousSibling)
        if (previousSibling && previousSibling.type === 'text') {
          const textContent = previousSibling.data.trim();
          const words = textContent.split(' ');
          const lastWord = words.pop();
          const remainingText = words.join(' ');

          // 이전 텍스트 노드를 업데이트
          previousSibling.data = remainingText ? remainingText + ' ' : '';
          // 마지막 단어를 툴팁이 적용된 요소로 반환하고 <i> 태그는 제외
          return (
            <>
              {previousSibling.data}
              <span
                className="cursor-help border-bottom border-dark"
                onMouseEnter={(e) => {
                  setTooltip({
                    text: tooltipText,
                    x: e.clientX,
                    y: e.clientY,
                    show: true,
                  });
                }}
                onMouseLeave={() => setTooltip({ ...tooltip, show: false })}
              >
                {lastWord}
              </span>
            </>
          );
        }
      }
      // <i> 태그가 아닌 경우에는 그대로 렌더링
      return domNode;
    }
  });

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

        {/* 이미지 */}
        {articleData.imageURL && (
          <img
            src={articleData.imageURL}
            alt="News article image"
            className="w-100 rounded"
          />
        )}

        {/* 본문 내용 */}
        <div className="text-start" style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          {parsedContent}
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
