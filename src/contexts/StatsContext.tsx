import React, { createContext, useContext, useState, useEffect } from 'react';

interface Stat {
  category: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalTime: number;
  averageTime: number;
  highestScore: number;
}

interface StatsContextType {
  stats: Stat[];
  updateStats: (category: string, isCorrect: boolean, time: number, score: number) => void;
  getCategoryStats: (category: string) => Stat | undefined;
}

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
  const [stats, setStats] = useState<Stat[]>(() => {
    const savedStats = localStorage.getItem(`stats_${teamId}`);
    return savedStats ? JSON.parse(savedStats) : [];
  });

  useEffect(() => {
    localStorage.setItem(`stats_${teamId}`, JSON.stringify(stats));
  }, [stats, teamId]);

  const updateStats = (category: string, isCorrect: boolean, time: number, score: number) => {
    setStats(prevStats => {
      const existingStat = prevStats.find(stat => stat.category === category);
      
      if (existingStat) {
        return prevStats.map(stat => {
          if (stat.category === category) {
            const totalTime = stat.totalTime + time;
            const totalAnswers = stat.correctAnswers + stat.wrongAnswers + 1;
            return {
              ...stat,
              correctAnswers: isCorrect ? stat.correctAnswers + 1 : stat.correctAnswers,
              wrongAnswers: !isCorrect ? stat.wrongAnswers + 1 : stat.wrongAnswers,
              totalTime,
              averageTime: totalTime / totalAnswers,
              highestScore: Math.max(stat.highestScore, score)
            };
          }
          return stat;
        });
      }

      return [...prevStats, {
        category,
        correctAnswers: isCorrect ? 1 : 0,
        wrongAnswers: isCorrect ? 0 : 1,
        totalTime: time,
        averageTime: time,
        highestScore: score
      }];
    });
  };

  const getCategoryStats = (category: string) => {
    return stats.find(stat => stat.category === category);
  };

  return (
    <StatsContext.Provider
      value={{
        stats,
        updateStats,
        getCategoryStats
      }}
    >
      {children}
    </StatsContext.Provider>
  );
}; 