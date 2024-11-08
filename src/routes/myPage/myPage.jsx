// myPage.jsx
import React, { useState, useEffect } from 'react';
import MyTerm from '~/components/myPage/myTerm';
import MyNews from '~/components/myPage/myNews';

export default function MyPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // sessionStorage에서 user 데이터를 파싱하여 username과 email 추출
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUsername(parsedData.username);
      setEmail(parsedData.email);
    }
  }, []);

  return (
    <div style={{ padding: '30px 50px', backgroundColor: 'rgb(251, 251, 251)' }}>
      <h1 style={{ 
        marginBottom: '30px'}}>My Page</h1>
      
      <div style={{ 
        marginBottom: '20px'
        ,backgroundColor: '#ffffff',
          padding: '20px 40px',
          borderRadius:'8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          maxWidth: '100%',
          height: '100%' }}>
        <h3 className="sub-title">
            프로필
        </h3>
        <p><strong style={{ color: "#E34348" }}>Username:</strong> {username}</p>
        <p><strong style={{ color: "#E34348" }}>Email:</strong> {email}</p>
      </div>

      {/* 좋아요 누른 용어 및 뉴스 섹션 */}
      <div style={{ marginBottom: '20px' }}>
        <MyTerm />
      </div>
      <MyNews />
    </div>
  );
}
