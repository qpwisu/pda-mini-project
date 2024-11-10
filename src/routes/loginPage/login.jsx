import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { loginSuccess, loginFailure } from '~/store/authSlice';
import { OffLoginModal, OnSignupModal } from '~/store/modalSlice';
import { Alert } from 'react-bootstrap';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch(`${API_BASE_URL}/users/api/v1/login`, {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
      headers: { 'Content-type': 'application/json' },
      credentials: 'include', // 쿠키를 자동으로 포함시킴
    })
      .then((response) => response.json()) // JSON 응답 처리
      .then((data) => {
        if (data.status === 'success') {
          const userData = data.data.user;
          dispatch(loginSuccess(userData)); // 로그인 성공 시 유저 정보를 Redux에 저장
          sessionStorage.setItem('user', JSON.stringify(userData));
          dispatch(OffLoginModal()); // 모달 창 닫기
          // navigate('/'); // 로그인 후 홈 화면으로 이동
        } else {
          console.log('Login failed:', data.detail.status);
          setErrorMessage('아이디 혹은 비밀번호가 틀립니다.');
          dispatch(loginFailure(data.detail.status));
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('로그인에 실패하였습니다.');
        dispatch(loginFailure(error.message));
      });
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#F8F9FA',
    },
    loginBox: {
      backgroundColor: '#FFFFFF',
      padding: '2rem',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      width: '100%',
    },
    heading: {
      fontSize: '1.8rem',
      textAlign: 'center',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    button: {
      width: '100%',
      marginTop: '1rem',
      backgroundColor: '#DC3545',
      border: 'none',
    },
    linkText: {
      color: '#007BFF',
      cursor: 'pointer',
      textDecoration: 'none',
    },
  };
  return (
    <Card style={styles.loginBox}>
      <Card.Header
        className="text-center"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2 style={styles.heading}>로그인</h2>
        <p className="text-muted">EconoNews에 오신 것을 환영합니다</p>
      </Card.Header>
      <Card.Body>
        {errorMessage && (
          <Alert
            variant="danger"
            onClose={() => setErrorMessage('')}
            dismissible
          >
            {errorMessage}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="email" className="mb-3">
            <Form.Label>이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="password" className="mb-3">
            <Form.Label>비밀번호</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeSlashFill /> : <EyeFill />}
              </Button>
            </InputGroup>
          </Form.Group>
          <Button type="submit" style={styles.button} className="text-white">
            로그인
          </Button>
        </Form>
      </Card.Body>
      <Card.Footer className="text-center">
        <div className="text-muted mt-2">
          계정이 없으신가요?{' '}
          <a
            onClick={() => {
              dispatch(OffLoginModal());
              dispatch(OnSignupModal());
            }}
            style={styles.linkText}
          >
            회원가입
          </a>
        </div>
      </Card.Footer>
    </Card>
  );
}
