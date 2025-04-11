import React from 'react';
import styled from 'styled-components';
import { useStats } from '../contexts/StatsContext';

const StatsContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-top: 1rem;
`;

const StatsTitle = styled.h3`
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  color: #4CAF50;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const CategoryStats = styled.div`
  margin-top: 1.5rem;
`;

const CategoryTitle = styled.h4`
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: #eee;
  border-radius: 4px;
  margin-top: 0.5rem;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: #4CAF50;
    border-radius: 4px;
    transition: width 0.3s ease;
  }
`;

const CategoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CategoryInfo = styled.div`
  flex: 1;
`;

const CategoryName = styled.div`
  font-weight: bold;
  color: #333;
`;

const CategoryDetails = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
`;

const TeamStats: React.FC = () => {
  const { teamStats, isLoading } = useStats();

  if (isLoading) {
    return (
      <StatsContainer>
        <LoadingMessage>İstatistikler yükleniyor...</LoadingMessage>
      </StatsContainer>
    );
  }

  if (!teamStats) {
    return (
      <StatsContainer>
        <LoadingMessage>İstatistik bulunamadı.</LoadingMessage>
      </StatsContainer>
    );
  }

  const getCategoryName = (id: string): string => {
    const categories: { [key: string]: string } = {
      'general': 'Genel Kültür',
      'science': 'Bilim & Teknoloji',
      'history': 'Tarih',
      'geography': 'Coğrafya',
      'sports': 'Spor',
      'arts': 'Sanat & Edebiyat'
    };
    return categories[id] || 'Bilinmeyen Kategori';
  };

  return (
    <StatsContainer>
      <StatsTitle>Takım İstatistikleri</StatsTitle>
      
      <StatGrid>
        <StatCard>
          <StatValue>{teamStats.totalGames}</StatValue>
          <StatLabel>Toplam Oyun</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{teamStats.totalScore}</StatValue>
          <StatLabel>Toplam Puan</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{teamStats.winStreak}</StatValue>
          <StatLabel>Kazanma Serisi</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{teamStats.bestWinStreak}</StatValue>
          <StatLabel>En İyi Seri</StatLabel>
        </StatCard>
      </StatGrid>

      <CategoryStats>
        <CategoryTitle>Kategori Bazlı Performans</CategoryTitle>
        {Object.entries(teamStats.categories).map(([categoryId, stats]) => {
          const correctPercentage = stats.totalQuestions > 0
            ? (stats.correctAnswers / stats.totalQuestions) * 100
            : 0;

          return (
            <CategoryRow key={categoryId}>
              <CategoryInfo>
                <CategoryName>{getCategoryName(categoryId)}</CategoryName>
                <CategoryDetails>
                  {stats.correctAnswers} doğru / {stats.totalQuestions} soru
                  {stats.averageTime > 0 && ` • Ort. ${stats.averageTime.toFixed(1)} saniye`}
                </CategoryDetails>
                <ProgressBar progress={correctPercentage} />
              </CategoryInfo>
            </CategoryRow>
          );
        })}
      </CategoryStats>
    </StatsContainer>
  );
};

export default TeamStats; 