import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';
import { checkAuth, loginSuccess, loginFailure } from '~/store/authSlice';
import { useSelector } from 'react-redux';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, isLoggedIn, user } = useSelector(
    (state) => state.auth
  );
  // console.log(status);
  // console.log('user updated', user);
  console.log('redux-user', user);
  console.log('redux-isloggedin', isLoggedIn);
  console.log('redux-status', status);

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/api/users/api/v1/login', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
      headers: { 'Content-type': 'application/json' },
      credentials: 'include', // 쿠키를 자동으로 포함시킴
    })
      .then((response) => response.json()) // JSON 응답 처리
      .then((data) => {
        if (data.status === 'success') {
          const userData = data.data.user;
          console.log(userData);
          dispatch(loginSuccess(userData)); // 로그인 성공 시 유저 정보를 Redux에 저장
          sessionStorage.setItem('user', JSON.stringify(userData));
          navigate('/'); // 로그인 후 홈 화면으로 이동
        } else {
          console.log(data);
          console.log('Login failed:', data.detail.status);
          dispatch(loginFailure(data.detail.status));
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        dispatch(loginFailure(error.message));
      });
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-info">
      <Card className="w-100" style={{ maxWidth: '400px' }}>
        <Card.Header className="text-center">
          <h2 className="font-weight-bold">로그인</h2>
          <p>EconoNews에 오신 것을 환영합니다</p>
        </Card.Header>
        <Card.Body>
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
            <Button
              variant="info"
              type="submit"
              className="w-100 text-white font-weight-bold"
            >
              로그인
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          <div className="text-muted mt-2">
            계정이 없으신가요?
            <a href="/signup" className="text-info">
              회원가입
            </a>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
