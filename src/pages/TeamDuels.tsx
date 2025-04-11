import React, { useState } from 'react';
import styled from 'styled-components';

interface Team {
  id: number;
  name: string;
  members: string[];
  score: number;
}

const TeamDuelsContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const TeamCard = styled.div<{ isSelected?: boolean }>`
  background-color: ${props => props.isSelected ? '#e8f5e9' : 'white'};
  border: 2px solid ${props => props.isSelected ? '#4CAF50' : '#ddd'};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #4CAF50;
  }
`;

const TeamName = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

const TeamMembers = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TeamScore = styled.div`
  color: #4CAF50;
  font-weight: bold;
`;

const CreateTeamButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  margin: 1rem 0;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const TeamDuels: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: 1,
      name: "Bilgi Avcıları",
      members: ["Ahmet", "Mehmet", "Ayşe"],
      score: 2500
    },
    {
      id: 2,
      name: "Quiz Şampiyonları",
      members: ["Ali", "Fatma", "Zeynep"],
      score: 2300
    }
  ]);

  const [selectedTeam, setSelectedTeam] = useState<number | null>(null);

  const handleTeamSelect = (teamId: number) => {
    setSelectedTeam(teamId);
  };

  const handleCreateTeam = () => {
    // Takım oluşturma işlemi
    alert("Takım oluşturma özelliği yakında eklenecek!");
  };

  return (
    <TeamDuelsContainer>
      <Title>Takım Düelloları</Title>
      
      <CreateTeamButton onClick={handleCreateTeam}>
        Yeni Takım Oluştur
      </CreateTeamButton>

      {teams.map((team) => (
        <TeamCard
          key={team.id}
          isSelected={selectedTeam === team.id}
          onClick={() => handleTeamSelect(team.id)}
        >
          <TeamName>{team.name}</TeamName>
          <TeamMembers>
            Üyeler: {team.members.join(", ")}
          </TeamMembers>
          <TeamScore>Puan: {team.score}</TeamScore>
        </TeamCard>
      ))}
    </TeamDuelsContainer>
  );
};

export default TeamDuels; 