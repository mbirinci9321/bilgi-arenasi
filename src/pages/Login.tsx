import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
`;

const LoginCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  animation: ${fadeIn} 0.6s ease-out;
  backdrop-filter: blur(10px);
`;

const Title = styled.h1`
  color: #1a73e8;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  padding: 1.2rem;
  padding-left: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 1rem;
  width: 100%;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #1a73e8;
    outline: none;
    box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
  }

  &::placeholder {
    color: #9e9e9e;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 1.2rem;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #1557b0;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(26, 115, 232, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #9e9e9e;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  margin-top: 1rem;
  text-align: center;
  padding: 0.8rem;
  background: #ffebee;
  border-radius: 8px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '⚠️';
  }
`;

const Description = styled.p`
  color: #5f6368;
  text-align: center;
  margin: 1.5rem 0;
  font-size: 1rem;
  line-height: 1.6;
`;

const Logo = styled.div`
  font-size: 3rem;
  color: #1a73e8;
  text-align: center;
  margin-bottom: 1rem;
  
  &::before {
    content: '🎯';
  }
`;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name.trim() || !surname.trim()) {
      setError('Lütfen tüm alanları doldurun.');
      setIsLoading(false);
      return;
    }

    try {
      // Kullanıcı bilgilerini localStorage'a kaydet
      const userData = {
        name: name.trim(),
        surname: surname.trim(),
        displayName: `${name.trim()} ${surname.trim()}`
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo />
        <Title>Bilgi Arenası</Title>
        <Description>
          Bilgi yarışmasına katılmak için adınızı ve soyadınızı girin.
          Takım oluşturabilir, diğer takımlarla rekabet edebilir ve bilgi seviyenizi test edebilirsiniz.
        </Description>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Input
              type="text"
              placeholder="Adınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </InputGroup>
          <InputGroup>
            <Input
              type="text"
              placeholder="Soyadınız"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              disabled={isLoading}
            />
          </InputGroup>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? '⌛ Giriş Yapılıyor...' : '🎮 Oyuna Başla'}
          </Button>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 