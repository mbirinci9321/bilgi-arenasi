import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTeam } from '../contexts/TeamContext';
import Chat from '../components/Chat';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const TeamInfo = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const TeamName = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 10px;
`;

const MemberList = styled.ul`
  list-style: none;
  padding: 0;
`;

const Member = styled.li`
  padding: 8px;
  background-color: white;
  border-radius: 4px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #c82333;
  }
`;

const ChatContainer = styled.div`
  height: 400px;
  margin-top: 20px;
`;

const TeamDuel: React.FC = () => {
  const navigate = useNavigate();
  const { currentTeam, leaveTeam } = useTeam();
  const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

  useEffect(() => {
    if (!currentTeam) {
      navigate('/teams');
    }
  }, [currentTeam, navigate]);

  const handleLeaveTeam = () => {
    leaveTeam();
    navigate('/teams');
  };

  if (!currentTeam) {
    return null;
  }

  const isTeamCreator = currentTeam.createdBy === user.displayName;

  return (
    <Container>
      <Header>
        <Title>Takım Düellosu</Title>
        <Button onClick={handleLeaveTeam}>
          {isTeamCreator ? 'Takımı Dağıt' : 'Takımdan Ayrıl'}
        </Button>
      </Header>

      <TeamInfo>
        <TeamName>{currentTeam.name}</TeamName>
        <MemberList>
          {currentTeam.members.map((member) => (
            <Member key={member}>
              {member} {member === currentTeam.createdBy && '(Kaptan)'}
            </Member>
          ))}
        </MemberList>
      </TeamInfo>

      <ChatContainer>
        <Chat />
      </ChatContainer>
    </Container>
  );
};

export default TeamDuel; 