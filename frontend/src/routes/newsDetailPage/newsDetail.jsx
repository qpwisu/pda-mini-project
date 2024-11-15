// src/routes/newsDetailPage/newsDetail.jsx
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import DOMPurify from 'dompurify';
import parse, { domToReact } from 'html-react-parser';
import { Fragment } from 'react';
import clickBtn from '../../assets/clickBtn.svg';
import clickBtn2 from '../../assets/clickBtn2.svg';
import Modal from 'react-bootstrap/Modal';
import Login from '../loginPage/login';
import Signup from '../signupPage/signup';
import {
  OffLoginModal,
  OffSignupModal,
  OnLoginModal,
} from '~/store/modalSlice';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function NewsDetail() {
  const { idx } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [tooltip, setTooltip] = useState({ text: '', x: 0, y: 0, show: false });
  const [btn, setBtn] = useState(false);
  const [likieNewsList, setLikeNewsList] = useState([]);
  const { isLoginModal, isSignupModal } = useSelector((state) => state.modal);

  // const apiUrl = process.env.REACT_APP_API_URL || ''; //  .env.production 때문에 사용하는데 잘 안됨
  const dispatch = useDispatch();

  const OpenLoginModal = () => {
    dispatch(OnLoginModal());
  };
  // login modal창 닫기
  const CloseLoginModal = () => {
    dispatch(OffLoginModal());
  };
  // signup modal창 닫기
  const CloseSignupModal = () => {
    dispatch(OffSignupModal());
  };

  useEffect(() => {
    const fetchLikedNewsList = async () => {
      try {
        const likedResponse = await axios.get(
          `${API_BASE_URL}/api/likes/news`,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        const newsIds = likedResponse.data.liked_news.map(
          (item) => item.news_id
        );
        setLikeNewsList(newsIds);
        console.log(newsIds);
        if (newsIds.includes(Number(idx))) {
          setBtn(true);
        } else {
          setBtn(false);
        }
      } catch (error) {
        console.error('Error fetching liked news list:', error);
      }
    };

    fetchLikedNewsList(); // Call the function
  }, [idx]);

  const isClikedBtn = async () => {
    console.log('click');
    console.log(btn);
    if (btn === false) {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/likes/news/${idx}`,
          { news_id: idx },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        if (response.status !== 200) {
          throw new Error('Failed to like the article');
        }
        setBtn((prev) => !prev);
      } catch (error) {
        console.error('Error sending like request111:', error);
        OpenLoginModal();
      }
    } else if (btn === true) {
      try {
        // DELETE 요청
        const response = await axios.delete(
          `${API_BASE_URL}/api/likes/news/${idx}`,
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );
        if (response.status !== 200 && response.status !== 204) {
          throw new Error('Failed to unlike the article');
        }
        setBtn((prev) => !prev);
      } catch (error) {
        console.error('Error sending unlike request:', error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news/detail/${idx}`);
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

  const contentToProcess = articleData.new_content || '';

  // DOMPurify 설정: 필요한 태그를 허용
  const DOMPurifyOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'span'],
    ALLOWED_ATTR: ['href', 'title', 'class', 'data-tooltip'],
  };

  // 콘텐츠를 정화하여 안전하게 만듭니다.
  const sanitizedContent = DOMPurify.sanitize(
    contentToProcess,
    DOMPurifyOptions
  );

  // 콘텐츠를 파싱하고, 커스텀 replace 함수를 사용하여 툴팁 로직 적용
  const parsedContent = parse(sanitizedContent, {
    replace: (domNode) => {
      if (
        domNode.name === 'i' &&
        domNode.children &&
        domNode.children.length > 0
      ) {
        // <i> 태그 내부의 툴팁 텍스트를 가져옵니다.
        const tooltipText = domNode.children[0].data;

        // 이전 노드가 텍스트 노드인지 확인합니다.
        const previousSibling = domNode.prev;
        console.log(previousSibling);
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
    },
  });

  return (
    <div className="container my-4 d-flex justify-content-center">
      <article className="w-50 d-flex flex-column gap-4 align-items-center px-3">
        {/* 제목 */}
        <h3 className="font-weight-bold text-center">{articleData.title}</h3>

        <div className="d-flex justify-content-between align-items-center w-100 px-3">
          {/* 날짜 */}
          <div className="text-muted w-100 text-left">
            {new Date(articleData.published_at).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'short',
            })}
          </div>
          <button
            className="btn p-0"
            onClick={isClikedBtn}
            style={{ background: 'none', border: 'none' }}
          >
            <img
              src={btn ? clickBtn : clickBtn2}
              alt="스크랩 버튼"
              width="20"
              height="20"
            />
          </button>
          <hr />
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
        <div
          className="text-start"
          style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
        >
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

      {/* 로그인 모달 */}
      <Modal show={isLoginModal} onHide={CloseLoginModal} centered>
        <Modal.Header
          style={{ borderBottom: 'none' }}
          closeButton
        ></Modal.Header>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Login />
        </div>
        <Modal.Footer
          style={{ padding: '19px', borderTop: 'none' }}
        ></Modal.Footer>
      </Modal>

      {/* 회원가입 모달 */}
      <Modal show={isSignupModal} onHide={CloseSignupModal} centered>
        <Modal.Header
          style={{ borderBottom: 'none' }}
          closeButton
        ></Modal.Header>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Signup />
        </div>
        <Modal.Footer
          style={{ padding: '19px', borderTop: 'none' }}
        ></Modal.Footer>
      </Modal>
    </div>
  );
}
