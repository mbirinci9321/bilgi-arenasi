import React from 'react';
import styled from 'styled-components';
import { useStats } from '../contexts/StatsContext';

const StatsContainer = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const StatsTitle = styled.h2`
  font-size: 20px;
  color: #333;
  margin-bottom: 16px;
`;

const StatsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

const StatCard = styled.div`
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  color: #007bff;
  font-weight: bold;
`;

const NoStatsMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
`;

const TeamStats: React.FC = () => {
  const { stats } = useStats();

  if (stats.length === 0) {
    return (
      <StatsContainer>
        <StatsTitle>Takım İstatistikleri</StatsTitle>
        <NoStatsMessage>
          Henüz istatistik bulunmuyor. Bir düello oynayarak istatistik oluşturun.
        </NoStatsMessage>
      </StatsContainer>
    );
  }

  const totalCorrectAnswers = stats.reduce((sum, stat) => sum + stat.correctAnswers, 0);
  const totalWrongAnswers = stats.reduce((sum, stat) => sum + stat.wrongAnswers, 0);
  const totalAnswers = totalCorrectAnswers + totalWrongAnswers;
  const averageAccuracy = totalAnswers > 0 
    ? Math.round((totalCorrectAnswers / totalAnswers) * 100) 
    : 0;
  const highestScore = Math.max(...stats.map(stat => stat.highestScore));
  const averageTime = stats.reduce((sum, stat) => sum + stat.averageTime, 0) / stats.length;

  return (
    <StatsContainer>
      <StatsTitle>Takım İstatistikleri</StatsTitle>
      <StatsList>
        <StatCard>
          <StatLabel>Toplam Doğru Cevap</StatLabel>
          <StatValue>{totalCorrectAnswers}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Toplam Yanlış Cevap</StatLabel>
          <StatValue>{totalWrongAnswers}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Doğruluk Oranı</StatLabel>
          <StatValue>%{averageAccuracy}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>En Yüksek Skor</StatLabel>
          <StatValue>{highestScore}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Ortalama Süre</StatLabel>
          <StatValue>{averageTime.toFixed(1)} sn</StatValue>
        </StatCard>
      </StatsList>
    </StatsContainer>
  );
};

export default TeamStats; 