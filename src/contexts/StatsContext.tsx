import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface CategoryStats {
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  averageTime: number;
  highestScore: number;
}

interface TeamStats {
  totalGames: number;
  totalScore: number;
  winStreak: number;
  bestWinStreak: number;
  categories: {
    [key: string]: CategoryStats;
  };
  lastPlayed: Date;
}

interface StatsContextType {
  teamStats: TeamStats | null;
  updateStats: (categoryId: string, stats: Partial<CategoryStats>) => Promise<void>;
  isLoading: boolean;
}

const defaultStats: TeamStats = {
  totalGames: 0,
  totalScore: 0,
  winStreak: 0,
  bestWinStreak: 0,
  categories: {},
  lastPlayed: new Date()
};

const defaultCategoryStats: CategoryStats = {
  totalQuestions: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  averageTime: 0,
  highestScore: 0
};

const StatsContext = createContext<StatsContextType | null>(null);

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};

export const StatsProvider: React.FC<{ children: React.ReactNode; teamId: string }> = ({
  children,
  teamId
}) => {
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!teamId) return;

    const statsRef = doc(collection(db, 'teamStats'), teamId);
    const unsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        setTeamStats(doc.data() as TeamStats);
      } else {
        // Eğer istatistikler yoksa varsayılan değerleri kullan
        setTeamStats(defaultStats);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [teamId]);

  const updateStats = async (categoryId: string, newStats: Partial<CategoryStats>) => {
    if (!teamId || !teamStats) return;

    const statsRef = doc(collection(db, 'teamStats'), teamId);
    const currentCategoryStats = teamStats.categories[categoryId] || defaultCategoryStats;
    
    const updatedCategoryStats = {
      ...currentCategoryStats,
      ...newStats,
      totalQuestions: currentCategoryStats.totalQuestions + 1,
      averageTime: newStats.averageTime 
        ? (currentCategoryStats.averageTime * currentCategoryStats.totalQuestions + newStats.averageTime) / (currentCategoryStats.totalQuestions + 1)
        : currentCategoryStats.averageTime
    };

    const updatedStats = {
      ...teamStats,
      totalGames: teamStats.totalGames + 1,
      totalScore: teamStats.totalScore + (newStats.correctAnswers ? 1 : 0),
      lastPlayed: new Date(),
      categories: {
        ...teamStats.categories,
        [categoryId]: updatedCategoryStats
      }
    };

    // Kazanma serisini güncelle
    if (newStats.correctAnswers) {
      updatedStats.winStreak += 1;
      updatedStats.bestWinStreak = Math.max(updatedStats.winStreak, updatedStats.bestWinStreak);
    } else {
      updatedStats.winStreak = 0;
    }

    await updateDoc(statsRef, updatedStats);
  };

  return (
    <StatsContext.Provider
      value={{
        teamStats,
        updateStats,
        isLoading
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}; 