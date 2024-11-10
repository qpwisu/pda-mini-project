import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Card, InputGroup, Alert } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { OffSignupModal, OnLoginModal } from '~/store/modalSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isPasswordChecked, setisPasswordChecked] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState('');
  const [isPasswordsame, setisPasswordsame] = useState(true);
  const [passwordCheckMessage, setpasswordCheckMessage] = useState('');
  const emailPattern =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  const passwordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;

  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isEmailChecked) {
      setEmailCheckMessage('이메일 중복 확인을 해주세요.');
      return;
    }

    if (password !== checkPassword) {
      setpasswordCheckMessage('비밀번호가 다릅니다.');
      setisPasswordsame(false);
      return;
    }

    if (!passwordPattern.test(password)) {
      setpasswordCheckMessage('유효하지 않은 비밀번호 형식입니다.');
      setisPasswordChecked(false);
      return;
    }

    fetch(`${API_BASE_URL}/users/api/v1/signup`, {
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
        if (data.status === 'success') {
          dispatch(OffSignupModal()); // 모달 창 닫기
          window.alert('회원가입 완료 환영합니다 !');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleEmailCheck = () => {
    // 이메일이 비어 있는지 확인
    if (!email.trim()) {
      setEmailCheckMessage('이메일을 입력하세요!');
      setIsEmailChecked(false);
      return;
    }
    // email 유효성 검사.
    if (!emailPattern.test(email)) {
      setEmailCheckMessage('유효하지 않은 이메일 형식입니다.');
      setIsEmailChecked(false);
      return;
    }
    // email verify api 요청.
    fetch(`${API_BASE_URL}/users/api/v1/verify-email/${email}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data.data);

        if (data.detail?.message === 'Email already exists') {
          setEmailCheckMessage('이미 사용 중인 이메일입니다.');
          setIsEmailChecked(false);
        } else if (data.status === 'success') {
          setEmailCheckMessage('사용 가능한 이메일입니다.');
          setIsEmailChecked(true);
        }
      })
      .catch(() => {
        setEmailCheckMessage('잘못된 입력입니다.');
      });
  };

  // password 유효성 검사.

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
      borderRadius: '10px',
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
          paddingTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2 style={styles.heading}>회원가입</h2>
        <p className="text-muted">
          EconoNews의 회원이 되어 다양한
          <br /> 경제 뉴스를 만나보세요
        </p>
      </Card.Header>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label style={{ marginTop: '10px' }}>이름</Form.Label>
          <Form.Control
            type="text"
            placeholder="홍길동"
            required
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="email" className="mb-3">
          <Form.Label>이메일</Form.Label>
          <InputGroup>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailChecked(false);
                setEmailCheckMessage('');
              }}
            />
            <Button variant="outline-secondary" onClick={handleEmailCheck}>
              중복 확인
            </Button>
          </InputGroup>
          {emailCheckMessage && (
            <Alert
              variant={isEmailChecked ? 'success' : 'danger'}
              className="mt-2"
            >
              {emailCheckMessage}
            </Alert>
          )}
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>비밀번호 ( 영문, 숫자, 특수문자 포함 8자이상)</Form.Label>
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
              onChange={(e) => {
                setCheckPassword(e.target.value);
              }}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeSlash /> : <Eye />}
            </Button>
          </InputGroup>
          {passwordCheckMessage && (
            <Alert
              className="mt-2"
              variant={
                isPasswordsame && isPasswordChecked ? 'success' : 'danger'
              }
            >
              {passwordCheckMessage}
            </Alert>
          )}
        </Form.Group>

        <Form.Group controlId="terms" className="mb-3">
          <Form.Check
            type="checkbox"
            label={
              <>
                <span style={styles.linkText}>이용약관</span>
                <span>에 동의합니다</span>
              </>
            }
            required
          />
        </Form.Group>

        <Button
          style={styles.button}
          type="submit"
          className="text-white font-weight-bold"
        >
          회원가입
        </Button>
      </Form>
      <Card.Footer className="text-center">
        <div className="text-muted mt-2">
          이미 계정이 있으신가요?{' '}
          <a
            onClick={() => {
              dispatch(OffSignupModal());
              dispatch(OnLoginModal());
            }}
            style={styles.linkText}
          >
            로그인
          </a>
        </div>
      </Card.Footer>
    </Card>
  );
}
