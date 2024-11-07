// EconomicTerms.jsx
import React, { useState } from 'react';
import './myTerm.css';

const initialTerms = [
  { term: 'GDP', description: '국내총생산, 한 나라의 경제 활동을 나타내는 지표입니다. 이는 경제 규모를 측정하는 중요한 지표 중 하나로, 국민의 생활 수준과 경제 성장을 평가하는 데 사용됩니다.' },
  { term: '인플레이션', description: '상품과 서비스의 전반적인 가격 수준이 상승하는 현상입니다. 인플레이션은 경제 성장을 저해할 수 있으며, 구매력 감소와 생활비 상승으로 이어질 수 있습니다.' },
  { term: '디플레이션', description: '상품과 서비스의 전반적인 가격 수준이 하락하는 현상입니다. 디플레이션은 경제 활동을 둔화시키고, 실업률 증가와 같은 문제를 야기할 수 있습니다.' },
  { term: '이자율', description: '대출이나 저축에 대해 지불되거나 받는 비율입니다. 이자율은 경제의 자금 흐름에 큰 영향을 미치며, 소비와 투자 결정을 좌우하는 중요한 요소입니다.' },
  { term: '불황', description: '경제 활동이 둔화되어 GDP가 연속 두 분기 감소하는 현상입니다. 불황은 기업의 이익 감소와 실업률 증가로 이어질 수 있으며, 경제 전반에 부정적인 영향을 미칠 수 있습니다.' },
  { term: 'GDP', description: '국내총생산, 한 나라의 경제 활동을 나타내는 지표입니다. 이는 경제 규모를 측정하는 중요한 지표 중 하나로, 국민의 생활 수준과 경제 성장을 평가하는 데 사용됩니다.의 경제 활동을 나타내는 지표입니다. 이는 경제 규모를 측정하는 중요한 지표 중 하나로, 국민의 생활 수준과 경제 성장을 평가하는 데 사용됩니다.의 경제 활동을 나타내는 지표입니다. 이는 경제 규모를 측정하는 중요한 지표 중 하나로, 국민의 생활 수준과 경제 성장을 평가하는 데 사용됩니다.' },
  { term: '인플레이션', description: '상품과 서비스의 전반적인 가격 수준이 상승하는 현상입니다. 인플레이션은 경제 성장을 저해할 수 있으며, 구매력 감소와 생활비 상승으로 이어질 수 있습니다.' },
  { term: '디플레이션', description: '상품과 서비스의 전반적인 가격 수준이 하락하는 현상입니다. 디플레이션은 경제 활동을 둔화시키고, 실업률 증가와 같은 문제를 야기할 수 있습니다.' },
  { term: '이자율', description: '대출이나 저축에 대해 지불되거나 받는 비율입니다. 이자율은 경제의 자금 흐름에 큰 영향을 미치며, 소비와 투자 결정을 좌우하는 중요한 요소입니다.' },
  { term: '불황', description: '경제 활동이 둔화되어 GDP가 연속 두 분기 감소하는 현상입니다. 불황은 기업의 이익 감소와 실업률 증가로 이어질 수 있으며, 경제 전반에 부정적인 영향을 미칠 수 있습니다.' },
];

export default function EconomicTerms() {
  const [terms, setTerms] = useState(initialTerms);

  const handleDelete = (indexToDelete) => {
    setTerms(terms.filter((_, index) => index !== indexToDelete));
  };

  return (
    <div className="t-container">
      <h2 className='sub-title'>좋아요 누른 경제용어</h2>
      <div className="terms-container">
        {terms.map((item, index) => (
          <div className="term-card" key={index}>
            <button className="delete-button" onClick={() => handleDelete(index)}>×</button>
            <h2>{item.term}</h2>
            <hr className="separator" /> {/* 구분선 추가 */}
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
