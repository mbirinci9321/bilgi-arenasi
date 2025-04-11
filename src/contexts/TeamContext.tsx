import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, where, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';

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
  createTeam: (name: string) => Promise<void>;
  joinTeam: (teamId: string) => Promise<void>;
  leaveTeam: () => Promise<void>;
  updateTeamScore: (score: number) => Promise<void>;
  setTeamPlaying: (isPlaying: boolean) => Promise<void>;
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
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Takımları dinle
    const q = query(collection(db, 'teams'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsData: Team[] = [];
      snapshot.forEach((doc) => {
        teamsData.push({ id: doc.id, ...doc.data() } as Team);
      });
      setTeams(teamsData);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Kullanıcının takımını dinle
    const q = query(
      collection(db, 'teams'),
      where('members', 'array-contains', auth.currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docData = snapshot.docs[0].data();
        setCurrentTeam({
          id: snapshot.docs[0].id,
          name: docData.name,
          members: docData.members,
          score: docData.score,
          isPlaying: docData.isPlaying,
          createdBy: docData.createdBy
        });
      } else {
        setCurrentTeam(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const createTeam = async (name: string) => {
    if (!auth.currentUser) return;

    const teamRef = await addDoc(collection(db, 'teams'), {
      name,
      members: [auth.currentUser.uid],
      score: 0,
      isPlaying: false,
      createdBy: auth.currentUser.uid,
      createdAt: new Date()
    });

    setCurrentTeam({
      id: teamRef.id,
      name,
      members: [auth.currentUser.uid],
      score: 0,
      isPlaying: false,
      createdBy: auth.currentUser.uid
    });
  };

  const joinTeam = async (teamId: string) => {
    if (!auth.currentUser) return;

    const teamRef = doc(db, 'teams', teamId);
    const team = teams.find(t => t.id === teamId);
    
    if (team && !team.isPlaying) {
      await updateDoc(teamRef, {
        members: [...team.members, auth.currentUser.uid]
      });
    }
  };

  const leaveTeam = async () => {
    if (!auth.currentUser || !currentTeam) return;

    const teamRef = doc(db, 'teams', currentTeam.id);
    const updatedMembers = currentTeam.members.filter(
      memberId => memberId !== auth.currentUser?.uid
    );

    if (updatedMembers.length === 0) {
      // Takımda kimse kalmadıysa takımı sil
      await updateDoc(teamRef, { isDeleted: true });
    } else {
      await updateDoc(teamRef, { members: updatedMembers });
    }

    setCurrentTeam(null);
  };

  const updateTeamScore = async (score: number) => {
    if (!currentTeam) return;

    const teamRef = doc(db, 'teams', currentTeam.id);
    await updateDoc(teamRef, { score });
  };

  const setTeamPlaying = async (isPlaying: boolean) => {
    if (!currentTeam) return;

    const teamRef = doc(db, 'teams', currentTeam.id);
    await updateDoc(teamRef, { isPlaying });
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