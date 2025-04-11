import React, { createContext, useContext, useState, useEffect } from 'react';

interface Team {
  id: string;
  name: string;
  members: string[];
  score: number;
  isPlaying: boolean;
  createdBy: string;
}

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  createTeam: (name: string) => void;
  joinTeam: (teamId: string) => void;
  leaveTeam: () => void;
  updateTeamScore: (score: number) => void;
  setTeamPlaying: (isPlaying: boolean) => void;
}

const TeamContext = createContext<TeamContextType | null>(null);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>(() => {
    const savedTeams = localStorage.getItem('teams');
    return savedTeams ? JSON.parse(savedTeams) : [];
  });
  
  const [currentTeam, setCurrentTeam] = useState<Team | null>(() => {
    const savedCurrentTeam = localStorage.getItem('currentTeam');
    return savedCurrentTeam ? JSON.parse(savedCurrentTeam) : null;
  });

  // Teams değiştiğinde localStorage'ı güncelle
  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  // CurrentTeam değiştiğinde localStorage'ı güncelle
  useEffect(() => {
    localStorage.setItem('currentTeam', JSON.stringify(currentTeam));
  }, [currentTeam]);

  const createTeam = (name: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      members: [user.displayName],
      score: 0,
      isPlaying: false,
      createdBy: user.displayName
    };

    setTeams(prevTeams => [...prevTeams, newTeam]);
    setCurrentTeam(newTeam);
  };

  const joinTeam = (teamId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === teamId && !team.members.includes(user.displayName)) {
          const updatedTeam = {
            ...team,
            members: [...team.members, user.displayName]
          };
          setCurrentTeam(updatedTeam);
          return updatedTeam;
        }
        return team;
      })
    );
  };

  const leaveTeam = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === currentTeam?.id) {
          const updatedMembers = team.members.filter(member => member !== user.displayName);
          if (updatedMembers.length === 0) {
            return team;
          }
          return {
            ...team,
            members: updatedMembers
          };
        }
        return team;
      })
    );
    setCurrentTeam(null);
  };

  const updateTeamScore = (score: number) => {
    if (!currentTeam) return;

    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === currentTeam.id) {
          const updatedTeam = {
            ...team,
            score
          };
          setCurrentTeam(updatedTeam);
          return updatedTeam;
        }
        return team;
      })
    );
  };

  const setTeamPlaying = (isPlaying: boolean) => {
    if (!currentTeam) return;

    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id === currentTeam.id) {
          const updatedTeam = {
            ...team,
            isPlaying
          };
          setCurrentTeam(updatedTeam);
          return updatedTeam;
        }
        return team;
      })
    );
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        currentTeam,
        createTeam,
        joinTeam,
        leaveTeam,
        updateTeamScore,
        setTeamPlaying
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}; 