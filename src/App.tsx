import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Quiz from './pages/Quiz';
import CategorySelect from './pages/CategorySelect';
import Leaderboard from './pages/Leaderboard';
import TeamDuel from './pages/TeamDuel';
import Login from './pages/Login';
import { TeamProvider } from './contexts/TeamContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-top: 2rem;
`;

const Navigation = styled.nav`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavButton = styled(Link)`
  padding: 0.8rem 1.5rem;
  background: white;
  color: #4CAF50;
  border: 2px solid #4CAF50;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background: #4CAF50;
    color: white;
    transform: translateY(-2px);
  }
`;

const LogoutButton = styled.button`
  padding: 0.8rem 1.5rem;
  background: white;
  color: #f44336;
  border: 2px solid #f44336;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f44336;
    color: white;
    transform: translateY(-2px);
  }
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
    
    if (!user && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (!isAuthenticated && window.location.pathname !== '/login') {
    return null;
  }

  return (
    <TeamProvider>
      <AppContainer>
        {isAuthenticated && (
          <Navigation>
            <NavButton to="/">Ana Menü</NavButton>
            <NavButton to="/leaderboard">Liderlik Tablosu</NavButton>
            <NavButton to="/team-duel">Takım Düellosu</NavButton>
            <LogoutButton onClick={handleLogout}>Çıkış Yap</LogoutButton>
          </Navigation>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<CategorySelect />} />
          <Route path="/quiz/:categoryId" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/team-duel" element={<TeamDuel />} />
        </Routes>
      </AppContainer>
    </TeamProvider>
  );
}

export default App; 