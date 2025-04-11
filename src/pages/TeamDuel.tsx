import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useTeam } from '../contexts/TeamContext';
import { ChatProvider } from '../contexts/ChatContext';
import { StatsProvider } from '../contexts/StatsContext';
import Chat from '../components/Chat';
import TeamStats from '../components/TeamStats';
import { auth } from '../firebase';

const DuelContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const TeamSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const TeamCard = styled.div<{ isActive?: boolean }>`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: 2px solid ${props => props.isActive ? '#4CAF50' : '#ddd'};
`;

const TeamName = styled.h2`
  color: #333;
  text-align: center;
  margin-bottom: 1rem;
`;

const TeamScore = styled.div`
  font-size: 2.5rem;
  color: #4CAF50;
  text-align: center;
  margin-bottom: 1rem;
`;

const TeamMembers = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Member = styled.div`
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  text-align: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.8rem 1.5rem;
  background: ${props => props.variant === 'primary' ? '#4CAF50' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#4CAF50'};
  border: 2px solid #4CAF50;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 0.5rem;

  &:hover {
    background: ${props => props.variant === 'primary' ? '#45a049' : '#f0f0f0'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CreateTeamForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  flex: 1;
`;

const TeamContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NoTeamMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #333;
`;

const TeamDuel: React.FC = () => {
  const navigate = useNavigate();
  const { teams, currentTeam, createTeam, joinTeam, leaveTeam, setTeamPlaying } = useTeam();
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      await createTeam(newTeamName.trim());
      setNewTeamName('');
    }
  };

  const handleStartDuel = async () => {
    if (currentTeam) {
      await setTeamPlaying(true);
      navigate(`/quiz/${selectedCategory}`);
    }
  };

  return (
    <DuelContainer>
      <Title>Takım Düellosu</Title>
      {!currentTeam ? (
        <>
          <CreateTeamForm onSubmit={handleCreateTeam}>
            <Input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Takım adı girin..."
            />
            <Button type="submit" variant="primary">
              Takım Oluştur
            </Button>
          </CreateTeamForm>
          <TeamSection>
            {teams.map((team) => (
              <TeamCard key={team.id}>
                <TeamName>{team.name}</TeamName>
                <TeamScore>{team.score}</TeamScore>
                <TeamMembers>
                  {team.members.map((memberId, index) => (
                    <Member key={index}>Üye {index + 1}</Member>
                  ))}
                </TeamMembers>
                <Button onClick={() => joinTeam(team.id)}>
                  Takıma Katıl
                </Button>
              </TeamCard>
            ))}
          </TeamSection>
        </>
      ) : (
        <StatsProvider teamId={currentTeam.id}>
          <ChatProvider teamId={currentTeam.id}>
            <TeamContent>
              <MainContent>
                <TeamStats />
                <TeamCard isActive>
                  <TeamName>{currentTeam.name}</TeamName>
                  <TeamScore>{currentTeam.score}</TeamScore>
                  <TeamMembers>
                    {currentTeam.members.map((memberId, index) => (
                      <Member key={index}>Üye {index + 1}</Member>
                    ))}
                  </TeamMembers>
                  <Button variant="primary" onClick={handleStartDuel}>
                    Düelloyu Başlat
                  </Button>
                  <Button onClick={leaveTeam}>
                    Takımdan Ayrıl
                  </Button>
                </TeamCard>
              </MainContent>
              <Chat />
            </TeamContent>
          </ChatProvider>
        </StatsProvider>
      )}
    </DuelContainer>
  );
};

export default TeamDuel; 