import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  margin: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <Title>Bilgi Arenası</Title>
      <Button onClick={() => navigate('/quiz')}>Yarışmaya Başla</Button>
      <Button onClick={() => navigate('/leaderboard')}>Liderlik Tablosu</Button>
      <Button onClick={() => navigate('/team-duels')}>Takım Düelloları</Button>
    </HomeContainer>
  );
};

export default Home; 