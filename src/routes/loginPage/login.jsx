import { useState } from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { EyeFill, EyeSlashFill } from 'react-bootstrap-icons';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('/api/users/api/v1/login', {
      method: 'POST',
      body: JSON.stringify({ email: email, password: password }),
      headers: { 'Content-type': 'application/json' },
      credentials: 'include', // 쿠키를 자동으로 포함시킴
    })
      .then((response) => {
        console.log(response);

        return response.json(); // JSON 응답 처리
      })
      .then((data) => console.log(data));
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
