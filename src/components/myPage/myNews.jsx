// MyNews.jsx
import React, { useState } from 'react';
import './myNews.css';

const initialNews = [
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '경제 성장 둔화',
    preview: '최근 보고서에 따르면, 세계 경제 성장 속도가 둔화되고 있는 것으로 나타났습니다.최근 보고서에 따르면, 세계 경제 성장 속도가 둔화되고 있는 것으로최근 보고서에 따르면, 세계 경제 성장 속도가 둔화되고 있는 것으로최근 보고서에 따르면, 세계 경제 성장 속도가 둔화되고 있는 것으로최근 보고서에 따르면, 세계 경제 성장 속도가 둔화되고 있는 것으로',
  },
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '인플레이션 상승',
    preview: '각국의 인플레이션이 예상보다 높게 측정되어 생활비가 증가하고 있습니다.',
  },
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '주식 시장 변동성 증가',
    preview: '주식 시장에서 변동성이 급격히 증가하고 있으며, 투자자들은 이에 대비하고 있습니다.',
  },
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '인플레이션 상승',
    preview: '각국의 인플레이션이 예상보다 높게 측정되어 생활비가 증가하고 있습니다.',
  },
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '주식 시장 변동성 증가',
    preview: '주식 시장에서 변동성이 급격히 증가하고 있으며, 투자자들은 이에 대비하고 있습니다.',
  },
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '인플레이션 상승',
    preview: '각국의 인플레이션이 예상보다 높게 측정되어 생활비가 증가하고 있습니다.',
  },
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '주식 시장 변동성 증가',
    preview: '주식 시장에서 변동성이 급격히 증가하고 있으며, 투자자들은 이에 대비하고 있습니다.',
  },
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '인플레이션 상승',
    preview: '각국의 인플레이션이 예상보다 높게 측정되어 생활비가 증가하고 있습니다.',
  },
  {
    imgSrc: 'https://via.placeholder.com/150',
    title: '주식 시장 변동성 증가',
    preview: '주식 시장에서 변동성이 급격히 증가하고 있으며, 투자자들은 이에 대비하고 있습니다.',
  },
];

export default function MyNews() {
  const [news, setNews] = useState(initialNews);

  const handleDelete = (indexToDelete) => {
    setNews(news.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="n-container">
      <h2 className='sub-title'>좋아요 누른 뉴스</h2>
      <div className="news-container">
        {news.map((item, index) => (
          <div className="news-card" key={index}>
            <button className="delete-button" onClick={() => handleDelete(index)}>×</button>
            <img src={item.imgSrc} alt={item.title} className="news-image" />
            <h2>{item.title}</h2>
            <hr className="separator" />
            <div className="news-contents">
              <p>{item.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
