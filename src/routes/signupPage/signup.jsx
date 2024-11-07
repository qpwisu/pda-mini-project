import { useState } from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/api/users/api/v1/signup', {
      method: 'POST',
      body: JSON.stringify({
        username: name,
        email: email,
        password: password,
      }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then((resp) => {
        return resp.json();
      })
      .then((data) => {
        console.log(data);
      });
  };

  return (
    <div className="min-vh-100 bg-info d-flex justify-content-center align-items-center px-4">
      <Card className="w-100" style={{ maxWidth: '400px' }}>
        <Card.Header className="text-center">
          <h2 className="font-weight-bold">회원가입</h2>
          <p>EconoNews의 회원이 되어 다양한 경제 뉴스를 만나보세요</p>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>이름</Form.Label>
              <Form.Control
                type="text"
                placeholder="홍길동"
                required
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

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
                  {showPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mb-3">
              <Form.Label>비밀번호 확인</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="terms" className="mb-3">
              <Form.Check
                type="checkbox"
                label={
                  <>
                    <span>
                      <Link to="/terms" className="text-info">
                        이용약관
                      </Link>
                      에 동의합니다
                    </span>
                  </>
                }
                required
              />
            </Form.Group>

            <Button
              variant="info"
              type="submit"
              className="w-100 text-white font-weight-bold"
            >
              회원가입
            </Button>
          </Form>
        </Card.Body>
        <Card.Footer className="text-center">
          <div className="text-muted mt-2">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="text-info">
              로그인
            </Link>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
