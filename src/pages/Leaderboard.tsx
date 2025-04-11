import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const LeaderboardContainer = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  background: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0,0,0,0.15);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const TableHeader = styled.th`
  background-color: #4CAF50;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const TableRow = styled.tr<{ isCurrentUser?: boolean }>`
  background-color: ${props => props.isCurrentUser ? '#f0f8ff' : 'white'};
  &:nth-child(even) {
    background-color: ${props => props.isCurrentUser ? '#f0f8ff' : '#f9f9f9'};
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
`;

const MedalCell = styled(TableCell)`
  text-align: center;
  font-size: 1.2rem;
`;

const CategoryFilter = styled.select`
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid #ddd;
  margin-bottom: 1rem;
  width: 200px;
`;

interface Score {
  id: string;
  username: string;
  score: number;
  category: string;
  date: string;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState<Score[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentUser, setCurrentUser] = useState<string>('');

  useEffect(() => {
    // Burada gerçek bir API'den veri çekilecek
    // Şimdilik örnek veriler kullanıyoruz
    const mockScores: Score[] = [
      { id: '1', username: 'Ahmet', score: 100, category: 'general', date: '2024-03-20' },
      { id: '2', username: 'Mehmet', score: 95, category: 'science', date: '2024-03-20' },
      { id: '3', username: 'Ayşe', score: 90, category: 'history', date: '2024-03-20' },
      { id: '4', username: 'Fatma', score: 85, category: 'geography', date: '2024-03-20' },
      { id: '5', username: 'Ali', score: 80, category: 'sports', date: '2024-03-20' },
    ];
    setScores(mockScores);
    setCurrentUser('Ahmet'); // Gerçek uygulamada kullanıcı oturumundan alınacak
  }, []);

  const filteredScores = selectedCategory === 'all'
    ? scores
    : scores.filter(score => score.category === selectedCategory);

  const getMedal = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return `${index + 1}.`;
    }
  };

  const getCategoryName = (id: string): string => {
    const categories: { [key: string]: string } = {
      'general': 'Genel Kültür',
      'science': 'Bilim & Teknoloji',
      'history': 'Tarih',
      'geography': 'Coğrafya',
      'sports': 'Spor',
      'arts': 'Sanat & Edebiyat',
      'all': 'Tüm Kategoriler'
    };
    return categories[id] || 'Bilinmeyen Kategori';
  };

  return (
    <LeaderboardContainer>

      <Title>Liderlik Tablosu</Title>
      
      <CategoryFilter
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {Object.entries({
          'all': 'Tüm Kategoriler',
          'general': 'Genel Kültür',
          'science': 'Bilim & Teknoloji',
          'history': 'Tarih',
          'geography': 'Coğrafya',
          'sports': 'Spor',
          'arts': 'Sanat & Edebiyat'
        }).map(([id, name]) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </CategoryFilter>

      <Table>
        <thead>
          <tr>
            <TableHeader>Sıra</TableHeader>
            <TableHeader>Kullanıcı</TableHeader>
            <TableHeader>Kategori</TableHeader>
            <TableHeader>Puan</TableHeader>
            <TableHeader>Tarih</TableHeader>
          </tr>
        </thead>
        <tbody>
          {filteredScores.map((score, index) => (
            <TableRow key={score.id} isCurrentUser={score.username === currentUser}>
              <MedalCell>{getMedal(index)}</MedalCell>
              <TableCell>{score.username}</TableCell>
              <TableCell>{getCategoryName(score.category)}</TableCell>
              <TableCell>{score.score}</TableCell>
              <TableCell>{score.date}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </LeaderboardContainer>
  );
};

export default Leaderboard; 